// import main from './main';
import meta from './meta';
import cards from './cards';
import { collection as tempData } from './tempData';

interface Props {
    id: string;
    searchParams: any;
}

export default async function Data({
    id,
    searchParams,
}: Props) {
    // LOAD BOARD
    const collectionData: any = tempData.find((d: any) => d.id === id) || {};
    const { boards } = collectionData;
    // GET THE METADATA
    const metaData = await meta({ boards, searchParams });
    const cardsData = await cards({ searchParams, boards });

    return { ...collectionData, ...metaData, ...cardsData };
}