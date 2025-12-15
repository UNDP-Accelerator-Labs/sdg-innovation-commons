import { NextRequest, NextResponse } from 'next/server';
import { query as dbQuery } from '@/app/lib/db';
import { safeArr, mapPlatformsToShortkeys, mapShortkeyToPlatform } from '@/app/lib/helper';

interface PadsRequestParams {
  space?: string;
  search?: string;
  status?: number | string;
  contributors?: string | string[];
  countries?: string | string[];
  regions?: string | string[];
  teams?: string | string[];
  pads?: string | string[];
  templates?: string | string[];
  platforms?: string | string[];
  thematic_areas?: string | string[];
  sdgs?: string | string[];
  datasources?: string | string[];
  include_tags?: boolean | string;
  include_locations?: boolean | string;
  include_metafields?: boolean | string;
  include_source?: boolean | string;
  include_engagement?: boolean | string;
  include_comments?: boolean | string;
  include_pinboards?: string;
  anonymize_comments?: boolean | string;
  pseudonymize?: boolean | string;
  page?: number | string;
  limit?: number | string;
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;

    const params: PadsRequestParams = {
      space: searchParams.get('space') || 'published',
      search: searchParams.get('search') || undefined,
      status: searchParams.get('status') || undefined,
      contributors: searchParams.getAll('contributors'),
      countries: searchParams.getAll('countries'),
      regions: searchParams.getAll('regions'),
      teams: searchParams.getAll('teams'),
      pads: searchParams.getAll('pads'),
      templates: searchParams.getAll('templates'),
      // Accept both 'platform' (singular) and 'platforms' (plural) for compatibility
      platforms: [...searchParams.getAll('platforms'), ...searchParams.getAll('platform')].filter(Boolean),
      thematic_areas: searchParams.getAll('thematic_areas'),
      sdgs: searchParams.getAll('sdgs'),
      datasources: searchParams.getAll('datasources'),
      include_tags: searchParams.get('include_tags') === 'true',
      include_locations: searchParams.get('include_locations') === 'true',
      include_metafields: searchParams.get('include_metafields') === 'true',
      include_source: searchParams.get('include_source') === 'true',
      include_engagement: searchParams.get('include_engagement') === 'true',
      include_comments: searchParams.get('include_comments') === 'true',
      include_pinboards: searchParams.get('include_pinboards') || undefined,
      anonymize_comments: searchParams.get('anonymize_comments') !== 'false',
      pseudonymize: searchParams.get('pseudonymize') !== 'false',
      page: searchParams.get('page') || undefined,
      limit: searchParams.get('limit') || undefined,
    };

