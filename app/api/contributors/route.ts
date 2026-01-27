import { NextRequest, NextResponse } from 'next/server';
import { query as dbQuery } from '@/app/lib/db';
import { safeArr } from '@/app/lib/helpers';
import { getSessionInfo } from '@/app/lib/helpers/auth-session';

// Disable caching for this API route
export const dynamic = 'force-dynamic';

const DEFAULT_UUID = '00000000-0000-0000-0000-000000000000';

interface ContributorsRequestParams {
  output?: string;
  include_data?: boolean | string;
  include_teams?: boolean | string;
  include_contributions?: boolean | string;
  language?: string;
  space?: string;
  search?: string;
  status?: string | string[];
  countries?: string | string[];
  positions?: string | string[];
  rights?: string | string[];
  pinboard?: string | number;
  page?: string;
  year?: string;
  month?: string;
  sso_user?: boolean | string;
}

/**
 * Build filters for contributors query
 */
async function buildFilters(params: ContributorsRequestParams, sessionInfo: any) {
  const { uuid, rights } = sessionInfo || {};
  let { space, search, status, countries, positions, rights: userrights, pinboard, page, year, month, sso_user } = params;

  // Normalize arrays
  const statusArr = status ? (Array.isArray(status) ? status : [status]) : undefined;
  const countriesArr = countries ? (Array.isArray(countries) ? countries : [countries]) : undefined;
  const positionsArr = positions ? (Array.isArray(positions) ? positions : [positions]) : undefined;
  const userrightsArr = userrights ? (Array.isArray(userrights) ? userrights : [userrights]) : undefined;

  const baseFilters: string[] = [];
  const platformFilters: string[] = [];
  const contentFilters: string[] = [];

  // Base filters
  if (statusArr && statusArr.length > 0) {
    baseFilters.push(`u.confirmed IN (${statusArr.join(', ')})`);
  }

  // Space filter
  let fSpace = '';
  // Get write rights for pads
  const writeRights = 4; // Default write rights (you might want to get this from config)
  
  if (space === 'all') {
    fSpace = `u.rights >= ${writeRights}`;
    baseFilters.push(fSpace);
  } else if (space === 'invited') {
    fSpace = `(u.uuid IN (SELECT contributor FROM cohorts WHERE host = '${uuid || DEFAULT_UUID}'::uuid) OR ${rights || 0} > 2)`;
    baseFilters.push(fSpace);
  }

  // Platform filters
  if (countriesArr && countriesArr.length > 0) {
    platformFilters.push(`u.iso3 IN (${countriesArr.map(c => `'${c}'`).join(', ')})`);
  }
  if (userrightsArr && userrightsArr.length > 0) {
    platformFilters.push(`u.rights IN (${userrightsArr.join(', ')})`);
  }
  if (positionsArr && positionsArr.length > 0) {
    platformFilters.push(`u.position IN (${positionsArr.map(p => `'${p}'`).join(', ')})`);
  }
  if (pinboard) {
    platformFilters.push(`u.uuid IN (SELECT member FROM team_members WHERE team = ${pinboard})`);
  }

  // Content filters
  if (search) {
    // Escape special regex characters
    const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    contentFilters.push(`(u.name || ' ' || COALESCE(u.position, '')) ~* '${escapedSearch}'`);
  }

  // Date filters
  const isSsoUser = sso_user === 'true' || sso_user === true;
  if (year && month) {
    contentFilters.push(
      `(EXTRACT(YEAR FROM COALESCE(u.created_at, u.invited_at)) = ${year} ` +
      `AND TRIM(TO_CHAR(COALESCE(u.created_at, u.invited_at), 'Month')) ILIKE '${month}' ` +
      `AND u.created_from_sso = ${isSsoUser})`
    );
  } else if (month && (!year || year === 'undefined')) {
    contentFilters.push(
      `(EXTRACT(YEAR FROM COALESCE(u.created_at, u.invited_at)) = ${month} ` +
      `AND u.created_from_sso = ${isSsoUser})`
    );
  }

  // Pagination by first letter if no platform/content filters
  let paginationPage = page;
  if (!platformFilters.length && !contentFilters.length) {
    if (!paginationPage) {
      // Get first letter
      const firstLetterResult = await dbQuery(
        'general',
        `SELECT LEFT(u.name, 1) AS letter
         FROM users u
         WHERE (u.uuid IN (SELECT contributor FROM cohorts WHERE host = $1::uuid) OR $2 > 2)
         ORDER BY u.name
         LIMIT 1`,
        [uuid || DEFAULT_UUID, rights || 0]
      );
      paginationPage = firstLetterResult.rows[0]?.letter || 'A';
    }
    contentFilters.push(`LEFT(u.name, 1) = '${paginationPage}'`);
  }

  const allFilters = [...baseFilters, ...platformFilters, ...contentFilters].filter(f => f);
  const filterString = allFilters.length > 0 ? `AND ${allFilters.join(' AND ')}` : '';

  return { filterString, fSpace, page: paginationPage };
}

