/**
 * @deprecated This file is DEPRECATED and should not be used.
 * 
 * For pagination:
 * - Platform API endpoints now return {count, data} structure
 * - NLP searches: Use nlpStatsApi from './nlp-pagination'
 * 
 * Migration guide:
 * - Replace pagestats() calls with count from API response
 * - For NLP: Import nlpStatsApi or getNlpPageStats from './nlp-pagination'
 * 
 * This file makes external API calls and is being phased out.
 * It will be removed in a future version.
 */

'use server';

import { commonsPlatform } from '@/app/lib/helpers/utils';
import get from './get';

/**
 * @deprecated Use local API endpoints that return count with data
 * External API call - do not use in new code
 */
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