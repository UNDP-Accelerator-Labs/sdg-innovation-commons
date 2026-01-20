import { NextRequest, NextResponse } from 'next/server';
import { query as dbQuery } from '@/app/lib/db';
import { safeArr } from '@/app/lib/helpers';
import { buildPadSubquery, PadFilterParams } from '@/app/lib/helpers/pad-filters';
import { getSessionInfo } from '@/app/lib/helpers/auth-session';

// Disable caching for this API route
export const dynamic = 'force-dynamic';

const DEFAULT_UUID = '00000000-0000-0000-0000-000000000000';

interface CountriesRequestParams {
  countries?: string | string[];
  regions?: string | string[];
  has_lab?: boolean | string;
  use_pads?: boolean | string;
  language?: string;
  space?: string;
  platform?: string | string[];
  search?: string;
  templates?: string | string[];
  mobilizations?: string | string[];
  thematic_areas?: string | string[];
  sdgs?: string | string[];
  pinboard?: string | string[];
  section?: string | number;
}

export async function GET(req: NextRequest) {
  try {
    // Extract session/auth information from session or access token
    const sessionInfo = await getSessionInfo(req);
    
    const searchParams = req.nextUrl.searchParams;

    const params: CountriesRequestParams = {
      countries: searchParams.getAll('countries'),
      regions: searchParams.getAll('regions'),
      has_lab: searchParams.get('has_lab') === 'true',
      use_pads: searchParams.get('use_pads') === 'true',
      language: searchParams.get('language') || 'en',
      space: searchParams.get('space') || undefined,
      platform: searchParams.getAll('platform'),
      search: searchParams.get('search') || undefined,
      templates: searchParams.getAll('templates'),
      mobilizations: searchParams.getAll('mobilizations'),
      thematic_areas: searchParams.getAll('thematic_areas'),
      sdgs: searchParams.getAll('sdgs'),
      pinboard: searchParams.get('pinboard') || undefined,
      section: searchParams.get('section') || undefined,
    };

    return await processCountriesRequest(params, sessionInfo);
  } catch (error) {
    console.error('GET /api/countries error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function processCountriesRequest(params: CountriesRequestParams, sessionInfo: any) {
  let { countries, regions, has_lab, use_pads, language } = params;

  // Normalize countries to array
  const countriesArr = countries ? (Array.isArray(countries) ? countries : [countries]) : undefined;
  const regionsArr = regions ? (Array.isArray(regions) ? regions : [regions]) : undefined;

  let pad_locations: any[] = [];
  let locationCountries = countriesArr;

  // If use_pads is true, get countries from pads
  if (use_pads) {
    try {
      // Special handling for pinboard queries - use pinboard_contributions directly
      // to avoid double-filtering (the pinboard API already filters accessible pads)
      if (params.pinboard && params.pinboard !== 'null' && params.pinboard !== 'undefined') {
        const pinboardId = Array.isArray(params.pinboard) ? params.pinboard[0] : params.pinboard;
        
        // Skip if pinboardId is invalid
        if (!pinboardId || pinboardId === 'null' || pinboardId === 'undefined') {
          // Treat as no pinboard query, use regular pad filtering
        } else {
        
        // Get locations from locations table (for pads that have location data)
        const locationTableQuery = `
          SELECT l.iso3, COUNT(DISTINCT(l.pad))::INT as count
          FROM locations l
          INNER JOIN pinboard_contributions pc ON pc.pad = l.pad
          INNER JOIN pads p ON p.id = l.pad
          LEFT JOIN extern_db edb ON edb.id = pc.db
          WHERE pc.pinboard = $1
            AND pc.is_included = true
            AND (edb.db IS NULL OR edb.db != 'blogs')
            AND (p.status >= 3 OR p.owner = $2::uuid OR $3 > 2)
          GROUP BY l.iso3
        `;
        
        // Get locations from pad owners (for pads without location data, like action plans)
        const ownerLocationQuery = `
          SELECT u.iso3, COUNT(DISTINCT(p.id))::INT as count
          FROM pinboard_contributions pc
          INNER JOIN pads p ON p.id = pc.pad
          INNER JOIN users u ON u.uuid = p.owner
          LEFT JOIN extern_db edb ON edb.id = pc.db
          WHERE pc.pinboard = $1
            AND pc.is_included = true
            AND (edb.db IS NULL OR edb.db != 'blogs')
            AND (p.status >= 3 OR p.owner = $2::uuid OR $3 > 2)
            AND p.id NOT IN (SELECT pad FROM locations WHERE pad = p.id)
          GROUP BY u.iso3
        `;
        
        // Fetch both location sources in parallel
        const [locationResult, ownerResult] = await Promise.all([
          dbQuery('general', locationTableQuery, [
            pinboardId,
            sessionInfo?.uuid || '00000000-0000-0000-0000-000000000000',
            sessionInfo?.rights || 0
          ]),
          dbQuery('general', ownerLocationQuery, [
            pinboardId,
            sessionInfo?.uuid || '00000000-0000-0000-0000-000000000000',
            sessionInfo?.rights || 0
          ])
        ]);
        
        // Merge both sources
        const locationMap = new Map<string, number>();
        locationResult.rows.forEach((row: any) => {
          locationMap.set(row.iso3, (locationMap.get(row.iso3) || 0) + row.count);
        });
        ownerResult.rows.forEach((row: any) => {
          locationMap.set(row.iso3, (locationMap.get(row.iso3) || 0) + row.count);
        });
        
        pad_locations = Array.from(locationMap.entries()).map(([iso3, count]) => ({ iso3, count }));
        }
      } else {
        // For non-pinboard queries, use buildPadSubquery
        const padFilterParams: PadFilterParams = {
          space: params.space,
          search: params.search,
          templates: params.templates,
          platform: params.platform,
          mobilizations: params.mobilizations,
          thematic_areas: params.thematic_areas,
          sdgs: params.sdgs,
          section: params.section,
          // Pass session/auth info for proper filtering
          uuid: sessionInfo?.uuid,
          rights: sessionInfo?.rights,
          collaborators: sessionInfo?.collaborators,
          isPublic: sessionInfo?.isPublic,
          isUNDP: sessionInfo?.isUNDP,
        };
        
        const padSubquery = await buildPadSubquery(padFilterParams);
        
        // Get locations from pads
        const padLocationQuery = `
          SELECT iso3, COUNT(DISTINCT(pad))::INT as count
          FROM locations
          WHERE pad IN (${padSubquery})
          GROUP BY iso3
        `;
        const padLocationResult = await dbQuery('general', padLocationQuery, []);
        pad_locations = padLocationResult.rows;
      }

      if (pad_locations.length > 0) {
        locationCountries = pad_locations.map(d => d.iso3);
      }
    } catch (error) {
      console.error('Error fetching pad locations:', error);
    }
  }

  // Get country name column based on language
  let nameColumn = 'name';
  if (language && language !== 'en') {
    nameColumn = `name_${language}`;
  }

  // Build filters for countries table - must be done after locationCountries is determined
  const filters: string[] = [];
  const filterParams: any[] = [];
  
  if (regionsArr && regionsArr.length > 0) {
    const startIndex = (locationCountries && locationCountries.length > 0) ? locationCountries.length + 1 : 1;
    filters.push(`c.bureau IN (${regionsArr.map((_, i) => `$${startIndex + i}`).join(', ')})`);
    filterParams.push(...regionsArr);
  }
  if (has_lab) {
    filters.push('c.has_lab = TRUE');
  }

  const filterStr = filters.length > 0 ? filters.join(' AND ') : 'TRUE';

  try {
    // Combined query for countries, subunits, and metadata in a single query
    const combinedQuery = `
      WITH country_list AS (
        SELECT adm0_a3 AS iso3, NULL AS sub_iso3, ${nameColumn} AS country,
          jsonb_build_object('lat', ST_Y(ST_Centroid(wkb_geometry)), 'lng', ST_X(ST_Centroid(wkb_geometry))) AS location
        FROM adm0
        WHERE TRUE
          ${locationCountries && locationCountries.length > 0 ? `AND adm0_a3 IN (${locationCountries.map((_, i) => `$${i + 1}`).join(', ')})` : ''}
        UNION ALL
        SELECT adm0_a3 AS iso3, su_a3 AS sub_iso3, ${nameColumn} AS country,
          jsonb_build_object('lat', ST_Y(ST_Centroid(wkb_geometry)), 'lng', ST_X(ST_Centroid(wkb_geometry))) AS location
        FROM adm0_subunits
        WHERE su_a3 <> adm0_a3
          ${locationCountries && locationCountries.length > 0 ? `AND su_a3 IN (${locationCountries.map((_, i) => `$${i + 1}`).join(', ')})` : ''}
      )
      SELECT cl.*, c.has_lab, b.name AS undp_region_name, b.abbv AS undp_region
      FROM country_list cl
      LEFT JOIN countries c ON c.iso3 = cl.iso3
      LEFT JOIN bureaux b ON b.abbv = c.bureau
      WHERE TRUE
        ${filterStr !== 'TRUE' ? `AND ${filterStr}` : ''}
    `;

    const combinedResult = await dbQuery(
      'general',
      combinedQuery,
      [
        ...(locationCountries && locationCountries.length > 0 ? safeArr(locationCountries, '000') : []),
        ...filterParams
      ]
    );

    let locations = combinedResult.rows;

    // Handle equivalents (countries with subunits)
    const uniqueCountries = new Map<string, any>();
    locations.forEach((loc: any) => {
      if (!uniqueCountries.has(loc.iso3)) {
        uniqueCountries.set(loc.iso3, { ...loc, equivalents: [] });
      }
    });

    // Find subunits and add to equivalents
    locations.forEach((loc: any) => {
      if (loc.sub_iso3 && loc.sub_iso3 !== loc.iso3) {
        const parent = uniqueCountries.get(loc.iso3);
        if (parent && !parent.equivalents.includes(loc.sub_iso3)) {
          parent.equivalents.push(loc.sub_iso3);
        }
      }
    });

    locations = Array.from(uniqueCountries.values());

    // Sort by country name
    locations.sort((a: any, b: any) => (a?.country || '').localeCompare(b?.country || ''));

    // Add pad counts if use_pads is true
    if (use_pads && pad_locations.length > 0) {
      locations.forEach((d: any) => {
        const padLoc = pad_locations.find((c: any) => c.iso3 === d.iso3 || c.iso3 === d.sub_iso3);
        d.count = padLoc?.count ?? 0;
      });
      
      // Filter to only include countries with pad counts > 0 when use_pads is true
      locations = locations.filter((d: any) => (d.count !== undefined && d.count > 0));
    } else if (use_pads) {
      // If use_pads is true but pad_locations is empty, return empty array
      locations = [];
    }

    return NextResponse.json(locations.length > 0 ? locations : []);
  } catch (error) {
    console.error('Error processing countries request:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
