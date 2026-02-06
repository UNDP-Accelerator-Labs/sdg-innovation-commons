/**
 * Custom hooks for test page data management
 * @module test/[platform]/hooks
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { pagestats } from '@/app/ui/components/Pagination';
import platformApi from '@/app/lib/data/platform';
import { getRegion } from '@/app/lib/data/platform';
import nlpApi from '@/app/lib/data/nlp-api';
import { page_limit } from '@/app/lib/helpers/utils';
import { trackSearch } from '@/app/lib/analytics/search-tracking';
import type {
  ContentItem,
  FetchDataResult,
  PageStatsResponse,
  SearchTrackingPayload,
} from './types';
import {
  normalizeApiResponse,
  extractObjectIds,
  groupItemsByPlatform,
  buildDownloadUrl,
  hasFilterParams as checkFilterParams,
  prepareSearchParams,
} from './utils';

/**
 * Hook for fetching and managing test page data
 */
export function useTestPageData(
  platform: string,
  searchParams: any,
  tabs: string[]
) {
  const { page, search } = searchParams;
  
  const [loading, setLoading] = useState<boolean>(true);
  const [hits, setHits] = useState<ContentItem[]>([]);
  const [pages, setPages] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [useNlp, setUseNlp] = useState<boolean>(true);
  const [objectIds, setObjectIds] = useState<number[]>([]);
  const [allObjectIds, setAllObjectIds] = useState<Record<string, number[]> | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string>('');

  const hasFilters = useCallback(
    () => checkFilterParams(searchParams),
    [searchParams]
  );

  const fetchData = useCallback(async (): Promise<void> => {
    setLoading(true);

    try {
      let data: ContentItem[];
      let totalCount = 0;
      let totalPages = 0;
      let isUsingNlp = true;

      // Platform API with filters
      if (hasFilters() && platform !== 'all') {
        const response = await platformApi(
          { ...searchParams, limit: page_limit, include_locations: true },
          platform,
          'pads'
        );

        const normalized = normalizeApiResponse(response);
        data = normalized.data;
        totalCount = normalized.count;

        if (totalCount > 0) {
          totalPages = Math.ceil(totalCount / page_limit);
        } else {
          // Fallback to pagestats if count not in response
          const stats: PageStatsResponse = await pagestats(
            page,
            platform,
            searchParams
          );
          totalPages = stats.pages;
          totalCount = stats.total;
        }

        setAllObjectIds(null);
        isUsingNlp = false;
      }
      // NLP API
      else {
        const prepared = await prepareSearchParams(searchParams, getRegion);
        
        let doc_type: string[];
        if (platform === 'all') {
          doc_type = tabs.slice(1); // Exclude 'all' tab - results in ['experiment', 'action plan']
        } else {
          doc_type = [platform];
        }

        const stats: PageStatsResponse = await pagestats(page, doc_type, prepared);
        totalPages = stats.pages;
        totalCount = stats.total;

        const nlpResponse = await nlpApi({
          ...prepared,
          limit: page_limit,
          doc_type,
        });

        const normalized = normalizeApiResponse(nlpResponse);
        data = normalized.data;

        // Group items by platform for NLP results
        const grouped = groupItemsByPlatform(data);
        setAllObjectIds(grouped);
        
        isUsingNlp = true;
      }

      setHits(data);
      setPages(totalPages);
      setTotal(totalCount);
      setUseNlp(isUsingNlp);

      // Extract IDs and build download URL
      const ids = extractObjectIds(data);
      setObjectIds(ids);

      if (ids.length > 0) {
        const baseUrl = await platformApi(
          { render: true, action: 'download' },
          platform,
          'pads',
          true
        );
        const url = buildDownloadUrl(baseUrl, ids);
        setDownloadUrl(url);
      } else {
        setDownloadUrl('');
      }
    } catch (error) {
      console.error('Error fetching test page data:', error);
      setHits([]);
      setPages(0);
      setTotal(0);
      setObjectIds([]);
      setAllObjectIds(null);
      setDownloadUrl('');
    } finally {
      setLoading(false);
    }
  }, [platform, page, tabs, JSON.stringify(searchParams)]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    loading,
    hits,
    pages,
    total,
    useNlp,
    objectIds,
    allObjectIds,
    downloadUrl,
    hasFilters: hasFilters(),
    refetch: fetchData,
  };
}

/**
 * Hook for tracking search events
 */
export function useSearchTracking(
  platform: string,
  searchQuery: string,
  resultsCount: number,
  page: string | number,
  filterParams: any
) {
  useEffect(() => {
    if (searchQuery && searchQuery.trim().length > 0) {
      trackSearch({
        query: searchQuery.trim(),
        platform,
        searchType: 'general',
        resultsCount,
        pageNumber: parseInt(String(page)) || 1,
        filters: filterParams,
      });
    }
  }, [searchQuery, resultsCount, page, filterParams, platform]);
}
