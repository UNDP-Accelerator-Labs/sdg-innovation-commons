'use server';
import { DB } from '@/app/lib/db';
import { get_externalDb, extractSDGNumbers } from '@/app/lib/utils';
import get from '@/app/lib/data/get';

interface AllCollectionProps {
    search?: string;
    theme?: string;
    page?: number;
    limit?: number;
}

export async function get_all_collections({ search = '', theme = '', page = 1, limit = 10 }: AllCollectionProps) {
    try {
        let countQuery = `
            SELECT COUNT(*) FROM public.pinboards p
            WHERE p.status > 1
        `;

        const conditions: string[] = [];

        // Add search filter if provided
        if (search) {
            conditions.push(`(p.title ILIKE $/search/ OR p.description ILIKE $/search/)`);
        }

        // Add theme filter if provided
        if (theme) {
            conditions.push(`p.theme = $/theme/`);
        }

        // If there are conditions, append them to the query
        if (conditions.length > 0) {
            countQuery += ` AND ${conditions.join(' AND ')}`;
        }

        // Format the count query
        const formattedCountQuery = DB.pgp.as.format(countQuery, {
            search: `%${search}%`,
            theme,
        });

        // Get the total number of pinboards matching the conditions
        const totalCountResult = await DB.general.one(formattedCountQuery);
        const totalCount = parseInt(totalCountResult.count, 10);

        // Calculate the total number of pages
        const totalPages = Math.ceil(totalCount / limit);

        // Build the query to fetch the actual pinboards with limit and offset
        let baseQuery = `
            SELECT
                p.*, 
                COUNT(pc.pad) AS pad_count,
                COALESCE(JSON_AGG(
                    DISTINCT JSONB_BUILD_OBJECT('pad', pc.pad, 'db', pc.db)
                ) FILTER (WHERE pc.pad IS NOT NULL), '[]') AS pads
            FROM
                public.pinboards p
            LEFT JOIN
                public.pinboard_contributions pc
            ON
                p.id = pc.pinboard
            WHERE
                p.status > 1
                AND pc.db IN (1, 2, 4) -- sm, exp and ap dbs
        `;

        // Add the same conditions for search and theme
        if (conditions.length > 0) {
            baseQuery += ` AND ${conditions.join(' AND ')}`;
        }

        // Add the GROUP BY, ORDER BY, LIMIT, and OFFSET clauses
        baseQuery += `
            GROUP BY p.id
            ORDER BY p.id
            LIMIT $/limit/
            OFFSET $/offset/
        `;

        // Calculate the offset for pagination
        const offset = (page - 1) * limit;

        // Format the base query
        const finalQuery = DB.pgp.as.format(baseQuery, {
            search: `%${search}%`,
            theme,
            limit,
            offset
        });

        // Execute the formatted query to get the pinboards
        const data = await DB.general.any(finalQuery);

        // Return the data along with pagination info
        return {
            data,
            pagination: {
                totalPages,
                currentPage: page,
                totalItems: totalCount
            }
        };
    } catch (error) {
        console.error('error:', error);
        return null;
    }
}

export async function get_collection(id: number) {
    try {
        const col = await DB.general.oneOrNone(`
            SELECT
                p.*, 
                COALESCE(JSON_AGG(
                    DISTINCT JSONB_BUILD_OBJECT('pad', pc.pad, 'db', pc.db)
                ) FILTER (WHERE pc.pad IS NOT NULL), '[]') AS pads
            FROM
                public.pinboards p
            LEFT JOIN
                public.pinboard_contributions pc
            ON
                p.id = pc.pinboard
            WHERE
                p.id = $1
            GROUP BY p.id
        `, [id]);

        if (!col) {
            return null; 
        }

        // Group pads by db_id
        const padsByDb: Record<number, number[]> = {};
        col.pads.forEach((padObj: { pad: number, db: number }) => {
            if (!padsByDb[padObj.db]) {
                padsByDb[padObj.db] = [];
            }
            padsByDb[padObj.db].push(padObj.pad);
        });
       
        // Fetch pads from different external DBs
        const fetchedDataPromises = Object.keys(padsByDb).map(async (db_id) => {
            const base_url = await get_externalDb(+db_id); // Get base URL for the db_id
            if (base_url) {
                const pad_ids = padsByDb[db_id as unknown as number]
                
                const url = `${base_url}/apis/fetch/pads?pads=${pad_ids.join('&pads=')}&output=json&include_engagement=true&include_tags=true&include_metafields=true&include_data=true`;
                const fetchedData = await get({
                    url,
                    method: 'GET',
                });
                // Flatten and transform the fetched data
                const flattenedFetchedData = fetchedData?.flat?.()?.map((p: any) => ({
                    ...p,
                    tags: p?.tags?.filter((tag: any) => tag.type === 'thematic_areas').map((tag: any) => tag.name),
                    sdg: extractSDGNumbers(p), 
                }));

                return flattenedFetchedData;
            }
            return null;
        });

        const fetchedResults = await Promise.all(fetchedDataPromises);

        const consolidatedPads = fetchedResults.flat().filter(Boolean); // Flatten and remove null results

        return {
            ...col,
            fetched_pads: consolidatedPads, 
        };
    } catch (error) {
        console.error('Error fetching collection:', error);
        return null;
    }
}

