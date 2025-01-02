'use server';

import { NLP_URL } from '@/app/lib/utils';
import get from './get';
import { session_token } from '@/app/lib/session';

export interface Props {
    language?: any;
    iso3?: any;
    doc_type?: any;
    fields?: any;
}

export default async function statsApi(_kwargs: Props) {
    let { language, iso3, doc_type, fields } = _kwargs || {};
    if (!Array.isArray(language)) language = [language].filter((d: string | undefined) => d);
    if (!Array.isArray(iso3)) iso3 = [iso3].filter((d: string | undefined) => d);
    if (!Array.isArray(doc_type)) doc_type = [doc_type].filter((d: string | undefined) => d);

    const token = await session_token();

    const body = {
        fields: fields || [],
        vecdb: 'main',
        db: 'main',
        token: token ?? '',
        filters: {
            language,
            doc_type,
            iso3
        }
    }

    let { doc_count: hits } = await get({
        url: `${NLP_URL}/${token ? 'stat_embed' : 'stats'}`,
        method: 'POST',
        body,
    });

    return hits;
}