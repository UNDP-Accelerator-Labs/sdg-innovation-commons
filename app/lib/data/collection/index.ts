// import main from './main';
import meta from './meta';
import cards from './cards';
import { query } from '@/app/lib/db';
import getSession from '@/app/lib/session';

// Helper: run a promise with a short timeout to avoid long blocking DB waits
async function withTimeout<T>(p: Promise<T>, ms: number = 2000): Promise<T | null> {
    let resolved = false;
    return new Promise((resolve) => {
        const timer = setTimeout(() => {
            if (!resolved) {
                resolved = true;
                resolve(null);
            }
        }, ms);
        p.then((value) => {
            if (!resolved) {
                resolved = true;
                clearTimeout(timer);
                resolve(value);
            }
        }).catch((err) => {
            if (!resolved) {
                resolved = true;
                clearTimeout(timer);
                resolve(null);
            }
        });
    });
}

interface Props {
    id: string;
    searchParams: any;
}

export default async function Data({
    id,
    searchParams,
}: Props) {
    // Get session for access control
    const session = await getSession();
    const loggedInUuid = session?.uuid;
    
    // ATTEMPT TO LOAD FROM DB FIRST (slug === id)
    let collectionData: any = {};
    try {
        const slug = id;
        // Run the DB query but fail fast if the DB is unreachable or slow
        const res = await withTimeout(query('general', 'SELECT * FROM collections WHERE slug = $1 LIMIT 1', [slug]), 2000);
        if (!res) {
            console.warn(`Collection DB query timed out or failed for slug=${slug}, falling back to tempData`);
        } else if (res?.rows?.length) {
            const row = res.rows[0];
            
            // Access control for draft collections
            const highlights = row.highlights || {};
            const status = highlights.status || 'draft';
            const creatorUuid = highlights.creator_uuid;
            
            // If collection is not published, only creator and admins can view it
            if (status !== 'published' && !highlights.published) {
                const isCreator = loggedInUuid && creatorUuid && loggedInUuid === creatorUuid;
                const isAdmin = session && (session.rights ?? 0) >= 4;
                
                if (!isCreator && !isAdmin) {
                    // Return a special flag to indicate unauthorized access
                    return {
                        unauthorized: true,
                        title: '',
                        description: '',
                        data: [],
                        pages: 0,
                        tags: [],
                        sdgs: [],
                        locations: [],
                        highlights: {},
                        externalResources: [],
                    };
                }
            }
            
            collectionData = {
                id: row.slug,
                title: row.title,
                description: row.description,
                creatorName: row.creator_name,
                mainImage: row.main_image,
                sections: row.sections,
                highlights: row.highlights,
                boards: row.boards,
                externalResources: row.external_resources || [],
            };
        }
    } catch (e) {
        // Log unexpected DB errors
        const emsg = (e as any)?.message ? (e as any).message : String(e);
        console.error('Collection DB load error', emsg);
        // Return empty data structure if DB fails
        return {
            title: '',
            description: '',
            data: [],
            pages: 0,
            tags: [],
            sdgs: [],
            locations: [],
            highlights: {},
            externalResources: [],
        };
    }

    // If no collection found in DB, return empty data
    if (!collectionData || Object.keys(collectionData).length === 0) {
        console.warn(`Collection not found for slug=${id}`);
        return {
            title: '',
            description: '',
            data: [],
            pages: 0,
            tags: [],
            sdgs: [],
            locations: [],
            highlights: {},
            externalResources: [],
        };
    }

    const { boards } = collectionData;
    // GET THE METADATA
    const metaData = await meta({ boards, searchParams });
    const cardsData = await cards({ searchParams, boards });

    return { ...collectionData, ...metaData, ...cardsData };
}