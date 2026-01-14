import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/app/lib/db';
import getSession from '@/app/lib/session';
import { generateCacheKey, getCachedCount, setCachedCount } from '@/app/lib/helpers/count-cache';
import { page_limit as PAGE_CONTENT_LIMIT } from '@/app/lib/helpers/utils';

interface PinboardQueryParams {
  pinboard?: string | string[];
  page?: string;
  limit?: string;
  space?: 'private' | 'published' | 'all';
  databases?: string | string[];
  search?: string;
}

export async function GET(request: NextRequest) {
  return handlePinboardRequest(request);
}

export async function POST(request: NextRequest) {
  return handlePinboardRequest(request);
}

async function handlePinboardRequest(request: NextRequest) {
  try {
    const session = await getSession();
    const uuid = session?.uuid || null;
    const rights = session?.rights || 0;

    // Get parameters from query string or body
    const searchParams = request.nextUrl.searchParams;
    let params: PinboardQueryParams = {};

    if (request.method === 'GET') {
      params = {
        pinboard: searchParams.get('pinboard') || undefined,
        page: searchParams.get('page') || undefined,
        limit: searchParams.get('limit') || undefined,
        space: (searchParams.get('space') as any) || undefined,
        databases: searchParams.get('databases') || undefined,
        search: searchParams.get('search') || undefined,
      };
    } else {
      const body = await request.json().catch(() => ({}));
      params = body;
    }

    // Parse pinboard parameter and track if original was single
    let pinboard = params.pinboard;
    let isSinglePinboard = false;
    
    if (pinboard) {
      if (typeof pinboard === 'string') {
        // Check if it's a comma-separated list
        if (pinboard.includes(',')) {
          pinboard = pinboard.split(',').map(id => id.trim()).filter(Boolean);
        } else {
          isSinglePinboard = true;
          pinboard = [pinboard]; // Normalize to array
        }
      } else if (!Array.isArray(pinboard)) {
        isSinglePinboard = true;
        pinboard = [pinboard];
      }
    }

    // Parse databases parameter
    let databases = params.databases;
    if (databases && !Array.isArray(databases)) {
      if (typeof databases === 'string' && databases.includes(',')) {
        databases = databases.split(',').map(db => db.trim()).filter(Boolean);
      } else {
        databases = [databases];
      }
    }

    const page = params.page ? parseInt(params.page) : undefined;
    const limit = params.limit ? parseInt(params.limit) : undefined;
    const space = params.space;
    const search = params.search?.trim();

    // Build filters
    const filters: string[] = [];
    const filterValues: any[] = [];
    let valueIndex = 1;

    // Pinboard filter (now always an array)
    if (pinboard && Array.isArray(pinboard) && pinboard.length > 0) {
      filters.push(`p.id = ANY($${valueIndex})`);
      filterValues.push(pinboard);
      valueIndex++;
    }

    // Space filter (private, published, all)
    if (space === 'private') {
      filters.push(`
        (
          p.id IN (
            SELECT pinboard FROM pinboard_contributors
            WHERE participant = $${valueIndex}::uuid
          ) OR p.owner = $${valueIndex}::uuid
          OR $${valueIndex + 1} > 2
        )
      `);
      filterValues.push(uuid, rights);
      valueIndex += 2;
    } else if (space === 'published') {
      filters.push(`(p.status > 2 OR $${valueIndex} > 2)`);
      filterValues.push(rights);
      valueIndex++;
    } else {
      // Default to 'all' - user's pinboards and published ones
      filters.push(`
        (
          p.id IN (
            SELECT pinboard FROM pinboard_contributors
            WHERE participant = $${valueIndex}::uuid
          ) OR (p.status > 2 OR p.owner = $${valueIndex}::uuid)
          OR $${valueIndex + 1} > 2
        )
      `);
      filterValues.push(uuid, rights);
      valueIndex += 2;
    }

    // Search filter
    if (search && search.length > 0) {
      const words = search.split(/\s+/);
      const patterns = words.map(word => `%${word}%`);
      filters.push(`(p.title ILIKE ANY($${valueIndex}) OR p.description ILIKE ANY($${valueIndex}))`);
      filterValues.push(patterns);
      valueIndex++;
    }

    const whereClause = filters.length > 0 ? filters.join(' AND ') : 'TRUE';

    // Database filter
    let dbFilter = 'TRUE';
    const dbFilterValues: any[] = [];
    if (databases && Array.isArray(databases) && databases.length > 0) {
      dbFilter = `edb.db IN (SELECT UNNEST($${valueIndex}::text[]))`;
      dbFilterValues.push(databases);
      valueIndex++;
    }

    // Pagination setup
    let paginationClause = '';
    let pageFilter = '';
    const paginationValues: any[] = [];
    
    if (page && !isNaN(page)) {
      const itemsPerPage = limit && !isNaN(limit) ? limit : PAGE_CONTENT_LIMIT;
      
      if (isSinglePinboard) {
        // For single pinboard, use array slicing for pads
        const start = (page - 1) * itemsPerPage + 1;
        const end = page * itemsPerPage;
        pageFilter = `[${start}:${end}]`;
      } else {
        // For multiple pinboards, paginate the pinboards themselves
        const offset = (page - 1) * itemsPerPage;
        paginationClause = `LIMIT $${valueIndex} OFFSET $${valueIndex + 1}`;
        paginationValues.push(itemsPerPage, offset);
      }
    }

    // Unified query that includes pads array
    const mainQuery = `
      WITH counts AS (
        SELECT pc.pinboard AS pinboard_id, edb.db AS platform, COUNT(DISTINCT(pc.pad))::INT AS count
        FROM pinboard_contributions pc
        LEFT JOIN extern_db edb ON edb.id = pc.db
        ${pinboard && Array.isArray(pinboard) && pinboard.length > 0 ? `WHERE pc.pinboard = ANY($1)` : ''}
        GROUP BY (pc.pinboard, edb.db)
        ORDER BY pc.pinboard
      ),
      ${isSinglePinboard ? `accessible_pads AS (
        SELECT DISTINCT ON (pc.pad) pc.pad, pc.db, pc.pinboard, edb.db AS platform
        FROM pinboard_contributions pc
        INNER JOIN pads pad ON pad.id = pc.pad
        LEFT JOIN extern_db edb ON edb.id = pc.db
        WHERE pc.pinboard = ANY($1)
          AND pc.is_included = true
          AND ${dbFilter}
          AND (
            pad.status >= 3 
            OR pad.owner = $${valueIndex + paginationValues.length}::uuid
            OR $${valueIndex + paginationValues.length + 1} > 2
          )
        ORDER BY pc.pad, pc.db
      ),` : ''}
      pinboard_data AS (
        SELECT 
          p.id AS pinboard_id, 
          p.title, 
          p.description, 
          p.date, 
          p.status,
          p.owner,
          u.name AS owner_name,
          u.iso3 AS owner_iso3,
          u.email AS owner_email,
          COALESCE(COUNT(DISTINCT pct.participant), 0)::INT AS contributors
        FROM pinboards p
        LEFT JOIN pinboard_contributors pct ON pct.pinboard = p.id
        LEFT JOIN users u ON u.uuid = p.owner
        WHERE ${whereClause}
        GROUP BY (p.id, u.name, u.iso3, u.email)
      )
      SELECT 
        pd.pinboard_id,
        pd.title,
        pd.description,
        pd.date,
        pd.status,
        COALESCE(
          (
            SELECT json_agg(
              json_build_object(
                'pinboard_id', c.pinboard_id,
                'platform', c.platform,
                'count', c.count
              )
            )
            FROM counts c
            WHERE c.pinboard_id = pd.pinboard_id
          ),
          '[]'::json
        ) AS counts,
        ${isSinglePinboard ? `(
          SELECT COUNT(*)::INT
          FROM accessible_pads ap
          WHERE ap.pinboard = pd.pinboard_id
        )` : `COALESCE((
          SELECT SUM(c.count)::INT
          FROM counts c
          WHERE c.pinboard_id = pd.pinboard_id
        ), 0)`} AS total,
        pd.contributors,
        ${isSinglePinboard ? `(
          SELECT COALESCE(
            (
              array_agg(
                jsonb_build_object('pad_id', ap.pad, 'platform', ap.platform)
                ORDER BY ap.pad
              )
            )${pageFilter},
            '{}'
          )
          FROM accessible_pads ap
          WHERE ap.pinboard = pd.pinboard_id
        ) AS pads,` : ''}
        json_build_object(
          'name', pd.owner_name, 
          'iso3', pd.owner_iso3,
          'id', pd.owner,
          'isUNDP', pd.owner_email LIKE '%@undp.org'
        ) AS creator,
        CASE WHEN pd.owner = $${valueIndex + paginationValues.length}::uuid 
             OR $${valueIndex + paginationValues.length + 1} > 2
          THEN TRUE
          ELSE FALSE
        END AS is_contributor
      FROM pinboard_data pd
      ORDER BY pd.pinboard_id DESC
      ${paginationClause}
    `;

    const countQuery = `
      SELECT COUNT(p.id)::INT AS count
      FROM pinboards p
      WHERE ${whereClause}
        AND (
          p.id IN (
            SELECT pinboard FROM pinboard_contributors
            WHERE participant = $${filterValues.length + 1}::uuid
          ) OR (p.status > 2 OR p.owner = $${filterValues.length + 1}::uuid)
          OR $${filterValues.length + 2} > 2
        )
    `;

    const allValues = [...filterValues, ...dbFilterValues, ...paginationValues, uuid, rights];
    const countValues = [...filterValues, uuid, rights];

    // Generate cache key for count (excludes page/limit)
    const cacheKey = generateCacheKey('/api/pinboards', {
      pinboard, space, databases, search
    });

    // Try to get cached count first
    let totalCount: number | null = getCachedCount(cacheKey);
    
    // Fetch data and count - use cached count if available
    let data;
    let countResult;
    
    if (totalCount !== null && !isSinglePinboard) {
      // Use cached count, only fetch data
      data = await query('general', mainQuery, allValues);
    } else {
      // Fetch both count and data
      [data, countResult] = await Promise.all([
        query('general', mainQuery, allValues),
        isSinglePinboard ? Promise.resolve({ rows: [] }) : query('general', countQuery, countValues),
      ]);
      
      if (!isSinglePinboard) {
        totalCount = countResult.rows[0]?.count || 0;
        // Cache the count for future requests
        if (totalCount !== null && totalCount > 0) {
          setCachedCount(cacheKey, totalCount);
        }
      }
    }

    // Return response based on original request type
    if (isSinglePinboard) {
      // Single pinboard: return object directly or null
      return NextResponse.json(data.rows.length > 0 ? data.rows[0] : null);
    } else {
      // Multiple pinboards: return {count, data} structure
      return NextResponse.json({
        count: totalCount ?? 0,
        data: data.rows,
      });
    }
  } catch (error) {
    console.error('Error fetching pinboards:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pinboards' },
      { status: 500 }
    );
  }
}
