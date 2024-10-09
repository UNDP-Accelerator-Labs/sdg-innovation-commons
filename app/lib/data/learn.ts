'use server';
import { NLP_URL } from  '@/app/lib/utils';

interface LearnProps {
    page?: number;
    limit?: number;
    offset?: number;
    search?: string;
    language?: string;
    country?: string;
}

export default async function learn(_kwargs:LearnProps) {
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

    let data = await fetch(`${NLP_URL}/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })
      .then(async (response) => {
        const data = await response.json();
        return data;
      })
      .catch((err) => {
        console.log(err);
        return null;
      });
    return data
}