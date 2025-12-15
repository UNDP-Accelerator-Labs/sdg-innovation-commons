import { NextRequest, NextResponse } from 'next/server';
import { query as dbQuery } from '@/app/lib/db';
import { safeArr } from '@/app/lib/helper';

const DEFAULT_UUID = '00000000-0000-0000-0000-000000000000';

interface CountriesRequestParams {
  countries?: string | string[];
  regions?: string | string[];
  has_lab?: boolean | string;
  use_pads?: boolean | string;
  language?: string;
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;

    const params: CountriesRequestParams = {
      countries: searchParams.getAll('countries'),
      regions: searchParams.getAll('regions'),
      has_lab: searchParams.get('has_lab') === 'true',
      use_pads: searchParams.get('use_pads') === 'true',
      language: searchParams.get('language') || 'en',
    };

    return await processCountriesRequest(params);
  } catch (error) {
    console.error('GET /api/countries error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function processCountriesRequest(params: CountriesRequestParams) {
  let { countries, regions, has_lab, use_pads, language } = params;

  // Normalize countries to array
  const countriesArr = countries ? (Array.isArray(countries) ? countries : [countries]) : undefined;
  const regionsArr = regions ? (Array.isArray(regions) ? regions : [regions]) : undefined;

  // Build filters for countries table
  const filters: string[] = [];
  if (regionsArr && regionsArr.length > 0) {
    filters.push(`c.bureau IN (${regionsArr.map((_, i) => `$${i + 1}`).join(', ')})`);
  }
  if (has_lab) {
    filters.push('c.has_lab = TRUE');
  }

  const filterStr = filters.length > 0 ? filters.join(' AND ') : 'TRUE';
  const filterParams = regionsArr || [];

  let pad_locations: any[] = [];
  let locationCountries = countriesArr;

  // If use_pads is true, get countries from pads
  if (use_pads) {
    try {
      // Get locations from pads
      const padLocationQuery = `
        SELECT DISTINCT(iso3), COUNT(DISTINCT(pad))::INT as count
        FROM locations
        WHERE pad IN (
          SELECT p.id FROM pads p
          WHERE p.status >= 3
        ) GROUP BY iso3
      `;
      
      const padLocationResult = await dbQuery('general', padLocationQuery, []);
      pad_locations = padLocationResult.rows;

      if (pad_locations.length > 0) {
        const locations = pad_locations.map(d => d.iso3);
        if (countriesArr && countriesArr.length > 0) {
          locationCountries = [...countriesArr, ...locations];
        } else {
          locationCountries = locations;
        }
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

  try {
    // Get subunits
    const subunitsQuery = `
      SELECT adm0_a3 AS iso3, su_a3 AS sub_iso3, ${nameColumn} AS country,
        jsonb_build_object('lat', ST_Y(ST_Centroid(wkb_geometry)), 'lng', ST_X(ST_Centroid(wkb_geometry))) AS location
      FROM adm0_subunits 
      WHERE TRUE
        ${locationCountries && locationCountries.length > 0 ? `AND su_a3 IN (${locationCountries.map((_, i) => `$${i + 1}`).join(', ')})` : ''}
        AND su_a3 <> adm0_a3
    `;

    const subunitsResult = await dbQuery(
      'general',
      subunitsQuery,
      locationCountries && locationCountries.length > 0 ? safeArr(locationCountries, '000') : []
    );

    // Get main countries
    const countriesQuery = `
      SELECT adm0_a3 AS iso3, ${nameColumn} AS country,
        jsonb_build_object('lat', ST_Y(ST_Centroid(wkb_geometry)), 'lng', ST_X(ST_Centroid(wkb_geometry))) AS location
      FROM adm0
      WHERE TRUE
        ${locationCountries && locationCountries.length > 0 ? `AND adm0_a3 IN (${locationCountries.map((_, i) => `$${i + 1}`).join(', ')})` : ''}
    `;

    const countriesResult = await dbQuery(
      'general',
      countriesQuery,
      locationCountries && locationCountries.length > 0 ? safeArr(locationCountries, '000') : []
    );

    // Combine results
    let locations = [...subunitsResult.rows, ...countriesResult.rows];

    // Handle equivalents (countries with subunits)
    const uniqueCountries = new Map<string, any>();
    locations.forEach(loc => {
      if (!uniqueCountries.has(loc.iso3)) {
        uniqueCountries.set(loc.iso3, { ...loc, equivalents: [] });
      }
    });

    // Find subunits and add to equivalents
    locations.forEach(loc => {
      if (loc.sub_iso3 && loc.sub_iso3 !== loc.iso3) {
        const parent = uniqueCountries.get(loc.iso3);
        if (parent && !parent.equivalents.includes(loc.sub_iso3)) {
          parent.equivalents.push(loc.sub_iso3);
        }
      }
    });

    locations = Array.from(uniqueCountries.values());

    if (locations.length > 0) {
      // Get additional country metadata
      const metadataQuery = `
        SELECT c.iso3, c.has_lab, 
          b.name AS undp_region_name, b.abbv AS undp_region 
        FROM countries c
        INNER JOIN bureaux b 
          ON b.abbv = c.bureau
        WHERE TRUE
          AND ${filterStr}
      `;

      const metadataResult = await dbQuery('general', metadataQuery, filterParams);
      
      // Join metadata with locations
      locations = locations.map(loc => {
        const metadata = metadataResult.rows.find((m: any) => m.iso3 === loc.iso3);
        return metadata ? { ...loc, ...metadata } : loc;
      });
    }

    // Sort by country name
    locations.sort((a, b) => (a?.country || '').localeCompare(b?.country || ''));

    // Add pad counts if use_pads is true
    if (use_pads && pad_locations.length > 0) {
      locations.forEach(d => {
        const padLoc = pad_locations.find(c => c.iso3 === d.iso3 || c.iso3 === d.sub_iso3);
        d.count = padLoc?.count ?? 0;
      });
    }

    return NextResponse.json(locations.length > 0 ? locations : []);
  } catch (error) {
    console.error('Error processing countries request:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
