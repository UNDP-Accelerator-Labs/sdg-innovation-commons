'use server';
import { NLP_URL } from '@/app/lib/utils';
import get from './get'

export interface Props {
  page?: number;
  limit?: number;
  offset?: number;
  search?: string;
  language?: string;
  country?: string;
  doc_type?: string[];
}

export default async function learn(_kwargs: Props) {
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
      doc_type: ["blog", "publications", "news"],
      iso3: country ? [country] : []
    }
  }

  let data = await get({
    url: `${NLP_URL}/search`,
    method: 'POST',
    body,
  });

  return data
}