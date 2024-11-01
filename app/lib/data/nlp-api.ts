'use server';
import { NLP_URL, commonsPlatform, polishTags } from '@/app/lib/utils';
import get from '@/app/lib/data/get';
import platformApi from '@/app/lib/data/platform-api';

export interface Props {
    page?: number;
    limit?: number;
    offset?: number;
    search?: string;
    language?: any;
    iso3?: any;
    platform?: string[];
    doc_type?: any;
}

// CHANGED country TO iso3

export default async function nlpApi(_kwargs: Props, platform: string) {
    let { page, limit, offset, search, language, iso3, doc_type } = _kwargs;
    if (!Array.isArray(language)) language = [language].filter((d: string | undefined) => d);
    if (!Array.isArray(iso3)) iso3 = [iso3].filter((d: string | undefined) => d);
    if (!Array.isArray(doc_type)) doc_type = [doc_type].filter((d: string | undefined) => d);

    const body = {
        input: search ?? '',
        page_limit: page ?? 1,
        page: page ?? 1,
        limit: limit ?? 10,
        offset: ((page ?? 1) - 1) * (limit ?? 0),
        short_snippets: true,
        vecdb: 'main',
        filters: {
            language,
            doc_type,
            iso3
        }
    }

    let { hits, status } = await get({
        url: `${NLP_URL}/search`,
        method: 'POST',
        body,
    });

    if (status.toLowerCase() === 'ok') {
        const bases = hits.map((d: any) => d.base)
        .filter((value: any, index: number, self: any) => {
            return self.indexOf(value) === index;
        }).filter((d: any) => {
            let platform = d;
            if (platform === 'actionplan') platform = 'action plan';
            return commonsPlatform.some((c: any) => c.key === platform);
        });

        if (bases.length) {
            const data = await Promise.all(bases.map(async (b: string) => {
                const platformHits = hits.filter((d: any) => d.base === b);
                const pads = platformHits.map((d: any) => d.doc_id);

                let platform = b;
                if (platform === 'actionplan') platform = 'action plan';
                const platformData: any[] = await platformApi({ pads }, platform, 'pads');

                platformData?.forEach((d: any) => {
                    // because this is triggered by a search, we use the nlp api snippet which provides a cue as to whi the doc is a hit
                    const { snippets } = platformHits.find((c: any) => c.doc_id === d.pad_id) || {};
                    if (snippets && Array.isArray(snippets)) d.snippet = snippets[0];
                })
                platformData?.sort((a, b) => {
                    return pads.indexOf(a.pad_id) - pads.indexOf(b.pad_id);
                });

                return platformData;
            }));
            return data.flat();
        } else {
            const countries = hits.map((d: any) => d.meta.iso3).flat()
            .filter((value: any, index: number, self: any) => {
                return self.indexOf(value) === index;
            });

            // TO DO: OPTIMIZE THIS WHEN countries API IS FIXED
            const countryNames: any[] = await platformApi({ }, 'solution', 'countries'); // HERE solution IS USED BY DEFAULT SINCE THE API CALLS THE MAIN DB SHARED BY ALL PLATFORMS
            hits.forEach((d: any) => {
                d.country = countryNames.find((c: any) => d.meta.iso3.includes(c.iso3))?.country;
                console.log(d.meta.iso3, d.country)
            })

            return hits;
        }

    } else return [];
}