export async function GET(req: NextRequest) {
  try {
    // Extract session/auth information
    const sessionInfo = await getSessionInfo(req);
    
    // Require authentication to access contributors endpoint
    if (!sessionInfo?.uuid) {
      return NextResponse.json(
        { error: 'Authentication required. Please log in or use access token to access contributors data.' },
        { status: 401 }
      );
    }

    const searchParams = req.nextUrl.searchParams;

    // Check for authenticated user for certain operations
    const corsFilter = !sessionInfo?.uuid ? 'AND FALSE' : '';

    const params: ContributorsRequestParams = {
      output: searchParams.get('output') || 'json',
      include_data: searchParams.get('include_data') === 'true',
      include_teams: searchParams.get('include_teams') === 'true',
      include_contributions: searchParams.get('include_contributions') === 'true',
      language: searchParams.get('language') || 'en',
      space: searchParams.get('space') || undefined,
      search: searchParams.get('search') || undefined,
      status: searchParams.getAll('status').length ? searchParams.getAll('status') : searchParams.get('status') || undefined,
      countries: searchParams.getAll('countries').length ? searchParams.getAll('countries') : searchParams.get('countries') || undefined,
      positions: searchParams.getAll('positions').length ? searchParams.getAll('positions') : searchParams.get('positions') || undefined,
      rights: searchParams.getAll('rights').length ? searchParams.getAll('rights') : searchParams.get('rights') || undefined,
      pinboard: searchParams.get('pinboard') || undefined,
      page: searchParams.get('page') || undefined,
      year: searchParams.get('year') || undefined,
      month: searchParams.get('month') || undefined,
      sso_user: searchParams.get('sso_user') || undefined,
    };

    return await processContributorsRequest(params, sessionInfo, corsFilter);
  } catch (error) {
    console.error('GET /api/contributors error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function processContributorsRequest(
  params: ContributorsRequestParams,
  sessionInfo: any,
  corsFilter: string
) {
  const { output, include_data, include_teams, include_contributions, language } = params;

  // Build filters
  const { filterString } = await buildFilters(params, sessionInfo);

  try {
    // Get name column based on language
    let nameColumn = 'name';
    if (language && language !== 'en') {
      nameColumn = `name_${language}`;
    }

    // Main query to get users
    const usersQuery = `
      SELECT u.uuid, u.name, u.email, u.position, u.iso3,
        u.language AS primary_language, u.secondary_languages,
        u.invited_at, u.confirmed_at, u.left_at,
        COALESCE(
          (SELECT json_agg(t.name) FROM teams t
           INNER JOIN team_members tm ON tm.team = t.id
           WHERE tm.member = u.uuid
           GROUP BY tm.member
          )::TEXT, '[]')::JSONB AS teams
      FROM users u
      WHERE TRUE
        ${filterString}
        ${corsFilter}
      ORDER BY u.iso3, u.name ASC
    `;

    const usersResult = await dbQuery('general', usersQuery, []);
    let users = usersResult.rows;

    if (users.length === 0) {
      return NextResponse.json([]);
    }

    // Join location info
    const iso3s = [...new Set(users.map((u: any) => u.iso3))].filter(Boolean);
    if (iso3s.length > 0) {
      const locationQuery = `
        SELECT adm0_a3 AS iso3, ${nameColumn} AS country,
          jsonb_build_object('lat', ST_Y(ST_Centroid(wkb_geometry)), 'lng', ST_X(ST_Centroid(wkb_geometry))) AS location
        FROM adm0
        WHERE adm0_a3 IN (${iso3s.map((_, i) => `$${i + 1}`).join(', ')})
        UNION ALL
        SELECT su_a3 AS iso3, ${nameColumn} AS country,
          jsonb_build_object('lat', ST_Y(ST_Centroid(wkb_geometry)), 'lng', ST_X(ST_Centroid(wkb_geometry))) AS location
        FROM adm0_subunits
        WHERE su_a3 IN (${iso3s.map((_, i) => `$${i + 1}`).join(', ')})
          AND su_a3 <> adm0_a3
      `;
      const locationResult = await dbQuery('general', locationQuery, iso3s);
      const locationMap = new Map(locationResult.rows.map((l: any) => [l.iso3, l]));
      
      users = users.map((u: any) => {
        const locData: any = locationMap.get(u.iso3);
        if (locData) {
          return { ...u, country: locData.country, location: locData.location };
        }
        return u;
      });
    }

    // Get contributions if requested
    if (include_contributions) {
      const ids = safeArr(users.map((u: any) => u.uuid), DEFAULT_UUID);

      const [padsResult, templatesResult, mobilizationsResult] = await Promise.all([
        dbQuery(
          'general',
          `SELECT id, title, owner,
            CASE WHEN status = 2 THEN 'Preprint' ELSE 'Published' END AS status
           FROM pads
           WHERE status >= 2 AND owner IN (${ids.map((_, i) => `$${i + 1}`).join(', ')})
           ORDER BY owner`,
          ids
        ),
        dbQuery(
          'general',
          `SELECT id, title, owner,
            CASE WHEN status = 2 THEN 'Preprint' ELSE 'Published' END AS status
           FROM templates
           WHERE status >= 2 AND owner IN (${ids.map((_, i) => `$${i + 1}`).join(', ')})
           ORDER BY owner`,
          ids
        ),
        dbQuery(
          'general',
          `SELECT id, title, owner,
            CASE WHEN status = 1 THEN 'Ongoing' ELSE 'Ended' END AS status
           FROM mobilizations
           WHERE status >= 1 AND owner IN (${ids.map((_, i) => `$${i + 1}`).join(', ')})
           ORDER BY owner`,
          ids
        ),
      ]);

      const pads = padsResult.rows;
      const templates = templatesResult.rows;
      const mobilizations = mobilizationsResult.rows;

      users = users.map((u: any, index: number) => {
        u.contributor_id = `c-${index + 1}`;
        u.pads = pads.filter((p: any) => p.owner === u.uuid);
        u.templates = templates.filter((t: any) => t.owner === u.uuid);
        u.campaigns = mobilizations.filter((m: any) => m.owner === u.uuid);
        return u;
      });
    } else {
      users = users.map((u: any, index: number) => {
        u.contributor_id = `c-${index + 1}`;
        return u;
      });
    }

    // Remove sensitive data if not requested
    if (!include_data) {
      users = users.map((u: any) => {
        const { name, email, position, iso3, country, primary_language, secondary_languages, invited_at, confirmed_at, left_at, location, ...rest } = u;
        return rest;
      });
    }

    // Remove teams if not requested
    if (!include_teams) {
      users = users.map((u: any) => {
        const { teams, ...rest } = u;
        return rest;
      });
    }

    // Remove uuid in all cases
    users = users.map((u: any) => {
      const { uuid, ...rest } = u;
      return rest;
    });

    // Format output
    if (output === 'geojson') {
      const features = users
        .filter((u: any) => u.location)
        .map((u: any) => {
          const { location, ...properties } = u;
          return {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [location.lng, location.lat],
            },
            properties,
          };
        });

      return NextResponse.json({
        type: 'FeatureCollection',
        features,
      });
    }

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error processing contributors request:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
