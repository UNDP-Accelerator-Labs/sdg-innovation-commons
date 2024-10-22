'use server';

import { commonsPlatform } from '@/app/lib/utils';
import get from './get';

export async function statsApi(platform: string) {
    const base_url: string | undefined = commonsPlatform.find(p => p.key === platform)?.url;

    let data = await get({
        url: `${base_url}/apis/fetch/statistics?space=public`,
        method: 'GET',
    });

    return data;
}