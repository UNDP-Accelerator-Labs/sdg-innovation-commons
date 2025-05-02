'use server';
import { NLP_URL, commonsPlatform, polishTags, page_limit } from '@/app/lib/utils';
import get from './get';
import platformApi from './platform-api';
import { session_token } from '@/app/lib/session';
import blogApi from './blogs-api';

export interface Props {
    page?: number | undefined;
    limit?: number | undefined;
    offset?: number;
    search?: string;
    language?: any;
    iso3?: any;
    doc_type?: (string | undefined)[] | undefined;
}

// CHANGED country TO iso3

export default async function nlpApi(_kwargs: Props) {
    let { page, limit, offset, search, language, iso3, doc_type } = _kwargs;
    if (!page || isNaN(page)) page = 1;
    if (!Array.isArray(language)) language = [language].filter((d: string | undefined) => d);
    if (!Array.isArray(iso3)) iso3 = [iso3].filter((d: string | undefined) => d);
    if (!Array.isArray(doc_type)) doc_type = [doc_type].filter((d: string | undefined) => d);

    const token = await session_token();

    const body = {
        input: search ?? '',
        page_limit: page,
        page,
        limit: limit ?? 10,
        offset: (page - 1) * (limit ?? 0),
        short_snippets: true,
        vecdb: 'main',
        db: 'main',
        token: token ?? '',
        filters: {
            language,
            doc_type,
            iso3,
            status : token ? ["public", "preview"] : [ "public"] 
        }
    }

    let { hits, status } = await get({
        url: `${NLP_URL}/${token ? 'query_embed' : 'search'}`,
        method: 'POST',
        body,
    }) || {};

    if (status?.toLowerCase() === 'ok') {
        const bases = hits.map((d: any) => d.base)
        .filter((value: any, index: number, self: any) => {
            return self.indexOf(value) === index;
        }).filter((d: any) => {
            let platform = d;
            if (platform === 'actionplan') platform = 'action plan';
            if (platform === 'blog') platform = 'insight';
            return commonsPlatform.some((c: any) => c.key === platform);
        });

        if (bases.length) {
            const data = await Promise.all(bases.map(async (b: string) => {
                const platformHits = hits.filter((d: any) => d.base === b);
                const pads = platformHits.map((d: any) => d.doc_id);
                if (b === 'blog') {
                    return await getCountryNames(platformHits);
                }

                let platform = b;
                if (platform === 'actionplan') platform = 'action plan';
                const platformData: any[] = await platformApi({ pads, limit: page_limit }, platform, 'pads');

                if (search?.length) {
                    platformData?.forEach((d: any) => {
                        // because this is triggered by a search, we use the nlp api snippet which provides a cue as to whi the doc is a hit
                        const { snippets } = platformHits.find((c: any) => c.doc_id === d.pad_id) || {};
                        if (snippets && Array.isArray(snippets)) d.snippet = snippets[0];
                    });
                }
                platformData?.sort((a, b) => {
                    return pads.indexOf(a.pad_id) - pads.indexOf(b.pad_id);
                });

                return platformData;
            }));
            return data.flat();
        } else {
            return await getCountryNames(hits);
        }

    } else return [];
}

async function getCountryNames(data: any[]): Promise<any[]> {
  try {
    // Extract unique ISO3 country codes and document IDs
    const countries = data
      .map((d: any) => d.meta?.iso3)
      .flat()
      .filter((value: any, index: number, self: any) => self.indexOf(value) === index);

    const ids = data.filter((d:any)=> d.base === 'blog').map((d: any) => d.doc_id).flat();

    // Fetch country names and articles in parallel
    const [countryNames, articles] = await Promise.all([
      platformApi({}, 'experiment', 'countries'), // Fetch country data
      blogApi({ pads: ids }), // Fetch articles
    ]);

    // Process each data entry
    data.forEach((d: any) => {
      // Match countries based on ISO3 codes
      const matchingCountries = countryNames?.filter((c: any) => d.meta?.iso3?.includes(c.iso3));

      if (matchingCountries?.length) {
        // Check for entries without sub_iso3 first
        const countryWithoutSubIso3 = matchingCountries.find((c: any) => !c.sub_iso3);
        if (countryWithoutSubIso3) {
          d.country = countryWithoutSubIso3.country;
        } else {
          // Use the first entry with sub_iso3 if all have sub_iso3
          d.country = matchingCountries[0]?.country;
        }
      }

      // Match articles based on document ID
      if (articles?.length) {
        const matchingArticle = articles.find((c: any) => d.doc_id === c.id && d.base === 'blog');
        if (matchingArticle) {
          d.pinboards = matchingArticle.pinboards;
        }
      }
    });

    return data;
  } catch (error) {
    console.error('Error in getCountryNames:', error);
    throw new Error('Failed to fetch country names or articles');
  }
}