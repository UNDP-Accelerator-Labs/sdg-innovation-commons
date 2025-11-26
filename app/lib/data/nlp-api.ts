'use server';
import { NLP_URL, commonsPlatform, polishTags, page_limit } from '@/app/lib/utils';
import get from './get';
import platformApi from './platform-api';
import { session_token } from '@/app/lib/session';
import blogApi from './blogs-api';

export interface Props {
    page?: number | undefined;
    limit?: number | undefined;
    offset?: number;
    search?: string;
    language?: any;
    iso3?: any;
    doc_type?: (string | undefined)[] | undefined;
}

export interface ContentRemovalProps {
  platform: string;
  contentId: string;
}

// CHANGED country TO iso3

export default async function nlpApi(_kwargs: Props) {
    let { page, limit, offset, search, language, iso3, doc_type } = _kwargs;
    if (!page || isNaN(page)) page = 1;
    if (!Array.isArray(language)) language = [language].filter((d: string | undefined) => d);
    if (!Array.isArray(iso3)) iso3 = [iso3].filter((d: string | undefined) => d);
    if (!Array.isArray(doc_type)) doc_type = [doc_type].filter((d: string | undefined) => d);

    const token = await session_token();

    const body = {
        input: search ?? '',
        page_limit: page,
        page,
        limit: limit ?? 10,
        offset: (page - 1) * (limit ?? 0),
        short_snippets: true,
        vecdb: 'main',
        db: 'main',
        token: token ?? '',
        filters: {
            language,
            doc_type,
            iso3,
            status : token ? ["public", "preview"] : [ "public"] 
        }
    }

    let { hits, status } = await get({
        url: `${NLP_URL}/${token ? 'query_embed' : 'search'}`,
        method: 'POST',
        body,
    }) || {};

    if (status?.toLowerCase() === 'ok') {
        const bases = hits.map((d: any) => d.base)
        .filter((value: any, index: number, self: any) => {
            return self.indexOf(value) === index;
        }).filter((d: any) => {
            let platform = d;
            if (platform === 'actionplan') platform = 'action plan';
            if (platform === 'blog') platform = 'insight';
            return commonsPlatform.some((c: any) => c.key === platform);
        });

        if (bases.length) {
            const data = await Promise.all(bases.map(async (b: string) => {
                const platformHits = hits.filter((d: any) => d.base === b);
                const pads = platformHits.map((d: any) => d.doc_id);
                if (b === 'blog') {
                    return await getCountryNames(platformHits);
                }

                let platform = b;
                if (platform === 'actionplan') platform = 'action plan';
                const platformData: any[] = await platformApi({ pads, limit: page_limit }, platform, 'pads');

                if (search?.length) {
                    platformData?.forEach((d: any) => {
                        // because this is triggered by a search, we use the nlp api snippet which provides a cue as to whi the doc is a hit
                        const { snippets } = platformHits.find((c: any) => c.doc_id === d.pad_id) || {};
                        if (snippets && Array.isArray(snippets)) d.snippet = snippets[0];
                    });
                }
                platformData?.sort((a, b) => {
                    return pads.indexOf(a.pad_id) - pads.indexOf(b.pad_id);
                });

                return platformData;
            }));
            return data.flat();
        } else {
            return await getCountryNames(hits);
        }

    } else return [];
}

async function getCountryNames(data: any[]): Promise<any[]> {
  try {
    // Extract unique ISO3 country codes and document IDs
    const countries = data
      .map((d: any) => d.meta?.iso3)
      .flat()
      .filter((value: any, index: number, self: any) => self.indexOf(value) === index);

    const ids = data.filter((d:any)=> d.base === 'blog').map((d: any) => d.doc_id).flat();

    // Fetch country names and articles in parallel
    const [countryNames, articles] = await Promise.all([
      platformApi({}, 'experiment', 'countries'), // Fetch country data
      blogApi({ pads: ids }), // Fetch articles
    ]);

    // Process each data entry
    data.forEach((d: any) => {
      // Match countries based on ISO3 codes
      const matchingCountries = countryNames?.filter((c: any) => d.meta?.iso3?.includes(c.iso3));

      if (matchingCountries?.length) {
        // Check for entries without sub_iso3 first
        const countryWithoutSubIso3 = matchingCountries.find((c: any) => !c.sub_iso3);
        if (countryWithoutSubIso3) {
          d.country = countryWithoutSubIso3.country;
        } else {
          // Use the first entry with sub_iso3 if all have sub_iso3
          d.country = matchingCountries[0]?.country;
        }
      }

      // Match articles based on document ID
      if (articles?.length) {
        const matchingArticle = articles.find((c: any) => d.doc_id === c.id && d.base === 'blog');
        if (matchingArticle) {
          d.pinboards = matchingArticle.pinboards;
        }
      }
    });

    return data;
  } catch (error) {
    console.error('Error in getCountryNames:', error);
    throw new Error('Failed to fetch country names or articles');
  }
}

