'use server';

import { commonsPlatform } from '@/app/lib/utils';
import get from './get';

export default async function statsApi(platform: string) {
    const base_url: string | undefined = commonsPlatform.find(p => p.key === platform)?.url;

    // TO DO: IMPROVE THIS WITH QUERY PARAMS
    const params = new URLSearchParams();
    let data = await get({
        url: `${base_url}/apis/fetch/statistics?space=published`,
        method: 'GET',
    });

    return data;
}