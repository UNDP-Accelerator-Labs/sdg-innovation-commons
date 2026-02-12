/**
 * Type definitions for the see page (What We See)
 * @module see/types
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
 * Props for see page section component
 */
export interface SectionProps {
  searchParams: any;
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
