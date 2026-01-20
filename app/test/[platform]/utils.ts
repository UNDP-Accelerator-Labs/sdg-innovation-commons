/**
 * Utility functions for test page data processing
 * @module test/[platform]/utils
 */

import type { ContentItem, ApiResponse } from './types';

/**
 * Normalize API response to consistent format
 * Handles both old array format and new {count, data} structure
 */
export function normalizeApiResponse(response: any): { data: ContentItem[]; count: number } {
  // Check for error responses
  if (response && typeof response === 'object' && 'message' in response && !Array.isArray(response)) {
    console.error('API Error:', response.message);
    return { data: [], count: 0 };
  }
  
  // Handle new {count, data} structure
  if (response && typeof response === 'object' && 'data' in response) {
    return {
      data: response.data || [],
      count: response.count || 0,
    };
  }
  
  // Handle old array format
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
 * Group items by base platform
 */
export function groupItemsByPlatform(items: ContentItem[]): Record<string, number[]> {
  const grouped: Record<string, number[]> = {};
  
  items.forEach((item) => {
    const key = item.base;
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(item.pad_id);
  });
  
  return grouped;
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
  const filterKeys = [
    'countries',
    'regions',
    'thematic_areas',
    'sdgs',
    'methods',
    'datasources',
  ];
  return filterKeys.some((key) => key in searchParams && searchParams[key]);
}

/**
 * Prepare search parameters for API calls
 * Handles country and region data transformation
 */
export async function prepareSearchParams(
  searchParams: any,
  getRegion: (regions: any) => Promise<any[]>
): Promise<any> {
  const prepared = { ...searchParams };
  
  // Ensure countries is an array
  const countriesArray = Array.isArray(prepared.countries)
    ? prepared.countries
    : prepared.countries
      ? [prepared.countries]
      : [];
  
  // Handle regions
  if (prepared.regions) {
    const countries = await getRegion(prepared.regions);
    prepared.iso3 = [
      ...countries.map((c: any) => c.iso3),
      ...countriesArray,
    ];
  } else {
    prepared.iso3 = countriesArray;
  }
  
  // Set countries to iso3 for compatibility
  if (prepared.countries) {
    prepared.iso3 = prepared.countries;
  }
  
  return prepared;
}
