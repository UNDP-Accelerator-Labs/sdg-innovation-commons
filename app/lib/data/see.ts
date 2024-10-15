'use server';
import { NLP_URL, commonsPlatform, getAdditionalData, defaultSearch, extractSDGNumbers } from '@/app/lib/utils';
import { Props } from './learn'
import get from './get'

export default async function see(_kwargs: Props) {
    const { page, limit, offset, search, language, country } = _kwargs
    const body = {
        input: search ?? '',
        page_limit: page ?? 1,
        page: page ?? 1,
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

    // Call platform API to get additional data if both data and base_url are present
    if (data && base_url) {
        data = await getAdditionalData(data, base_url);
    }
    // Fallback to platform API if data.status is not 'ok'
    else if (!data?.status || data.status !== 'ok') {
        if (base_url) {
            const searchTxt = search && search != defaultSearch('see') ? `&search=${encodeURI(body.input)}` : null
            const url = `${base_url}/apis/fetch/pads?output=json&include_engagement=true&include_tags=true&include_metafields=true&include_data=true&page=${body.page}&page_limit=${body.page_limit}${searchTxt ? searchTxt : ''}`;
            // TODO: Add pagination to platform API source code
            const fetchedData = await get({
                url,
                method: 'GET',
            });

            // Ensure fetchedData is an array before flattening
            let flattenedFetchedData = await Promise.all(
                fetchedData?.flat?.()?.map((p: any) => ({
                    ...p,
                    tags: p?.tags
                        ?.filter((p: any) => p.type === 'thematic_areas')
                        .map((p: any) => p.name),
                    sdg: extractSDGNumbers(p)
                })
                )
                    ?.slice(0, body.limit) //TODO: Remove this line after pagination at platform source code
            );
            if (flattenedFetchedData && flattenedFetchedData.length) {
                data = { hits: flattenedFetchedData };
            }
        }
    }

    return data
}