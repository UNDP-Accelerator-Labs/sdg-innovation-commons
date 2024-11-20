import platformApi from '@/app/lib/data/platform-api';
import { commonsPlatform, page_limit } from '@/app/lib/utils';

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
    // LOAD BOARD
    const boardData: any = await platformApi(
        { ...searchParams, ...{ pinboard: id, limit: page_limit } },
        'solution', // IN THIS CASE, PLATFORM IS IRRELEVANT, SINCE IT IS PULLING FROM THE GENERAL DB
        'pinboards'
    );
    const pages = Math.ceil(boardData?.total / page_limit) ?? 1;

    const platforms = boardData.counts
    .map((c: any) => {
        c.pinboard_id = boardData.pinboard_id;
        return c;
    });

    const tabs = platforms.map((d: any) => {
        return commonsPlatform.find((c: any) => c.shortkey === d.platform)?.key || d.platform;
    });
    tabs.unshift('all');

    const { title, description, total: padsCount, pads, contributors, creator }: { title: string, description: string, total: number, contributors: number, creator: any, pads: any[] } = boardData;
    const { name: creatorName, isUNDP, country }: { name: string, isUNDP: boolean, country: string | undefined } = creator || {};

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
        lab: {
            name: lab,
            link: labLink,
        },
        tabs,
        pages,
        platforms,
        pads: { 
            data: pads,
            count: padsCount,
        }
    }
}