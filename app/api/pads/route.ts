import { NextRequest, NextResponse } from "next/server";
import { query as dbQuery } from "@/app/lib/db";
import {
  safeArr,
  mapPlatformsToShortkeys,
  mapShortkeyToPlatform,
} from "@/app/lib/helpers";
import { isURL, getImg, app_storage } from "@/app/lib/helpers/utils";
import { loadExternDb } from "@/app/lib/helpers";
import getSession from "@/app/lib/session";

// Disable caching for this API route
export const dynamic = 'force-dynamic';

interface PadsRequestParams {
  space?: string;
  search?: string;
  status?: number | string;
  contributors?: string | string[];
  countries?: string | string[];
  regions?: string | string[];
  teams?: string | string[];
  pads?: string | string[];
  id_dbpads?: string | string[];
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
  include_imgs?: boolean | string;
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
      space: searchParams.get("space") || "published",
      search: searchParams.get("search") || undefined,
      status: searchParams.get("status") || undefined,
      contributors: searchParams.getAll("contributors"),
      countries: searchParams.getAll("countries"),
      regions: searchParams.getAll("regions"),
      teams: searchParams.getAll("teams"),
      pads: searchParams.getAll("pads"),
      id_dbpads: searchParams.getAll("id_dbpads"),
      templates: searchParams.getAll("templates"),
      // Accept both 'platform' (singular) and 'platforms' (plural) for compatibility
      platforms: [
        ...searchParams.getAll("platforms"),
        ...searchParams.getAll("platform"),
      ].filter(Boolean),
      thematic_areas: searchParams.getAll("thematic_areas"),
      sdgs: searchParams.getAll("sdgs"),
      datasources: searchParams.getAll("datasources"),
      include_tags: searchParams.get("include_tags") === "true",
      include_locations: searchParams.get("include_locations") === "true",
      include_metafields: searchParams.get("include_metafields") === "true",
      include_source: searchParams.get("include_source") === "true",
      include_engagement: searchParams.get("include_engagement") === "true",
      include_comments: searchParams.get("include_comments") === "true",
      include_imgs: searchParams.get("include_imgs") === "true",
      include_pinboards: searchParams.get("include_pinboards") || undefined,
      anonymize_comments: searchParams.get("anonymize_comments") !== "false",
      pseudonymize: searchParams.get("pseudonymize")  ? searchParams.get("pseudonymize")  !== "false" : undefined,
      page: searchParams.get("page") || undefined,
      limit: searchParams.get("limit") || undefined,
    };

    return await processPadsRequest(params, req);
  } catch (error) {
    console.error("GET /api/pads error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
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
    id_dbpads,
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
    include_imgs,
    include_pinboards,
    anonymize_comments,
    pseudonymize,
    page,
    limit,
  } = params;

  const host = req.headers.get("host") || "localhost:3000";
  const session = await getSession();
  const userUuid = session?.uuid;

  // Normalize arrays
  const contributorsArr = contributors
    ? Array.isArray(contributors)
      ? contributors
      : [contributors]
    : undefined;
  const countriesArr = countries
    ? Array.isArray(countries)
      ? countries
      : [countries]
    : undefined;
  const regionsArr = regions
    ? Array.isArray(regions)
      ? regions
      : [regions]
    : undefined;
  const teamsArr = teams ? (Array.isArray(teams) ? teams : [teams]) : undefined;
  const padsArr = pads ? (Array.isArray(pads) ? pads : [pads]) : undefined;
  const id_dbPadsArr = id_dbpads
    ? Array.isArray(id_dbpads)
      ? id_dbpads
      : [id_dbpads]
    : undefined;
  const templatesArr = templates
    ? Array.isArray(templates)
      ? templates
      : [templates]
    : undefined;
  const platformsArr = platforms
    ? Array.isArray(platforms)
      ? platforms
      : [platforms]
    : undefined;
  const thematicAreasArr = thematic_areas
    ? Array.isArray(thematic_areas)
      ? thematic_areas
      : [thematic_areas]
    : undefined;
  const sdgsArr = sdgs ? (Array.isArray(sdgs) ? sdgs : [sdgs]) : undefined;
  const datasourcesArr = datasources
    ? Array.isArray(datasources)
      ? datasources
      : [datasources]
    : undefined;

  // Build filters
  const filters: string[] = [];
  const filterParams: any[] = [];

  // Space filter (published, private, shared, all)
  // Note: Skip space filter if specific pad IDs are provided, as they're already filtered
  if (!padsArr && !id_dbPadsArr) {
    if (space === "published") {
      filters.push("p.status >= 3");
    } else if (space === "private") {
      // Would need session/auth to filter by owner
      filters.push("p.status >= 0");
    }
  }

  // Status filter
  if (status !== undefined) {
    filterParams.push(+status);
    filters.push(`p.status = $${filterParams.length}`);
  }

  // Contributors filter
  // When filtering by contributor (owner), show all their pads if they're logged in
  // Otherwise only show published pads (status >= 3)
  if (contributorsArr && contributorsArr.length > 0) {
    filterParams.push(contributorsArr);
    const ownerFilter = `p.owner = ANY($${filterParams.length}::uuid[])`;
    
    // If user is logged in and viewing their own content, show all statuses
    // Otherwise, only show published content (status >= 3)
    if (userUuid && contributorsArr.includes(userUuid)) {
      // User is viewing their own content - show all
      filters.push(ownerFilter);
    } else {
      // Someone else is viewing - only show published
      filters.push(`(${ownerFilter} AND p.status >= 3)`);
    }
  }

  // Countries filter
  if (countriesArr && countriesArr.length > 0) {
    filterParams.push(countriesArr);
    filters.push(
      `p.id IN (SELECT pad FROM locations WHERE iso3 = ANY($${filterParams.length}::text[]))`
    );
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

  // Old Pads ID filter
  if (id_dbPadsArr && id_dbPadsArr.length > 0) {
    // id_db column contains concatenated strings in format "{pad_id}_{db_id}"
    // Coerce all entries to trimmed strings so SQL can compare against text[] reliably.
    const padsParam = id_dbPadsArr.map((id: any) =>
      typeof id === "string" ? id.trim() : String(id)
    );
    filterParams.push(padsParam);
    filters.push(`p.id_db = ANY($${filterParams.length}::text[])`);
  }

  // Pads  ID filter
  if (padsArr && padsArr.length > 0) {
    const padsParam = padsArr.map((id: any) => +id);
    filterParams.push(padsParam);
    filters.push(`p.id = ANY($${filterParams.length}::int[])`);
  }

  // Templates filter
  if (templatesArr && templatesArr.length > 0) {
    filterParams.push(templatesArr.map((id) => +id));
    filters.push(`p.template = ANY($${filterParams.length}::int[])`);
  }

  // Platform filter
  if (platformsArr && platformsArr.length > 0) {
    const platformShortkeys = mapPlatformsToShortkeys(platformsArr);

    try {
      // Use cached extern_db lookup instead of direct query
      const externDbMap = await loadExternDb();
      const platformIds = platformShortkeys
        .map((shortkey: string) => externDbMap.get(String(shortkey).toLowerCase()))
        .filter((id): id is number => id !== undefined);

      if (platformIds.length > 0) {
        filters.push(`p.ordb IN (${platformIds.join(",")})`);
      }
    } catch (error) {
      console.error("Error fetching platform IDs:", error);
    }
  }

  // Thematic areas filter
  if (thematicAreasArr && thematicAreasArr.length > 0) {
    filterParams.push(thematicAreasArr.map((id) => +id));
    filters.push(
      `p.id IN (SELECT pad FROM tagging WHERE tag_id = ANY($${filterParams.length}::int[]) AND type = 'thematic_areas')`
    );
  }

  // SDGs filter
  if (sdgsArr && sdgsArr.length > 0) {
    filterParams.push(sdgsArr.map((id) => +id));
    filters.push(
      `p.id IN (SELECT pad FROM tagging WHERE tag_id = ANY($${filterParams.length}::int[]) AND type = 'sdgs')`
    );
  }

  // Datasources filter
  if (datasourcesArr && datasourcesArr.length > 0) {
    filterParams.push(datasourcesArr.map((id) => +id));
    filters.push(
      `p.id IN (SELECT pad FROM tagging WHERE tag_id = ANY($${filterParams.length}::int[]) AND type = 'datasources')`
    );
  }

  // Search filter
  if (search) {
    filterParams.push(`%${search}%`);
    filters.push(
      `(p.title ILIKE $${filterParams.length} OR p.full_text ILIKE $${filterParams.length})`
    );
  }

  const filterStr = filters.length > 0 ? `AND ${filters.join(" AND ")}` : "";

  // Save filterParams before pagination for count query
  const countFilterParams = [...filterParams];

  // Pagination - if no page/limit provided, return all results
  let paginationClause = "";
  if (page || limit) {
    const pageNum = page ? +page : 1;
    const limitNum = limit ? +limit : 100;
    const offset = (pageNum - 1) * limitNum;
    filterParams.push(limitNum, offset);
    paginationClause = `LIMIT $${filterParams.length - 1} OFFSET $${filterParams.length}`;
  }

  try {
    // Build conditional SELECT fields
    const selectFields = [
      'p.id AS pad_id',
      'p.owner AS contributor_id',
      'p.title',
      'p.date AS created_at',
      'p.update_at AS updated_at',
      'p.status',
      'p.source AS source_pad_id',
      'u.name AS ownername',
      'u.position AS position',
      'u.email AS email',
      'u.iso3 AS iso3',
      'a.name_en AS country',
      'p.template',
      'p.ordb',
      'p.id_db',
      'p.sections',
      'p.full_text',
    ];

    // Conditional aggregations
    if (include_tags) {
      selectFields.push(`
        COALESCE(
          jsonb_agg(DISTINCT jsonb_build_object('tag_id', tg.tag_id, 'type', tg.type, 'key', tag.key, 'name', tag.name)) 
          FILTER (WHERE tg.tag_id IS NOT NULL), 
          '[]'
        ) AS tags`);
    }

    if (include_locations) {
      selectFields.push(`
        COALESCE(
          jsonb_agg(DISTINCT jsonb_build_object('lat', l.lat, 'lng', l.lng, 'iso3', l.iso3, 'country', adm.name_en)) 
          FILTER (WHERE l.lat IS NOT NULL AND l.lng IS NOT NULL), 
          '[]'
        ) AS locations`);
    }

    if (include_metafields) {
      selectFields.push(`
        COALESCE(
          jsonb_agg(DISTINCT jsonb_build_object('type', m.type, 'name', m.name, 'value', m.value)) 
          FILTER (WHERE m.value IS NOT NULL), 
          '[]'
        ) AS metadata`);
    }

    if (include_engagement) {
      selectFields.push(`
        COALESCE(
          jsonb_agg(DISTINCT jsonb_build_object('type', eng.type, 'count', eng.count)) 
          FILTER (WHERE eng.type IS NOT NULL), 
          '[]'
        ) AS engagement`);
      
      if (userUuid) {
        selectFields.push(`
          COALESCE(
            jsonb_agg(DISTINCT jsonb_build_object('type', ue.type, 'count', (SELECT count(type) FROM engagement WHERE type = ue.type AND docid = p.id)))
            FILTER (WHERE ue.type IS NOT NULL AND ue.contributor = '${userUuid}'),
            '[]'
          ) AS current_user_engagement`);
      }
      
      // Add page views aggregation
      selectFields.push(`
        jsonb_build_object(
          'views', COALESCE(SUM(ps.view_count), 0),
          'reads', COALESCE(SUM(ps.read_count), 0)
        ) AS views`);
    }

    if (include_comments) {
      selectFields.push(`
        COALESCE(
          jsonb_agg(DISTINCT
            jsonb_build_object(
              'message_id', cmt.id,
              'response_to_message_id', cmt.source,
              'user_id', CASE WHEN ${anonymize_comments} THEN NULL ELSE cmt.contributor END,
              'ownername', CASE WHEN ${anonymize_comments} THEN 'Anonymous' ELSE cu.name END,
              'date', cmt.date,
              'message', cmt.message
            )
          )
          FILTER (WHERE cmt.id IS NOT NULL), 
          '[]'
        ) AS comments`);
    }

    if (include_pinboards === 'all' || include_pinboards === 'own') {
      selectFields.push(`
        COALESCE(
          jsonb_agg(DISTINCT jsonb_build_object('pinboard_id', pb.id, 'title', pb.title))
          FILTER (WHERE pb.id IS NOT NULL),
          '[]'
        ) AS pinboards`);
    }

    // Build conditional JOINs
    const joins = [
      'LEFT JOIN users u ON u.uuid = p.owner',
      'LEFT JOIN adm0 a ON a.iso_a3 = u.iso3',
    ];

    if (include_tags) {
      joins.push('LEFT JOIN tagging tg ON tg.pad = p.id');
      joins.push('LEFT JOIN tags tag ON tag.id = tg.tag_id');
    }

    if (include_locations) {
      joins.push('LEFT JOIN locations l ON l.pad = p.id');
      joins.push('LEFT JOIN adm0 adm ON adm.iso_a3 = l.iso3');
    }

    if (include_metafields) {
      joins.push('LEFT JOIN metafields m ON m.pad = p.id');
    }

    if (include_engagement) {
      joins.push(`LEFT JOIN (
        SELECT docid, type, COUNT(*)::int AS count
        FROM engagement
        WHERE doctype = 'pad'
        GROUP BY docid, type
      ) eng ON eng.docid = p.id`);
      
      // Add user-specific engagement if user is logged in
      if (userUuid) {
        joins.push(`LEFT JOIN engagement ue ON ue.docid = p.id AND ue.doctype = 'pad'`);
      }
      
      // Add page stats for views/reads
      joins.push(`LEFT JOIN page_stats ps ON ps.doc_id = p.id AND ps.doc_type = 'pad'`);
    }

    if (include_comments) {
      joins.push("LEFT JOIN comments cmt ON cmt.doctype = 'pad' AND cmt.docid = p.id");
      joins.push("LEFT JOIN users cu ON cu.uuid = cmt.contributor");
    }

    if (include_pinboards === 'all' || include_pinboards === 'own') {
      if (include_pinboards === 'all') {
        joins.push(`LEFT JOIN pinboard_contributions pc ON pc.pad = p.id AND pc.is_included = TRUE`);
        joins.push('LEFT JOIN pinboards pb ON pb.id = pc.pinboard');
      } else if (include_pinboards === 'own' && userUuid) {
        joins.push(`LEFT JOIN pinboard_contributions pc ON pc.pad = p.id AND pc.is_included = TRUE`);
        joins.push(`LEFT JOIN pinboards pb ON pb.id = pc.pinboard AND (pb.owner = '${userUuid}' OR pb.id IN (SELECT pinboard FROM pinboard_contributors WHERE participant = '${userUuid}'))`);
      }
    }

    // Count query for pagination (without aggregations and LIMIT/OFFSET)
    const countQuery = `
      SELECT COUNT(DISTINCT p.id)::int AS count
      FROM pads p
      LEFT JOIN users u ON u.uuid = p.owner
      ${include_tags ? 'LEFT JOIN tagging tg ON tg.pad = p.id' : ''}
      ${include_locations ? 'LEFT JOIN locations l ON l.pad = p.id' : ''}
      WHERE TRUE
        ${filterStr}
    `;

    // Main pads query
    const padsQuery = `
      SELECT 
        ${selectFields.join(',\n        ')}
      FROM pads p
      ${joins.join('\n      ')}
      WHERE TRUE
        ${filterStr}
      GROUP BY p.id, u.name, u.position, u.email, u.iso3, a.name_en
      ORDER BY p.id DESC
      ${paginationClause}
    `;

    // Fetch count and data without caching
    const [countResult, result] = await Promise.all([
      dbQuery("general", countQuery, countFilterParams),
      dbQuery("general", padsQuery, filterParams)
    ]);
    const totalCount = countResult.rows[0]?.count || 0;
    
    let padsData = result.rows;

    // Load extern_db map once and create reverse lookup (id -> shortkey)
    const externDbMap = await loadExternDb();
    const idToShortkeyMap = new Map<number, string>();
    externDbMap.forEach((id, shortkey) => {
      idToShortkeyMap.set(id, shortkey);
    });

    // Container name mapping (computed once)
    const containerMap: { [key: string]: string } = {
      'experiment': 'experiments',
      'action plan': 'action-plans',
      'solution': 'solutions-mapping',
      'consent': 'consent',
      'codification': 'practice',
    };

    const protocol = req.headers.get("x-forwarded-proto") || "http";

    padsData.forEach((pad: any) => {
      // Compute platform name once per pad
      const platformShortkey = pad.ordb ? idToShortkeyMap.get(pad.ordb) : null;
      const platformName = platformShortkey 
        ? mapShortkeyToPlatform(platformShortkey)
        : "solution";
      
      pad.source = `${protocol}://${host}/pads/${encodeURIComponent(platformName)}/${pad.pad_id}`;

      // Generate snippet from full_text with optimized string operations
      if (pad.full_text && typeof pad.full_text === "string") {
        const cleanText = pad.full_text
          .replace(/\n+/g, " ")
          .replace(/\s+/g, " ")
          .replace(/null|undefined/g, '')
          .trim()
          .substring(0, 300);
        
        pad.snippet = cleanText || "";
      } else {
        pad.snippet = "";
      }

      // Remove sensitive data if pseudonymize is true
      if (pseudonymize) {
        delete pad.contributor_id;
        delete pad.ownername;
        delete pad.email;
        delete pad.position;
      }

      // Extract and process images if include_imgs is true
      if (include_imgs) {
        const media = getImg(pad, false);
        const containerName = containerMap[platformName.toLowerCase()] || 'solutions-mapping';
        
        pad.media = media.map((imgPath: string) => {
          if (isURL(imgPath)) {
            return imgPath;
          }
          // For relative paths, use Azure Blob Storage
          if (app_storage) {
            const cleanPath = imgPath.startsWith('/') ? imgPath.substring(1) : imgPath;
            return `${app_storage}${containerName}/${cleanPath}`;
          }
          // Fallback to local URL
          return new URL(imgPath, `${protocol}://${host}`).href;
        });

        if (app_storage) {
          const vignette_path = media?.[0];
          if (vignette_path) {
            const cleanPath = vignette_path.startsWith('/') ? vignette_path.substring(1) : vignette_path;
            pad.vignette = `${app_storage}${containerName}/${cleanPath}`;
          } else {
            pad.vignette = null;
          }
        }
      }
    });

    // Return with count for pagination support
    return NextResponse.json({
      count: totalCount ?? 0,
      data: padsData.length > 0 ? padsData : []
    });
  } catch (error) {
    console.error("Error processing pads request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
