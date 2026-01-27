import { NextRequest, NextResponse } from 'next/server';
import { query as dbQuery } from '@/app/lib/db';
import { safeArr, countArray, multiJoin, mapPlatformsToShortkeys, loadExternDb } from '@/app/lib/helpers';
import { buildPadSubquery, PadFilterParams } from '@/app/lib/helpers/pad-filters';
import { getSessionInfo } from '@/app/lib/helpers/auth-session';

// Disable caching for this API route
export const dynamic = 'force-dynamic';

const DEFAULT_UUID = '00000000-0000-0000-0000-000000000000';

interface TagsRequestParams {
  tags?: string | string[];
  type?: string | string[];
  pads?: string | string[];
  language?: string;
  mobilizations?: string | string[];
  countries?: string | string[];
  regions?: string | string[];
  timeseries?: boolean | string;
  use_pads?: boolean | string;
  aggregation?: string;
  output?: string;
  include_data?: boolean | string;
  space?: string;
  platform?: string | string[]; // Platform filter (e.g., 'solution', 'experiment', 'action plan')
  search?: string;
  templates?: string | string[];
  thematic_areas?: string | string[];
  sdgs?: string | string[];
  pinboard?: string | string[]; // Pinboard filter
  section?: string | number; // Section filter
}

/**
 * Build filters for tags query
 */
