'use server';
import { DB } from '@/app/lib/db';
import { get_externalDb, extractSDGNumbers, page_limit } from '@/app/lib/utils';
import get from '@/app/lib/data/get';

interface AllCollectionProps {
    search?: string;
    theme?: string;
    page?: number;
    limit?: number;
}

interface CollectionProps {
    id: number;
    page?: number;
    limit?: number;
}

export async function get_all_collections({ search = '', theme = '', page = 1, limit = page_limit }: AllCollectionProps) {
    try {
        let countQuery = `
            SELECT COUNT(DISTINCT p.id) 
                FROM public.pinboards p
            LEFT JOIN public.pinboard_contributions pc
                ON p.id = pc.pinboard
            WHERE p.status = 3
                AND pc.db IN (1, 2, 4);
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
                p.status = 3
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
        let data = await DB.general.any(finalQuery);
      
        //Get additional datapoints for each collection board
        const fetchedDataPromises = data?.map(async (p:any)=>{
            let sub_pad = p.pads
            if(+p.pad_count > page_limit){ //Only get details for 27 items if there are more pads
                sub_pad = p.pads?.slice(0, page_limit) 
            }
            let fetched_pads : any = await get_pads({pads : sub_pad})
            let vignettes = fetched_pads.map((p:any)=> p.vignette) //Extract the vignette of the fetched pads

            if(!vignettes.length && +p.pad_count > page_limit){ //Fetch the remaining pads details if no vignette could be extracted
                sub_pad = p.pads?.slice(page_limit);
                fetched_pads = await get_pads({pads : sub_pad})
                vignettes = fetched_pads.map((p:any)=> p.vignette) 
            }

            return {
                ...p,
                fetched_pads,
                vignettes,
            }
        })

        data = await Promise.all(fetchedDataPromises);


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

export async function get_collection(_kwarq:CollectionProps) {
    let { page, id, limit } = _kwarq;
    page = page ?? 1;
    limit = limit ?? page_limit;

    try {
        let col = await DB.general.oneOrNone(`
            SELECT
                p.*, 
                u.name,
                u.email,
                COALESCE(JSON_AGG(
                    DISTINCT JSONB_BUILD_OBJECT('pad', pc.pad, 'db', pc.db)
                ) FILTER (WHERE pc.pad IS NOT NULL), '[]') AS pads,
                COUNT(DISTINCT pc2.participant) AS contributor_count
            FROM
                public.pinboards p
            LEFT JOIN
                public.pinboard_contributions pc
            ON
                p.id = pc.pinboard
            LEFT JOIN
                public.pinboard_contributors pc2
            ON
                p.id = pc2.pinboard
            LEFT JOIN
                public.users u
            ON
                p.owner = u.uuid
            WHERE
                p.id = $1
            GROUP BY p.id, u.name, u.email
        `, [id]);          
        

        if (!col) {
            return null;
        }

        let consolidatedPads : any = await get_pads(col)

        //Also add pagination here. 
        // We are unsure which pads are publicly available or available for user to view based on rights until the pads are fetched from respective APIs.
        const totalPads = consolidatedPads.length ?? 0;
        const totalPages = Math.ceil(totalPads / limit);
        const offset = (page - 1) * limit;

        consolidatedPads?.slice(offset, offset + limit);

        return {
            ...col,
            fetched_pads: consolidatedPads, 
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                totalPads: totalPads,
            }
        };
    } catch (error) {
        console.error('Error fetching collection:', error);
        return null;
    }
}


export const get_pads = async (col: any) => {
    // Group pads by db_id
    const padsByDb: Record<number, number[]> = {};
    col.pads.forEach((padObj: { pad: number, db: number }) => {
        if (!padsByDb[padObj.db]) {
            padsByDb[padObj.db] = [];
        }
        padsByDb[padObj.db].push(padObj.pad);
    });

    // Fetch pads from different external DBs in parallel
    const fetchedDataPromises = Object.keys(padsByDb).map(async (db_id) => {
        const base_url = await get_externalDb(+db_id); // Get base URL for the db_id
        if (base_url) {
            const pad_ids = padsByDb[db_id as unknown as number];
            
            const url = `${base_url}/apis/fetch/pads?pads=${pad_ids.join('&pads=')}&output=json&include_engagement=true&include_tags=true&include_metafields=true&include_data=true&include_locations=true`;
            
            try {
                const fetchedData = await get({ url, method: 'GET' });
                
                if (fetchedData) {
                    return fetchedData?.flat()?.map((p: any) => ({
                        ...p,
                        tags: p?.tags?.filter((tag: any) => tag.type === 'thematic_areas').map((tag: any) => tag.name) || [],
                        sdg: extractSDGNumbers(p), 
                    }));
                }
            } catch (fetchError) {
                console.error(`Error fetching data from db_id ${db_id}:`, fetchError);
            }
        }
        return [];
    });

    const fetchedResults = await Promise.all(fetchedDataPromises);

    // Flatten and remove null/undefined results
    return fetchedResults.flat().filter(Boolean)
}


