'use server';

import { NLP_URL } from '@/app/lib/utils';
import get from './get';

export interface Props {
    language?: any;
    iso3?: any;
    doc_type?: any;
    fields?: any;
}

export async function statsApi(_kwargs: Props) {
    let { language, iso3, doc_type, fields } = _kwargs || {};
    if (!Array.isArray(language)) language = [language].filter((d: string | undefined) => d);
    if (!Array.isArray(iso3)) iso3 = [iso3].filter((d: string | undefined) => d);
    if (!Array.isArray(doc_type)) doc_type = [doc_type].filter((d: string | undefined) => d);

    const body = {
        fields: fields || [],
        vecdb: 'main',
        filters: {
            language,
            doc_type,
            iso3
        }
    }

    let { doc_count: hits } = await get({
        url: `${NLP_URL}/stats`,
        method: 'POST',
        body,
    });

    return hits;
}