async function buildFilters(params: TagsRequestParams, sessionInfo: any) {
  let {
    tags,
    type,
    pads,
    language,
    mobilizations,
    countries,
    regions,
    timeseries,
    use_pads,
    platform,
  } = params;

  // Normalize arrays
  const tagsArr = tags ? (Array.isArray(tags) ? tags : [tags]) : undefined;
  const padsArr = pads ? (Array.isArray(pads) ? pads : [pads]) : undefined;
  const mobilizationsArr = mobilizations ? (Array.isArray(mobilizations) ? mobilizations : [mobilizations]) : undefined;
  const countriesArr = countries ? (Array.isArray(countries) ? countries : [countries]) : undefined;
  const regionsArr = regions ? (Array.isArray(regions) ? regions : [regions]) : undefined;
  
  // Map frontend platform names to database shortkeys
  const platformArr = platform ? mapPlatformsToShortkeys(platform) : undefined;
  const usePadsParsed = typeof use_pads === 'string' ? JSON.parse(use_pads) : use_pads;

  const typeArr = type ? (Array.isArray(type) ? type : [type]) : ['thematic_areas'];

  const generalFilters: string[] = [];
  const platformFilters: string[] = [];

  // General filters (tags table)
  if (tagsArr && tagsArr.length > 0) {
    generalFilters.push(`t.id IN (${tagsArr.map((id: any) => `${id}`).join(', ')})`);
    if (timeseries) {
      platformFilters.push(`t.tag_id IN (${tagsArr.map((id: any) => `${id}`).join(', ')})`);
    }
  }
  if (language) {
    generalFilters.push(`t.language = '${language}'`);
  }

  // Platform filters (tagging table)
  
  // Direct pads filter
  if (padsArr && padsArr.length > 0) {
    platformFilters.push(`t.pad IN (${padsArr.join(', ')})`);
  }
  
  // Direct mobilizations filter
  if (mobilizationsArr && mobilizationsArr.length > 0) {
    platformFilters.push(
      `t.pad IN (SELECT pad FROM mobilization_contributions WHERE mobilization IN (${mobilizationsArr.join(', ')}))`
    );
  }
  
  if (usePadsParsed) {
    // Special handling for pinboard queries - query pinboard_contributions directly
    if (params.pinboard) {
      const pinboardId = Array.isArray(params.pinboard) ? params.pinboard[0] : params.pinboard;
      
      // Query tags from NON-BLOG pads in the pinboard (blogs don't have local tag entries)
      // Apply the same accessibility logic as the pinboard API
      const pinboardPadSubquery = `
        SELECT DISTINCT pc.pad
        FROM pinboard_contributions pc
        INNER JOIN pads p ON p.id = pc.pad
        LEFT JOIN extern_db edb ON edb.id = pc.db
        WHERE pc.pinboard = ${pinboardId}
          AND pc.is_included = true
          AND edb.db != 'blogs'
          AND (p.status >= 3 OR p.owner = '${sessionInfo?.uuid || DEFAULT_UUID}'::uuid OR ${sessionInfo?.rights || 0} > 2)
      `;
      platformFilters.push(`t.pad IN (${pinboardPadSubquery})`);
    } else {
      // For non-pinboard queries, use buildPadSubquery
      const padFilterParams: PadFilterParams = {
        space: params.space,
        search: params.search,
        templates: params.templates,
        platform: platformArr,
        mobilizations: mobilizationsArr,
        thematic_areas: params.thematic_areas,
        sdgs: params.sdgs,
        countries: countriesArr,
        regions: regionsArr,
        section: params.section,
        // Pass session/auth info for proper filtering
        uuid: sessionInfo?.uuid,
        rights: sessionInfo?.rights,
        collaborators: sessionInfo?.collaborators,
        isPublic: sessionInfo?.isPublic,
        isUNDP: sessionInfo?.isUNDP,
      };
      
      const padSubquery = await buildPadSubquery(padFilterParams);
      platformFilters.push(`t.pad IN (${padSubquery})`);
    }
  }

  // Filter by platform(s) using ordb
  if (platformArr && platformArr.length > 0) {
    const externDbMap = await loadExternDb();
    const ids = platformArr
      .map((shortkey: string) => externDbMap.get(shortkey.toLowerCase()))
      .filter((id: number | undefined): id is number => id !== undefined);
    
    if (ids.length > 0) {
      // Embed the actual integer IDs directly in the SQL since this is a subquery filter
      platformFilters.push(
        `t.pad IN (SELECT id FROM pads WHERE ordb IN (${ids.join(', ')}))`
      );
    }
  }

  // Country filters
  if (countriesArr && countriesArr.length > 0) {
    const userUuids = await dbQuery(
      'general',
      `SELECT uuid FROM users WHERE iso3 IN (${countriesArr.map((_: any, i: number) => `$${i + 1}`).join(', ')})`,
      countriesArr
    );
    const uuids = safeArr(
      userUuids.rows.map((d: any) => d.uuid),
      DEFAULT_UUID
    );
    // Embed the UUIDs directly in the SQL as quoted strings
    platformFilters.push(
      `t.pad IN (SELECT id FROM pads WHERE owner IN (${uuids.map(u => `'${u}'`).join(', ')}))`
    );
  } else if (regionsArr && regionsArr.length > 0) {
    // Get countries from regions via UNDP bureaus
    const countriesFromRegions = await dbQuery(
      'general',
      `
      SELECT DISTINCT su_a3 AS iso3 FROM adm0_subunits WHERE undp_bureau IN (${regionsArr.map((_: any, i: number) => `$${i + 1}`).join(', ')})
      UNION
      SELECT DISTINCT adm0_a3 AS iso3 FROM adm0_subunits WHERE undp_bureau IN (${regionsArr.map((_: any, i: number) => `$${i + 1}`).join(', ')})
    `,
      regionsArr
    );

    const iso3s = safeArr(
      countriesFromRegions.rows.map((d: any) => d.iso3),
      DEFAULT_UUID
    );

    const userUuids = await dbQuery(
      'general',
      `SELECT DISTINCT uuid FROM users WHERE iso3 IN (${iso3s.map((_: any, i: number) => `$${i + 1}`).join(', ')})`,
      iso3s
    );

    const uuids = safeArr(
      userUuids.rows.map((d: any) => d.uuid),
      DEFAULT_UUID
    );
    // Embed the UUIDs directly in the SQL as quoted strings
    platformFilters.push(
      `t.pad IN (SELECT id FROM pads WHERE owner IN (${uuids.map(u => `'${u}'`).join(', ')}))`
    );
  }

  const typeFilter = typeArr && typeArr.length > 0 ? `AND t.type IN (${typeArr.map((_: any, i: number) => `$${i + 1}`).join(', ')})` : '';

  let generalFilterStr = generalFilters.join(' AND ');
  let platformFilterStr = platformFilters.join(' AND ');

  if (generalFilterStr.length && !generalFilterStr.startsWith('AND')) {
    generalFilterStr = `AND ${generalFilterStr}`;
  }
  if (platformFilterStr.length && !platformFilterStr.startsWith('AND')) {
    platformFilterStr = `AND ${platformFilterStr}`;
  }

  return {
    generalFilters: generalFilterStr,
    platformFilters: platformFilterStr,
    typeFilter,
    type: typeArr,
    tags: tagsArr,
    pads: padsArr,
    mobilizations: mobilizationsArr,
  };
}

