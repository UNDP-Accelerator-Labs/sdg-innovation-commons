'use server';

import { getSemanticStats } from '@/app/lib/services/semantic-search-client';
import { page_limit } from '@/app/lib/helpers/utils';

export interface Props {
    language?: any;
    iso3?: any;
    doc_type?: any;
    fields?: any;
}

// Simple in-memory cache for NLP stats (5 minute TTL)
const statsCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCacheKey(params: Props): string {
    return JSON.stringify({
        language: params.language,
        iso3: params.iso3,
        doc_type: params.doc_type,
    });
}

export default async function nlpStatsApi(_kwargs: Props) {
    let { language, iso3, doc_type, fields } = _kwargs || {};
    if (!Array.isArray(language)) language = [language].filter((d: string | undefined) => d);
    if (!Array.isArray(iso3)) iso3 = [iso3].filter((d: string | undefined) => d);
    if (!Array.isArray(doc_type)) doc_type = [doc_type].filter((d: string | undefined) => d);

    // Check cache
    const cacheKey = getCacheKey({ language, iso3, doc_type });
    const cached = statsCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
    }

    // Use local semantic search service
    const { doc_count, fields: field } = await getSemanticStats({
        fields: fields || [],
        filters: {
            language: language.length > 0 ? language : undefined,
            doc_type: doc_type.length > 0 ? doc_type : undefined,
            iso3: iso3.length > 0 ? iso3 : undefined,
        },
        vecdb: 'main',
    });

    const result = { doc_count, field, iso3: field?.iso3 ? Object.keys(field?.iso3) : [] };
    
    // Cache the result
    statsCache.set(cacheKey, { data: result, timestamp: Date.now() });

    return result;
}

// Helper function to calculate pagination info for NLP searches
export async function getNlpPageStats(
    page: number,
    docTypes: string[],
    searchParams: any
): Promise<{ total: number; pages: number; page: number }> {
    const { language, iso3 } = searchParams;
    const { doc_count: total } = await nlpStatsApi({ 
        doc_type: docTypes, 
        iso3, 
        language 
    }) || {};
    
    const pages = Math.ceil(total / page_limit);
    return { total, pages, page };
}