    return await processPadsRequest(params, req);
  } catch (error) {
    console.error('GET /api/pads error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function processPadsRequest(params: PadsRequestParams, req: NextRequest) {
  const {
    space,
    search,
    status,
    contributors,
    countries,
    regions,
    teams,
    pads,
    templates,
    platforms,
    thematic_areas,
    sdgs,
    datasources,
    include_tags,
    include_locations,
    include_metafields,
    include_source,
    include_engagement,
    include_comments,
    include_pinboards,
    anonymize_comments,
    pseudonymize,
    page,
    limit,
  } = params;

  const host = req.headers.get('host') || 'localhost:3000';

  // Normalize arrays
  const contributorsArr = contributors ? (Array.isArray(contributors) ? contributors : [contributors]) : undefined;
  const countriesArr = countries ? (Array.isArray(countries) ? countries : [countries]) : undefined;
  const regionsArr = regions ? (Array.isArray(regions) ? regions : [regions]) : undefined;
  const teamsArr = teams ? (Array.isArray(teams) ? teams : [teams]) : undefined;
  const padsArr = pads ? (Array.isArray(pads) ? pads : [pads]) : undefined;
  const templatesArr = templates ? (Array.isArray(templates) ? templates : [templates]) : undefined;
  const platformsArr = platforms ? (Array.isArray(platforms) ? platforms : [platforms]) : undefined;
  const thematicAreasArr = thematic_areas ? (Array.isArray(thematic_areas) ? thematic_areas : [thematic_areas]) : undefined;
  const sdgsArr = sdgs ? (Array.isArray(sdgs) ? sdgs : [sdgs]) : undefined;
  const datasourcesArr = datasources ? (Array.isArray(datasources) ? datasources : [datasources]) : undefined;

  // Build filters
  const filters: string[] = [];
  const filterParams: any[] = [];

  // Space filter (published, private, shared, all)
  if (space === 'published') {
    filters.push('p.status >= 3');
  } else if (space === 'private') {
    // Would need session/auth to filter by owner
    filters.push('p.status >= 0');
  }

  // Status filter
  if (status !== undefined) {
    filterParams.push(+status);
    filters.push(`p.status = $${filterParams.length}`);
  }

  // Contributors filter
  if (contributorsArr && contributorsArr.length > 0) {
    filterParams.push(contributorsArr);
    filters.push(`p.owner = ANY($${filterParams.length}::uuid[])`);
  }

  // Countries filter
  if (countriesArr && countriesArr.length > 0) {
    filterParams.push(countriesArr);
    filters.push(`p.id IN (SELECT pad FROM locations WHERE iso3 = ANY($${filterParams.length}::text[]))`);
  }

  // Regions filter (via countries)
  if (regionsArr && regionsArr.length > 0) {
    filterParams.push(regionsArr);
    filters.push(`p.id IN (
      SELECT DISTINCT l.pad 
      FROM locations l
      INNER JOIN adm0_subunits a ON a.su_a3 = l.iso3
      WHERE a.bureau = ANY($${filterParams.length}::text[])
    )`);
  }

  // Pads filter
  if (padsArr && padsArr.length > 0) {
    filterParams.push(padsArr.map(id => +id));
    filters.push(`p.id = ANY($${filterParams.length}::int[])`);
  }

  // Templates filter
  if (templatesArr && templatesArr.length > 0) {
    filterParams.push(templatesArr.map(id => +id));
    filters.push(`p.template = ANY($${filterParams.length}::int[])`);
  }

  // Platform filter
  if (platformsArr && platformsArr.length > 0) {
    const platformShortkeys = mapPlatformsToShortkeys(platformsArr);
    
    try {
      // Create placeholders starting from $1
      const platformQuery = `SELECT id FROM extern_db WHERE db IN (${platformShortkeys.map((_: any, i: number) => `$${i + 1}`).join(', ')})`;
      const platformResult = await dbQuery('general', platformQuery, platformShortkeys);
      const platformIds = platformResult.rows.map((r: any) => r.id);

      if (platformIds.length > 0) {
        filters.push(`p.ordb IN (${platformIds.join(',')})`);
      }
    } catch (error) {
      console.error('Error fetching platform IDs:', error);
    }
  }

  // Thematic areas filter
  if (thematicAreasArr && thematicAreasArr.length > 0) {
    filterParams.push(thematicAreasArr.map(id => +id));
    filters.push(`p.id IN (SELECT pad FROM tagging WHERE tag_id = ANY($${filterParams.length}::int[]) AND type = 'thematic_areas')`);
  }

  // SDGs filter
  if (sdgsArr && sdgsArr.length > 0) {
    filterParams.push(sdgsArr.map(id => +id));
    filters.push(`p.id IN (SELECT pad FROM tagging WHERE tag_id = ANY($${filterParams.length}::int[]) AND type = 'sdgs')`);
  }

  // Datasources filter
  if (datasourcesArr && datasourcesArr.length > 0) {
    filterParams.push(datasourcesArr.map(id => +id));
    filters.push(`p.id IN (SELECT pad FROM tagging WHERE tag_id = ANY($${filterParams.length}::int[]) AND type = 'datasources')`);
  }

  // Search filter
  if (search) {
    filterParams.push(`%${search}%`);
    filters.push(`(p.title ILIKE $${filterParams.length} OR p.full_text ILIKE $${filterParams.length})`);
  }

  const filterStr = filters.length > 0 ? `AND ${filters.join(' AND ')}` : '';

  // Pagination - if no page/limit provided, return all results
  let paginationClause = '';
  if (page || limit) {
    const pageNum = page ? +page : 1;
    const limitNum = limit ? +limit : 100;
    const offset = (pageNum - 1) * limitNum;
    filterParams.push(limitNum, offset);
    paginationClause = `LIMIT $${filterParams.length - 1} OFFSET $${filterParams.length}`;
  }

  try {
    // Main pads query
    const padsQuery = `
      SELECT 
        p.id AS pad_id,
        p.owner AS contributor_id,
        p.title,
        p.date AS created_at,
        p.update_at AS updated_at,
        p.status,
        p.source AS source_pad_id,
        p.template,
        p.ordb,
        p.sections,
        p.full_text,
        e.db AS platform_db,
        COALESCE(
          jsonb_agg(DISTINCT jsonb_build_object('tag_id', tg.tag_id, 'type', tg.type, 'key', tag.key, 'name', tag.name)) 
          FILTER (WHERE tg.tag_id IS NOT NULL), 
          '[]'
        ) AS tags,
        COALESCE(
          jsonb_agg(DISTINCT jsonb_build_object('lat', l.lat, 'lng', l.lng, 'iso3', l.iso3, 'country', adm.name_en)) 
          FILTER (WHERE l.lat IS NOT NULL AND l.lng IS NOT NULL), 
          '[]'
        ) AS locations,
        COALESCE(
          jsonb_agg(DISTINCT jsonb_build_object('type', m.type, 'name', m.name, 'value', m.value)) 
          FILTER (WHERE m.value IS NOT NULL), 
          '[]'
        ) AS metadata
      FROM pads p
      LEFT JOIN extern_db e ON e.id = p.ordb
      LEFT JOIN tagging tg ON tg.pad = p.id
      LEFT JOIN tags tag ON tag.id = tg.tag_id
      LEFT JOIN locations l ON l.pad = p.id
      LEFT JOIN adm0 adm ON adm.iso_a3 = l.iso3
      LEFT JOIN metafields m ON m.pad = p.id
      WHERE TRUE
        ${filterStr}
      GROUP BY p.id, e.db
      ORDER BY p.id DESC
      ${paginationClause}
    `;

    const result = await dbQuery('general', padsQuery, filterParams);
    let padsData = result.rows;

    // Join user information
    const userIds = [...new Set(padsData.map((p: any) => p.contributor_id).filter(Boolean))];
    if (userIds.length > 0) {
      const usersQuery = `
        SELECT u.uuid, u.name, u.email, u.position, u.iso3
        FROM users u
        WHERE u.uuid = ANY($1::uuid[])
      `;
      const usersResult = await dbQuery('general', usersQuery, [userIds]);
      const usersMap = new Map(usersResult.rows.map((u: any) => [u.uuid, u]));

      padsData = padsData.map((pad: any) => {
        const user: any = usersMap.get(pad.contributor_id);
        if (user) {
          return {
            ...pad,
            contributor_name: user.name,
            contributor_email: pseudonymize ? undefined : user.email,
            contributor_position: pseudonymize ? undefined : user.position,
            contributor_country: user.iso3,
          };
        }
        return pad;
      });
    }

    // Add source link with platform-based URL, set country fallback, and generate snippet
    // Get unique contributor country codes for lookup
    const contributorCountries = [...new Set(padsData.map((p: any) => p.contributor_country).filter(Boolean))];
    let countryNamesMap = new Map();
    
    if (contributorCountries.length > 0) {
      const countryQuery = `
        SELECT iso_a3, name_en 
        FROM adm0 
        WHERE iso_a3 = ANY($1::text[])
      `;
      const countryResult = await dbQuery('general', countryQuery, [contributorCountries]);
      countryNamesMap = new Map(countryResult.rows.map((c: any) => [c.iso_a3, c.name_en]));
    }
    
    padsData.forEach((pad: any) => {
      const platformName = pad.platform_db ? mapShortkeyToPlatform(pad.platform_db) : 'solution';
      pad.source = `${req.headers.get('x-forwarded-proto') || 'http'}://${host}/pads/${encodeURIComponent(platformName)}/${pad.pad_id}`;
      
      // Set country field from contributor_country if no locations exist
      // This will be used by getCountryList as fallback
      if (!pad.locations || pad.locations.length === 0) {
        if (pad.contributor_country) {
          pad.country = countryNamesMap.get(pad.contributor_country) || pad.contributor_country;
        } else {
          pad.country = 'NUL';
        }
      }
      
      // Generate snippet from full_text (first 300 characters, will be truncated to 200 by polishTags)
      // Note: NLP API may override this snippet with search-relevant snippets
      if (pad.full_text && typeof pad.full_text === 'string') {
        let cleanText = pad.full_text
          .replace(/\n+/g, ' ')  // Replace newlines with spaces
          .replace(/\s+/g, ' ')  // Replace multiple spaces with single space
          .trim();
        
        // Remove title from the beginning if it exists
        if (pad.title && cleanText.startsWith(pad.title)) {
          cleanText = cleanText.substring(pad.title.length).trim();
        }
        
        // Filter out null/undefined text values
        const snippet = cleanText.substring(0, 300);
        pad.snippet = (snippet && snippet !== 'null' && snippet !== 'undefined') ? snippet : '';
      } else {
        pad.snippet = '';
      }
      
      // Remove sensitive data if pseudonymize is true
      if (pseudonymize) {
        delete pad.contributor_id;
        delete pad.contributor_name;
        delete pad.contributor_email;
        delete pad.contributor_position;
      }
      
      // Remove internal platform_db field from response
      delete pad.platform_db;
    });

    // Include engagement data
    if (include_engagement) {
      const padIds = padsData.map((p: any) => p.pad_id);
      if (padIds.length > 0) {
        const engagementQuery = `
          SELECT docid AS pad_id, type, COUNT(type)::int AS count
          FROM engagement
          WHERE doctype = 'pad' AND docid = ANY($1::int[])
          GROUP BY docid, type
        `;
        const engagementResult = await dbQuery('general', engagementQuery, [padIds]);
        
        const engagementMap = new Map();
        engagementResult.rows.forEach((e: any) => {
          if (!engagementMap.has(e.pad_id)) {
            engagementMap.set(e.pad_id, []);
          }
          engagementMap.get(e.pad_id).push({ type: e.type, count: e.count });
        });

        padsData = padsData.map((pad: any) => ({
          ...pad,
          engagement: engagementMap.get(pad.pad_id) || [],
        }));
      }
    }

    // Include comments
    if (include_comments) {
      const padIds = padsData.map((p: any) => p.pad_id);
      if (padIds.length > 0) {
        const commentsQuery = `
          SELECT 
            docid AS pad_id,
            id AS message_id,
            source AS response_to_message_id,
            contributor AS user_id,
            date,
            message
          FROM comments
          WHERE doctype = 'pad' AND docid = ANY($1::int[])
          ORDER BY docid, id
        `;
        const commentsResult = await dbQuery('general', commentsQuery, [padIds]);
        
        const commentsMap = new Map();
        commentsResult.rows.forEach((c: any) => {
          if (!commentsMap.has(c.pad_id)) {
            commentsMap.set(c.pad_id, []);
          }
          if (anonymize_comments) {
            delete c.user_id;
          }
          commentsMap.get(c.pad_id).push(c);
        });

        padsData = padsData.map((pad: any) => ({
          ...pad,
          comments: commentsMap.get(pad.pad_id) || [],
        }));
      }
    }

    return NextResponse.json(padsData.length > 0 ? padsData : []);
  } catch (error) {
    console.error('Error processing pads request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