/**
 * Remove content from NLP indexes
 * Uses add_embed endpoint with title: null to effectively remove/hide content
 */
export async function removeFromNLPIndex({ platform, contentId }: ContentRemovalProps): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const token = await session_token();
    
    if (!token) {
      return {
        success: false,
        error: 'Authentication token required for NLP API operations'
      };
    }

    // Map platform names to NLP base names
    // Based on the existing mapping in nlp-api.ts
    const platformToBaseMap: Record<string, string> = {
      'solutions_pad': 'solution',
      'learningplan_pad': 'actionplan', 
      'experiment_pad': 'experiment',
      'blogs_pad': 'blog',
      // Add more mappings as needed
    };

    const base = platformToBaseMap[platform];
    if (!base) {
      return {
        success: false,
        error: `Unknown platform: ${platform}. Cannot map to NLP base.`
      };
    }

    // Get write access token - this might need to be configured
    const writeAccess = process.env.NLP_WRITE_ACCESS || "";

    const url = `${NLP_URL}/add_embed`;
    
    // Generate the correct URL based on platform type
    const generateURL = (base: string, contentId: string): string => {
      const urlMap: Record<string, string> = {
        'solution': `https://solutions.sdg-innovation-commons.org/en/view/pad?id=${contentId}`,
        'experiment': `https://experiments.sdg-innovation-commons.org/en/view/pad?id=${contentId}`,
        'actionplan': `https://learningplans.sdg-innovation-commons.org/en/view/pad?id=${contentId}`,
        // For blogs and publications, the URL should be provided in the content/pad data
        // We'll use a fallback pattern for now
        'blog': `https://sdg-innovation-commons.org/blog/${contentId}`
      };
      return urlMap[base] || `https://sdg-innovation-commons.org/${base}/${contentId}`;
    };

    const body = {
      input: "", // Empty input removes the document from the database
      db: "main",
      // base: base,
      doc_id: parseInt(contentId, 10),
      title: null,
      url: generateURL(base, contentId), // Generate correct URL based on platform
      meta: {
        status: "removed", 
        doc_type: base
      },
      token: token,
      write_access: writeAccess
    };
    
    console.log(`Attempting to remove content from NLP index: ${base}/${contentId}`);

    const response = await get({
      url: url,
      method: 'POST',
      body: body
    });

    if (response?.status?.toLowerCase() === 'ok' || response?.message?.toLowerCase().includes('success')) {
      console.log(`Successfully removed content from NLP index: ${base}/${contentId}`);
      return {
        success: true,
        message: `Content removed from NLP index: ${base}/${contentId}`
      };
    } else {
      console.warn(`NLP API response may indicate failure:`, response);
      return {
        success: true, // Don't fail the entire operation - content may not exist in index
        message: `NLP API called for ${base}/${contentId}. Response: ${JSON.stringify(response)}`
      };
    }

  } catch (error) {
    console.error('Failed to remove content from NLP index:', error);
    
    // Don't fail the entire content removal operation if NLP removal fails
    // This is graceful degradation - the content is still marked as removed in the database
    return {
      success: true,
      error: `NLP removal failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      message: 'Content marked as removed in database, but NLP index removal failed'
    };
  }
}

/**
 * Update content relevance in blog database for blogs and publications
 * This sets relevance to 1 when content is removed
 */
export async function updateContentRelevance({ platform, contentId }: ContentRemovalProps): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    // Only apply relevance updates to blogs and similar content types
    if (!platform.includes('blog') && !platform.includes('publications')) {
      return {
        success: true,
        message: `Relevance update not applicable for platform: ${platform}`
      };
    }

    console.log(`Attempting to update content relevance in blog database: ${platform}/${contentId}`);

    // Import the query function from db
    const { query } = await import('@/app/lib/db');

    // Update the relevance in the articles table using the blogs database
    const result = await query('blogs', 
      `UPDATE articles 
       SET relevance = 1, 
           updated_at = NOW()
       WHERE id = $1`,
      [parseInt(contentId, 10)]
    );

    if (result.count > 0) {
      console.log(`Successfully updated content relevance in blog database: ${platform}/${contentId}`);
      return {
        success: true,
        message: `Content relevance updated in blog database: ${platform}/${contentId}`
      };
    } else {
      console.warn(`No rows updated for content: ${platform}/${contentId} - content may not exist`);
      return {
        success: true, // Don't fail the operation - content might not exist in articles table
        message: `Content ${platform}/${contentId} not found in articles table`
      };
    }

  } catch (error) {
    console.error('Failed to update content relevance in blog database:', error);
    
    return {
      success: true, // Don't fail the entire content removal operation
      error: `Blog database relevance update failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      message: 'Content removal completed, but blog database relevance update failed'
    };
  }
}