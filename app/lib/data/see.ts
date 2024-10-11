'use server';
import { NLP_URL, commonsPlatform, getAdditionalData } from '@/app/lib/utils';
import { Props } from './learn'
import get from './get'

export default async function see(_kwargs: Props) {
    const { page, limit, offset, search, language, country } = _kwargs
    const body = {
        input: search ?? '',
        page_limit: page ?? 1,
        limit: limit ?? 10,
        offset: offset ?? 0,
        short_snippets: true,
        vecdb: "main",
        filters: {
            language: language ? [language] : [],
            doc_type: ["solution"],
            iso3: country ? [country] : []
        }
    }

    const base_url: string | undefined = commonsPlatform
        .filter(p => p.key === 'solution')
        ?.[0]?.url;

    let data = await get({
        url: `${NLP_URL}/search`,
        method: 'POST',
        body,
    });

    if (data && base_url) { //call platform api to get additional datapoints
        data = await getAdditionalData(data, base_url)
    } else { //fallback to platformapi to fetch data from there

    }

    return data
}