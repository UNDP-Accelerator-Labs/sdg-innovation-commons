/**
 * Type definitions for the test page
 * @module test/[platform]/types
 */

/**
 * Page statistics response from API
 */
export interface PageStatsResponse {
  total: number;
  pages: number;
}

/**
 * Content item from API
 */
export interface ContentItem {
  base: string;
  pad_id: number;
  doc_id?: number;
  title?: string;
  snippets?: string;
  snippet?: string;
  url?: string;
  tags?: string[];
  sdg?: number[];
  vignette?: string;
  date?: string;
  engagement?: any;
}

/**
 * Props for test page section component
 */
export interface SectionProps {
  searchParams: any;
  platform: string;
  tabs: string[];
}

/**
 * Data fetching result
 */
export interface FetchDataResult {
  hits: ContentItem[];
  pages: number;
  total: number;
  useNlp: boolean;
  objectIds: number[];
  allObjectIds: Record<string, number[]> | null;
  downloadUrl: string;
}

/**
 * API response structure
 */
export interface ApiResponse {
  data?: ContentItem[];
  count?: number;
  message?: string;
}

/**
 * Search tracking payload
 */
export interface SearchTrackingPayload {
  query: string;
  platform: string;
  searchType: string;
  resultsCount: number;
  pageNumber: number;
  filters: any;
}