export async function GET(req: NextRequest) {
  try {
    // Extract session/auth information from session or access token
    const sessionInfo = await getSessionInfo(req);
    
    const searchParams = req.nextUrl.searchParams;

    // Parse query parameters
    const params: TagsRequestParams = {
      tags: searchParams.getAll('tags').length ? searchParams.getAll('tags') : searchParams.get('tags') ? [searchParams.get('tags')!] : undefined,
      type: searchParams.getAll('type').length ? searchParams.getAll('type') : searchParams.get('type') ? [searchParams.get('type')!] : undefined,
      pads: searchParams.getAll('pads').length ? searchParams.getAll('pads') : searchParams.get('pads') ? [searchParams.get('pads')!] : undefined,
      language: searchParams.get('language') || undefined,
      mobilizations: searchParams.getAll('mobilizations').length ? searchParams.getAll('mobilizations') : searchParams.get('mobilizations') ? [searchParams.get('mobilizations')!] : undefined,
      countries: searchParams.getAll('countries').length ? searchParams.getAll('countries') : searchParams.get('countries') ? [searchParams.get('countries')!] : undefined,
      regions: searchParams.getAll('regions').length ? searchParams.getAll('regions') : searchParams.get('regions') ? [searchParams.get('regions')!] : undefined,
      timeseries: searchParams.get('timeseries') === 'true',
      use_pads: searchParams.get('use_pads') === 'true',
      aggregation: searchParams.get('aggregation') || 'day',
      output: searchParams.get('output') || 'json',
      include_data: searchParams.get('include_data') === 'true',
      space: searchParams.get('space') || undefined,
      platform: searchParams.getAll('platform').length ? searchParams.getAll('platform') : searchParams.get('platform') ? [searchParams.get('platform')!] : undefined,
      search: searchParams.get('search') || undefined,
      templates: searchParams.getAll('templates').length ? searchParams.getAll('templates') : searchParams.get('templates') ? [searchParams.get('templates')!] : undefined,
      thematic_areas: searchParams.getAll('thematic_areas').length ? searchParams.getAll('thematic_areas') : searchParams.get('thematic_areas') ? [searchParams.get('thematic_areas')!] : undefined,
      sdgs: searchParams.getAll('sdgs').length ? searchParams.getAll('sdgs') : searchParams.get('sdgs') ? [searchParams.get('sdgs')!] : undefined,
      pinboard: searchParams.get('pinboard') || undefined,
      section: searchParams.get('section') || undefined,
    };

    // Pass session info to buildFilters
    const { generalFilters, platformFilters, typeFilter, type, tags, pads, mobilizations } = await buildFilters(params, sessionInfo);

    // If there are platform filters OR if we need to filter by pads that are actually tagged,
    // query both tables
    const needsPadFiltering = platformFilters || params.platform || params.space || params.countries || params.regions;
    
    if (needsPadFiltering) {
      let sql: string;
      let queryParams: any[] = [];
      
      // Build type filter with correct parameter positions
      let adjustedTypeFilter = '';
      if (type && type.length > 0) {
        const startPos = params.timeseries ? 2 : 1; // Account for aggregation param in timeseries
        adjustedTypeFilter = `AND t.type IN (${type.map((_: any, i: number) => `$${startPos + i}`).join(', ')})`;
      }

      if (params.timeseries) {
        // Timeseries query
        sql = `
          SELECT tg.tag_id AS id, 
            array_agg(DATE_TRUNC($1, p.date)) AS dates
          FROM tagging tg
          INNER JOIN pads p ON tg.pad = p.id
          INNER JOIN tags t ON tg.tag_id = t.id
          WHERE TRUE
            ${platformFilters ? platformFilters.replace(/\bt\./g, 'tg.') : ''}
            ${!platformFilters ? 'AND p.status >= 3 AND p.id NOT IN (SELECT review FROM reviews)' : ''}
            ${adjustedTypeFilter}
          GROUP BY tg.tag_id
        `;
        queryParams = [params.aggregation, ...(type || [])];
      } else {
        // Regular query
        sql = `
          SELECT DISTINCT tg.tag_id AS id 
          FROM tagging tg
          INNER JOIN pads p ON tg.pad = p.id
          INNER JOIN tags t ON tg.tag_id = t.id
          WHERE TRUE
            ${platformFilters ? platformFilters.replace(/\bt\./g, 'tg.') : ''}
            ${!platformFilters ? 'AND p.status >= 3 AND p.id NOT IN (SELECT review FROM reviews)' : ''}
            ${adjustedTypeFilter}
        `;
        queryParams = [...(type || [])];
      }

      const tagResults = await dbQuery('general', sql, queryParams);

      if (tagResults.rows && tagResults.rows.length > 0) {
        // Fetch tag details from general database
        const tagIds = tagResults.rows.map((d: any) => d.id);
        
        // Build the query with proper parameter positions
        const tagDetailParams: any[] = [...tagIds];
        let tagTypeFilter = '';
        if (type && type.length > 0) {
          const typeStartPos = tagIds.length + 1;
          tagTypeFilter = `AND t.type IN (${type.map((_: any, i: number) => `$${typeStartPos + i}`).join(', ')})`;
          tagDetailParams.push(...type);
        }
        
        const tagDetailsSql = `
          SELECT t.id, t.name, t.type, t.key 
          FROM tags t
          WHERE TRUE
            ${generalFilters}
            AND t.id IN (${tagIds.map((_: any, i: number) => `$${i + 1}`).join(', ')})
            ${tagTypeFilter}
        `;

        const tagDetails = await dbQuery('general', tagDetailsSql, tagDetailParams);

        // Join results
        let data = multiJoin(tagResults.rows, [[tagDetails.rows, 'id']]);

        if (!params.timeseries) {
          // Aggregate counts
          data = countArray(data, { key: 'id', keyname: 'id', keep: ['name', 'type'] });
        } else {
          // Process timeseries
          data.forEach((d: any) => {
            d.dates.sort((a: Date, b: Date) => +a - +b);
            d.timeseries = countArray(
              d.dates.map((c: Date) => c.getTime()),
              { keyname: 'date' }
            );
            d.timeseries.forEach((c: any) => {
              c.date = new Date(c.date);
            });
            delete d.dates;
          });
        }

        return NextResponse.json(data);
      } else {
        return NextResponse.json(
          { message: 'Sorry it seems there is no content here.' },
          { status: 400 }
        );
      }
    } else {
      // No platform filters, just query tags directly
      const sql = `
        SELECT t.id, t.name, t.type, t.key 
        FROM tags t
        WHERE TRUE
          ${generalFilters}
          ${typeFilter}
      `;

      const results = await dbQuery('general', sql, type || []);
      return NextResponse.json(results.rows || []);
    }
  } catch (error) {
    console.error('GET /api/fetch/tags error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();

//     // Parse body parameters (same as GET but from body)
//     const params: TagsRequestParams = {
//       tags: body.tags,
//       type: body.type,
//       pads: body.pads,
//       language: body.language,
//       mobilizations: body.mobilizations,
//       countries: body.countries,
//       regions: body.regions,
//       timeseries: body.timeseries,
//       use_pads: body.use_pads,
//       aggregation: body.aggregation || 'day',
//       output: body.output || 'json',
//       include_data: body.include_data,
//       space: body.space,
//       platform: body.platform,
//     };

//     // Reuse GET logic
//     const { generalFilters, platformFilters, typeFilter, type } = await buildFilters(params);

//     if (platformFilters) {
//       let sql: string;
//       let queryParams: any[] = [];
      
//       // Build type filter with correct parameter positions
//       let adjustedTypeFilter = '';
//       if (type && type.length > 0) {
//         const startPos = params.timeseries ? 2 : 1; // Account for aggregation param in timeseries
//         adjustedTypeFilter = `AND t.type IN (${type.map((_: any, i: number) => `$${startPos + i}`).join(', ')})`;
//       }

//       if (params.timeseries) {
//         sql = `
//           SELECT tg.tag_id AS id, 
//             array_agg(DATE_TRUNC($1, p.date)) AS dates
//           FROM tagging tg
//           INNER JOIN pads p ON tg.pad = p.id
//           INNER JOIN tags t ON tg.tag_id = t.id
//           WHERE TRUE
//             ${platformFilters.replace(/\bt\./g, 'tg.')}
//             ${adjustedTypeFilter}
//           GROUP BY tg.tag_id
//         `;
//         queryParams = [params.aggregation, ...(type || [])];
//       } else {
//         sql = `
//           SELECT DISTINCT tg.tag_id AS id 
//           FROM tagging tg
//           INNER JOIN tags t ON tg.tag_id = t.id
//           WHERE TRUE
//             ${platformFilters.replace(/\bt\./g, 'tg.')}
//             ${adjustedTypeFilter}
//         `;
//         queryParams = [...(type || [])];
//       }

//       const tagResults = await dbQuery('general', sql, queryParams);

//       if (tagResults.rows && tagResults.rows.length > 0) {
//         const tagIds = tagResults.rows.map((d: any) => d.id);
        
//         // Build the query with proper parameter positions
//         const tagDetailParams: any[] = [...tagIds];
//         let tagTypeFilter = '';
//         if (type && type.length > 0) {
//           const typeStartPos = tagIds.length + 1;
//           tagTypeFilter = `AND t.type IN (${type.map((_: any, i: number) => `$${typeStartPos + i}`).join(', ')})`;
//           tagDetailParams.push(...type);
//         }
        
//         const tagDetailsSql = `
//           SELECT t.id, t.name, t.type, t.key 
//           FROM tags t
//           WHERE TRUE
//             ${generalFilters}
//             AND t.id IN (${tagIds.map((_: any, i: number) => `$${i + 1}`).join(', ')})
//             ${tagTypeFilter}
//         `;

//         const tagDetails = await dbQuery('general', tagDetailsSql, tagDetailParams);
//         let data = multiJoin(tagResults.rows, [[tagDetails.rows, 'id']]);

//         if (!params.timeseries) {
//           data = countArray(data, { key: 'id', keyname: 'id', keep: ['name', 'type'] });
//         } else {
//           data.forEach((d: any) => {
//             d.dates.sort((a: Date, b: Date) => +a - +b);
//             d.timeseries = countArray(
//               d.dates.map((c: Date) => c.getTime()),
//               { keyname: 'date' }
//             );
//             d.timeseries.forEach((c: any) => {
//               c.date = new Date(c.date);
//             });
//             delete d.dates;
//           });
//         }

//         return NextResponse.json(data);
//       } else {
//         return NextResponse.json(
//           { message: 'Sorry it seems there is no content here.' },
//           { status: 400 }
//         );
//       }
//     } else {
//       const sql = `
//         SELECT t.id, t.name, t.type, t.key 
//         FROM tags t
//         WHERE TRUE
//           ${generalFilters}
//           ${typeFilter}
//       `;

//       const results = await dbQuery('general', sql, type || []);
//       console.log('check results ', results);
//       return NextResponse.json(results.rows || []);
//     }
//   } catch (error) {
//     console.error('POST /api/fetch/tags error:', error);
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//   }
// }
