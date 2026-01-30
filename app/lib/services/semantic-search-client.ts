"use server";

import { session_token } from "@/app/lib/session";

/**
 * Semantic search filters matching the Python service structure
 */
export interface SemanticSearchFilters {
  language?: string[];
  doc_type?: string[];
  iso3?: string[];
  status?: string[];
  date?: string[];
  tags?: string[];
  sdg?: number[];
}

/**
 * Semantic search request payload
 */
export interface SemanticSearchRequest {
  input: string;
  limit?: number;
  offset?: number;
  filters?: SemanticSearchFilters;
  hit_limit?: number;
  score_threshold?: number;
  short_snippets?: boolean;
  vecdb?: string;
}

/**
 * Search result metadata
 */
export interface ResultMeta {
  date?: string;
  language?: string[];
  doc_type?: string[];
  iso3?: string[];
  status?: string[];
  tags?: string[];
  sdg?: number[];
  [key: string]: any;
}

/**
 * Individual search result chunk
 */
export interface ResultChunk {
  main_id: string;
  score: number;
  base: string;
  doc_id: number;
  url: string;
  title: string;
  updated: string;
  snippets: string[];
  meta: ResultMeta;
}

/**
 * Search response from semantic search service
 */
export interface SemanticSearchResponse {
  hits: ResultChunk[];
  status: "ok" | "error";
  message?: string;
  total?: number;
}

/**
 * Get the semantic search service URL
 */
function getSemanticSearchUrl(): string {
  return (
    process.env.SEMANTIC_SEARCH_URL ||
    process.env.NEXT_PUBLIC_SEMANTIC_SEARCH_URL ||
    "http://localhost:8000"
  );
}

/**
 * Get the API secret key for service-to-service communication
 */
function getApiSecretKey(): string | undefined {
  return process.env.SEMANTIC_SEARCH_API_KEY;
}

/**
 * Internal semantic search function.
 * 
 * Calls the internal Python FastAPI semantic search service instead of external NLP API.
 * Maintains backward compatibility with existing nlpApi interface.
 * 
 * @param params - Search parameters
 * @returns Search results in the same format as nlpApi
 */
export async function semanticSearch(
  params: SemanticSearchRequest
): Promise<SemanticSearchResponse> {
  const {
    input = "",
    limit = 10,
    offset = 0,
    filters,
    hit_limit = 3,
    score_threshold = 0.0,
    short_snippets = true,
    vecdb = "main",
  } = params;

  // Get user session token
  const token = await session_token();

  // Prepare filters with proper security - authenticated users get more access
  const searchFilters: SemanticSearchFilters = {
    ...filters,
    // Only authenticated users can access preview content
    status: token ? ["public", "preview"] : ["public"],
  };

  // Prepare request body
  const body = {
    input,
    limit,
    offset,
    filters: searchFilters,
    hit_limit,
    score_threshold,
    short_snippets,
    vecdb,
  };
  console.log("Semantic search request body:", body);

  // Use single endpoint - authentication is handled by the service
  const baseUrl = getSemanticSearchUrl();
  const url = `${baseUrl}/api/search`;

  // Prepare headers
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  // Add authentication if available
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  // Note: No API key fallback for unauthenticated users
  // Unauthenticated requests should only access public data

  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      // Add timeout
      signal: AbortSignal.timeout(30000), // 30 second timeout
    });

    if (!response.ok) {
      console.error(
        `Semantic search failed: ${response.status} ${response.statusText}`
      );
      return {
        hits: [],
        status: "error",
        message: `Search failed: ${response.statusText}`,
      };
    }

    const data: SemanticSearchResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Semantic search error:", error);
    return {
      hits: [],
      status: "error",
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getSemanticStats(params: {
  fields: string[];
  filters?: SemanticSearchFilters;
  vecdb?: string;
}): Promise<{
  doc_count: number;
  fields: Record<string, Record<string, number>>;
  status: "ok" | "error";
}> {
  const { fields, filters, vecdb = "main" } = params;
  const token = await session_token();

  // Prepare filters with proper security - authenticated users get more access
  const searchFilters: SemanticSearchFilters = {
    ...filters,
    // Only authenticated users can access preview content statistics
    status: token ? ["public", "preview"] : ["public"],
  };

  const body = {
    fields,
    filters: searchFilters,
    vecdb,
  };

  const baseUrl = getSemanticSearchUrl();
  const url = `${baseUrl}/api/stats`;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  // Only add authentication if user is logged in
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  // Note: No API key fallback - unauthenticated requests get public data only

  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) {
      return { doc_count: 0, fields: {}, status: "error" };
    }

    return await response.json();
  } catch (error) {
    console.error("Semantic stats error:", error);
    return { doc_count: 0, fields: {}, status: "error" };
  }
}

/**
 * Check health of semantic search service
 */
export async function checkSemanticSearchHealth(): Promise<{
  status: string;
  service: string;
  qdrant_connected: boolean;
  embedding_model_loaded: boolean;
  version: string;
}> {
  const baseUrl = getSemanticSearchUrl();
  const url = `${baseUrl}/health`;

  try {
    const response = await fetch(url, {
      method: "GET",
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      throw new Error(`Health check failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Health check error:", error);
    return {
      status: "unhealthy",
      service: "semantic-search",
      qdrant_connected: false,
      embedding_model_loaded: false,
      version: "unknown",
    };
  }
}
