import platformApi from '@/app/lib/data/platform-api';
import { commonsPlatform, page_limit } from '@/app/lib/utils';
import get from '@/app/lib/data/get'

interface Props {
    id?: number;
    platform: string;
    searchParams: any;
}

export default async function Data({
    id,
    platform,
    searchParams,
}: Props) {
    // GET THE DB SHORTKEY TO PASS TO THE API IN CASE THERE IS A PLATFORM SPECIFIC FILTER
    const db = commonsPlatform.find((c: any) => c.key === platform.toLowerCase())?.shortkey || null;
    let databases = {};
    if (db) databases = { databases: db };

    // LOAD BOARD
    const boardData: any = await platformApi(
        { ...searchParams, ...{ pinboard: id, limit: page_limit }, ...databases },
        'experiment', // IN THIS CASE, PLATFORM IS IRRELEVANT, SINCE IT IS PULLING FROM THE GENERAL DB
        'pinboards'
    );
    const pages = Math.ceil(boardData?.total / page_limit) ?? 1;

    const platforms = boardData?.counts[0] === null ? [] : boardData?.counts
    ?.map((c: any) => {
        c.pinboard_id = boardData?.pinboard_id;
        return c;
    });

    const tabs = platforms?.map((d: any) => {
        return commonsPlatform.find((c: any) => c?.shortkey === d?.platform)?.key || d?.platform;
    });
    tabs?.unshift('all');

    const { title, description, total: padsCount, pads, contributors, creator, status, is_contributor, total }: { title: string, description: string, total: number, contributors: number, creator: any, pads: any[], status: number, is_contributor : boolean, } = boardData || {};
    const { name: creatorName, isUNDP, country, id: contributor_uuid }: { name: string, isUNDP: boolean, country: string | undefined, id: string|undefined } = creator || {};

    // DETERMINE WHETHER THE BOARD IS ATTRIBUTABLE TO AN ACCELERATOR LAB
    let lab: string | undefined = undefined;
    // const isUNDP: boolean = email.includes('@undp.org');
    // const isLabber: boolean = position.includes('Head of');
    if (isUNDP) lab = `UNDP ${!country || country === 'NUL' ? 'Global' : country} Accelerator Lab`;
    // SET THE URL OF THE LABS MAIN PAGE
    let labLink: string = '';
    if (lab) {
        if (lab.includes('Global')) {
            labLink = 'https://www.undp.org/acceleratorlabs/';
        } else labLink = `https://www.undp.org/acceleratorlabs/${lab?.toLowerCase().replace(/\s/g, '-')}`; // FORMAT: undp-algeria-accelerator-lab
    }

    return {
        title, 
        description,
        creatorName,
        contributors,
        status,
        is_contributor,
        contributor_uuid,
        lab: {
            name: lab,
            link: labLink,
        },
        tabs,
        pages,
        total,
        platforms,
        pads: { 
            data: pads,
            count: padsCount,
        }
    }
}


export async function publish(
    status: number,
    id: number,
) {
    const stats = status < 3 ? 3 : 1
    const base_url: string | undefined = commonsPlatform.find(p => p.key === 'solution')?.url;

    const url = `${base_url}/publish/pinboards?id=${id}&status=${stats}`;

    const data = await get({
        url,
        method: 'GET',
    });
    return data;
}