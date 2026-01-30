"use server";

import { semanticSearch, SemanticSearchFilters } from "@/app/lib/services/semantic-search-client";
import { SEMANTIC_SEARCH_URL, SEMANTIC_SEARCH_API_KEY } from "@/app/lib/config/constants";
import {
  commonsPlatform,
  page_limit,
} from "@/app/lib/helpers/utils";
import { mapPlatformToShortkey, getExternDbIdForPlatform } from "@/app/lib/helpers";
import platformApi from "./platform-api";
import blogApi from "./blogs-api";

export interface Props {
  page?: number | undefined;
  limit?: number | undefined;
  offset?: number;
  search?: string;
  language?: any;
  iso3?: any;
  doc_type?: (string | undefined)[] | undefined;
  pads?: any[];
  id_dbpads?: any[];
}

export interface ContentRemovalProps {
  platform: string;
  contentId: string;
}

/**
 * Main nlpApi function - now uses internal semantic search service
 * 
 * This maintains backward compatibility while using the new internal service.
 */
export default async function nlpApi(_kwargs: Props) {
  let { page, limit, offset, search, language, iso3, doc_type } = _kwargs;
  
  // Normalize parameters
  if (!page || isNaN(page)) page = 1;
  if (!Array.isArray(language))
    language = [language].filter((d: string | undefined) => d);
  if (!Array.isArray(iso3)) 
    iso3 = [iso3].filter((d: string | undefined) => d);
  if (!Array.isArray(doc_type))
    doc_type = [doc_type].filter((d: string | undefined) => d);

  // Prepare filters for semantic search
  const filters: SemanticSearchFilters = {
    language: language.length > 0 ? language : undefined,
    iso3: iso3.length > 0 ? iso3 : undefined,
    doc_type: doc_type.length > 0 ? doc_type : undefined,
  };

  // Call internal semantic search service
  const { hits, status } = await semanticSearch({
    input: search ?? "",
    limit: limit ?? 10,
    offset: offset ?? (page - 1) * (limit ?? 10),
    filters,
    short_snippets: true,
    vecdb: "main",
  });

  if (status?.toLowerCase() === "ok") {
    // Extract unique bases (platforms)
    const bases = hits
      .map((d: any) => d.base)
      .filter((value: any, index: number, self: any) => {
        return self.indexOf(value) === index;
      })
      .filter((d: any) => {
        let platform = d;
        if (platform === "actionplan") platform = "action plan";
        if (platform === "blog") platform = "insight";
        return commonsPlatform.some((c: any) => c.key === platform);
      });

    if (bases.length) {
      const data = await Promise.all(
        bases.map(async (b: string) => {
          const platformHits = hits.filter((d: any) => d.base === b);
          let pads: any[] = [];
          let id_dbpads: any[] = [];
          
          const _pads = await Promise.all(
            platformHits.map(async (d: any) => {
              if (["solution", "experiment", "actionplan"].includes(d.base)) {
                const dbId = await getExternDbIdForPlatform(d.base);
                if (dbId) {
                  id_dbpads.push(`${d.doc_id}-${dbId}`);
                  return `${d.doc_id}-${dbId}`;
                } else {
                  pads.push(d.doc_id);
                  return d.doc_id;
                }
              }
              pads.push(d.doc_id);
              return d.doc_id;
            })
          );
          
          if (b === "blog") {
            return await getCountryNames(platformHits);
          }

          let platform = b;
          if (platform === "actionplan") platform = "action plan";

          const platformResponse: any = await platformApi(
            { pads, id_dbpads, limit: page_limit },
            platform,
            "pads"
          );
          
          // Handle new {count, data} structure or legacy array
          const platformData: any[] = platformResponse?.data || platformResponse || [];

          platformData?.sort((a, b) => {
            return pads.indexOf(a.pad_id) - pads.indexOf(b.pad_id);
          });

          return platformData;
        })
      );
      return data.flat();
    } else {
      return await getCountryNames(hits);
    }
  } else {
    return [];
  }
}

async function getCountryNames(data: any[]): Promise<any[]> {
  try {
    // Extract unique ISO3 country codes and document IDs
    const countries = data
      .map((d: any) => d.meta?.iso3)
      .flat()
      .filter(
        (value: any, index: number, self: any) => self.indexOf(value) === index
      );

    const ids = data
      .filter((d: any) => d.base === "blog")
      .map((d: any) => d.doc_id)
      .flat();

    // Fetch country names and articles in parallel
    const [countryNames, articles] = await Promise.all([
      platformApi({}, "experiment", "countries"),
      blogApi({ pads: ids }),
    ]);

    // Create country lookup map
    const countryMap = new Map(
      countryNames?.map((c: any) => [c.iso_code, c.name])
    );

    // Enhance data with country names
    return data.map((d: any) => ({
      ...d,
      countries: d.meta?.iso3
        ?.map((iso: string) => ({
          iso_code: iso,
          name: countryMap.get(iso) || iso,
        }))
        .filter(Boolean),
      article: articles?.find((a: any) => a.id === d.doc_id),
    }));
  } catch (error) {
    console.error("Error fetching country names:", error);
    return data;
  }
}

/**
 * Remove content from local semantic search service
 * 
 * Simple function that removes a document from the vector database.
 * Supports both platform+contentId or direct docId usage.
 * Requires DUAL authentication: JWT token (cookies) + API key.
 */
export async function removeFromNLPIndex({
  platform,
  contentId,
}: ContentRemovalProps): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  try {
    // Parse contentId to get the document ID
    const docId = parseInt(contentId, 10);
    if (isNaN(docId)) {
      return {
        success: false,
        error: `Invalid content ID: ${contentId}. Must be a numeric ID.`,
      };
    }

    // Check if API key is available
    if (!SEMANTIC_SEARCH_API_KEY) {
      return {
        success: false,
        error: "API key not configured for document removal operations.",
      };
    }

    // Use the secure /api/remove endpoint with dual authentication
    const response = await fetch(`${SEMANTIC_SEARCH_URL}/api/remove`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": SEMANTIC_SEARCH_API_KEY, // API key for dual auth
      },
      credentials: "include", // JWT from cookies
      body: JSON.stringify({
        doc_id: docId,
        url: `/${platform}/${contentId}`, // Optional URL for logging
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.message || `HTTP ${response.status}: Failed to remove document`,
      };
    }

    return {
      success: result.status === "ok",
      message: result.message || `Successfully removed ${platform} content ${contentId}`,
      error: result.status === "error" ? result.message : undefined,
    };

  } catch (error) {
    console.error("Error removing content from semantic search:", error);
    return {
      success: false,
      error: `Failed to remove content: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

/**
 * Helper function to remove document by ID directly
 * 
 * @param docId - Document ID to remove
 * @param url - Optional URL for logging (defaults to /unknown/{docId})
 */
export async function removeDocumentById(docId: number, url?: string): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  return removeFromNLPIndex({
    platform: "unknown",
    contentId: docId.toString(),
  });
}
