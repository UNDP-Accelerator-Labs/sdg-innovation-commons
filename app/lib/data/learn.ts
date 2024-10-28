'use server';
import { NLP_URL, commonsPlatform, defaultSearch } from '@/app/lib/utils';
import get from './get'
import { get_collection, get_all_collections } from './collections'

export interface Props {
  page?: number;
  limit?: number;
  offset?: number;
  search?: string;
  language?: string;
  country?: string;
  doc_type?: string[] | null;
}

export default async function learn(_kwargs: Props) {
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
      doc_type: ["blog", "publications", "news"],
      iso3: country ? [country] : []
    }
  }
// const t = await get_collection(80) //get_all_collections({})
//   console.log(t)
  const base_url: string | undefined = commonsPlatform
    .find(p => p.key === 'insight')?.url;

  let data = await get({
    url: `${NLP_URL}/search`,
    method: 'POST',
    body,
  });


  // Fallback to Insight API if data.status is not 'ok'
  if (!data?.status || data.status !== 'ok') {
    if (base_url) {
      const { JWT_TOKEN } = process.env;
      const searchTxt = search && search !== defaultSearch('learn') ? `&search=${encodeURI(body.input)}` : '';
      const url = `${base_url}/blogs?token=${JWT_TOKEN}&page=${body.page}&page_content_limit=${body.limit}${searchTxt}`;

      let fetchedData = await get({
        url,
        method: 'GET',
      }) || [];

      let flattenedFetchedData = await Promise.all(
        fetchedData?.[1]?.["searchResults"]?.map((p: any, index: number) => ({
          ...p,
          doc_id: index,
          meta: {
            date: p?.posted_date || p?.parsed_date || p?.date,
            iso3: p?.iso3 ? [p.iso3] : [],
            country: p?.country,
          },
          base: p?.article_type,
          snippets: p?.matched_texts || (typeof p?.content === 'string' ? getChunkOfWords(p.content || p?.html_content) : ''),
        })) || []
      );

      if (Array.isArray(flattenedFetchedData) && flattenedFetchedData.length > 0) {
        data = { hits: flattenedFetchedData };
      }
    }
  }

  return data;
}

function getChunkOfWords(text: string): string {
  const cleanedText = text.replace(/\s+/g, ' ').replace(/\n/g, '').trim();
  const words = cleanedText.split(' ');
  const totalWords = words.length;
  const chunkSize = Math.ceil(totalWords / 3);
  const chunks = [
    words.slice(0, chunkSize),
    words.slice(chunkSize, chunkSize * 2),
    words.slice(chunkSize * 2, totalWords),
  ];
  const selectedChunk = chunks[1].length >= 30 ? chunks[1] : chunks[2];
  return selectedChunk.slice(0, 30).join(" ");
}
