// import main from './main';
import meta from './meta';
import cards from './cards';
import { collection as tempData } from './tempData';
import { query } from '@/app/lib/db';

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
        // Log unexpected DB errors but continue to fallback to temp data
        const emsg = (e as any)?.message ? (e as any).message : String(e);
        console.warn('Collection DB load error, falling back to tempData', emsg);
    }

    // FALLBACK TO TEMP DATA FILES (existing behaviour)
    if (!collectionData || Object.keys(collectionData).length === 0) {
        console.log(`Falling back to tempData for collection id=${id}`);
        collectionData = tempData.find((d: any) => d.id === id) || {};
    }

    const { boards } = collectionData;
    // GET THE METADATA
    const metaData = await meta({ boards, searchParams });
    const cardsData = await cards({ searchParams, boards });

    return { ...collectionData, ...metaData, ...cardsData };
}