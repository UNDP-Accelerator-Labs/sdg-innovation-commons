/**
 * Utility functions for see page data processing
 * @module see/utils
 */

import type { ContentItem } from './types';

/**
 * Normalize API response to consistent format
 */
export function normalizeApiResponse(response: any): { data: ContentItem[]; count: number } {
  if (response && typeof response === 'object' && 'message' in response && !Array.isArray(response)) {
    console.error('API Error:', response.message);
    return { data: [], count: 0 };
  }
  
  if (response && typeof response === 'object' && 'data' in response) {
    return {
      data: response.data || [],
      count: response.count || 0,
    };
  }
  
  if (Array.isArray(response)) {
    return {
      data: response,
      count: response.length,
    };
  }
  
  console.error('Unexpected API response format:', response);
  return { data: [], count: 0 };
}

/**
 * Extract object IDs from content items
 */
export function extractObjectIds(items: ContentItem[]): number[] {
  return items
    .map((item) => item?.pad_id || item?.doc_id)
    .filter((id): id is number => Boolean(id));
}

/**
 * Build download URL from base URL and item IDs
 */
export function buildDownloadUrl(baseUrl: string, ids: number[]): string {
  const params = new URLSearchParams();
  ids.forEach((id) => params.append('pads', id.toString()));
  return `${baseUrl}&${params.toString()}`;
}

/**
 * Check if search parameters include filters
 */
export function hasFilterParams(searchParams: any): boolean {
  const filterKeys = ['thematic_areas', 'sdgs', 'countries', 'regions'];
  return filterKeys.some((key) => key in searchParams && searchParams[key]);
}
