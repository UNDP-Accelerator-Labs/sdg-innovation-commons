'use server';

import { commonsPlatform } from '@/app/lib/utils';
import get from './get';

export default async function statsApi(platform: string, _kwargs: any) {
    let { space, pinboard } = _kwargs;
    if (!space) _kwargs.space = 'published';
    if (pinboard) _kwargs.space = 'pinned';

    const params = new URLSearchParams();
    
    for (let k in _kwargs) {
        const argV = _kwargs[k as keyof typeof _kwargs];
        if (Array.isArray(argV)) {
            argV.forEach((v:any) => {
                params.append(k, v);
            });
        } else {
            params.set(k, argV);
        }
    } 

    const base_url: string | undefined = commonsPlatform.find(p => p.key === platform)?.url;
    let data = await get({
        url: `${base_url}/apis/fetch/statistics?${params.toString()}`,
        method: 'GET',
    });

    return data;
}