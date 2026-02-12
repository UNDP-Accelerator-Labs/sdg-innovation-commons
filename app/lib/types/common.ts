/**
 * Common type definitions used across the application
 * @module lib/types/common
 */

/**
 * Represents a database connection configuration
 */
export interface ConnectionConfig {
  database: string;
  port?: number;
  host?: string;
  user?: string;
  password?: string;
  ssl?: boolean;
}

/**
 * Supported database keys for multi-database architecture
 */
export type DBKey = 'experiment' | 'learningplan' | 'solutions' | 'general' | 'blogs';

/**
 * Standard post/pad document properties
 */
export interface PostProps {
  doc_id: number;
  url: string;
  title: string;
  meta?: {
    iso3: string[];
  };
  updated?: string;
  snippets?: string;
  base?: string;
}

/**
 * Incoming HTTP request parameters from Next.js
 */
export interface IncomingRequestParams {
  params: Promise<{ [key: string]: string | string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

/**
 * Standard API response structure with pagination
 */
export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page?: number;
  limit?: number;
}

/**
 * Standard API error response
 */
export interface ApiErrorResponse {
  error: string;
  message?: string;
  statusCode?: number;
  details?: Record<string, any>;
}

/**
 * HTTP method types
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

/**
 * Standard success response
 */
export interface SuccessResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}
