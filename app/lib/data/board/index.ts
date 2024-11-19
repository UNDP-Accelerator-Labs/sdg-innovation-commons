import platformApi from '@/app/lib/data/platform-api';
import main from './main.ts';
import meta from './meta.ts';
import cards from './cards.ts';

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
    const boardData = await main({ id, platform, searchParams });
    const { tabs, platforms, pads } = boardData;
    // GET THE METADATA
    const metaData = await meta({ id, platform, platforms: tabs, searchParams });
    const cardsData = await cards({ platform, platforms, searchParams, pads: pads.data });

    return { ...boardData, ...metaData, ...cardsData };
}