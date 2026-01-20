/**
 * Platform-specific type definitions
 * @module lib/types/platform
 */

/**
 * Supported platform types in the application
 */
export type PlatformType = 'experiment' | 'solution' | 'action plan' | 'insight' | 'blogs';

/**
 * Platform shortkey mappings
 */
export type PlatformShortkey = 'exp' | 'sm' | 'ap' | 'blogs';

/**
 * Platform configuration
 */
export interface PlatformConfig {
  title: string;
  url: string;
  key: PlatformType;
  shortkey?: PlatformShortkey;
}

/**
 * Parameters for platform API requests
 */
export interface PlatformApiParams {
  space?: 'published' | 'draft' | 'pinned';
  pinboard?: string | number;
  include_tags?: boolean;
  include_locations?: boolean;
  include_engagement?: boolean;
  include_comments?: boolean;
  include_pinboards?: boolean | 'all';
  action?: 'fetch' | 'create' | 'update' | 'delete';
  render?: boolean;
  output?: 'json' | 'csv';
  page?: number;
  limit?: number;
  search?: string;
  sdg?: number[];
  country?: string[];
  status?: number;
  [key: string]: any;
}

/**
 * Pad/Post filter parameters
 */
export interface PadFilterParams {
  platform?: PlatformType;
  space?: string;
  search?: string;
  sdg?: number[];
  country?: string[];
  tags?: string[];
  date_from?: string;
  date_to?: string;
  page?: number;
  limit?: number;
  sort?: 'date' | 'title' | 'engagement';
  order?: 'asc' | 'desc';
}

/**
 * NLP API parameters
 */
export interface NlpApiParams {
  search: string;
  limit?: number;
  page?: number;
  platform?: PlatformType;
  country?: string[];
  sdg?: number[];
  doc_type?: string[];
}

/**
 * Content removal parameters for NLP
 */
export interface ContentRemovalParams {
  doc_id: number;
  platform: PlatformShortkey;
}
