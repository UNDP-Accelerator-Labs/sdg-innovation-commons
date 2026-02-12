/**
 * Custom hooks for see page data management
 * @module see/hooks
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { pagestats } from '@/app/ui/components/Pagination';
import platformApi from '@/app/lib/data/platform';
import nlpApi from '@/app/lib/data/nlp-api';
import { page_limit } from '@/app/lib/helpers/utils';
import { trackSearch } from '@/app/lib/analytics/search-tracking';
import type { ContentItem, PageStatsResponse } from './types';
import {
  normalizeApiResponse,
  extractObjectIds,
  buildDownloadUrl,
  hasFilterParams as checkFilterParams,
} from './utils';

const PLATFORM = 'solution';

/**
 * Hook for fetching and managing see page data
 */
export function useSeePageData(searchParams: any) {
  const { page, search } = searchParams;
  
  const [loading, setLoading] = useState<boolean>(true);
  const [hits, setHits] = useState<ContentItem[]>([]);
  const [pages, setPages] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [useNlp, setUseNlp] = useState<boolean>(true);
  const [objectIds, setObjectIds] = useState<number[]>([]);
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

      // Platform API (no search or with filters)
      if (!search || hasFilters()) {
        const response = await platformApi(
          { ...searchParams, limit: page_limit },
          PLATFORM,
          'pads'
        );

        const normalized = normalizeApiResponse(response);
        data = normalized.data;
        totalCount = normalized.count;
        totalPages = Math.ceil(totalCount / page_limit);

        isUsingNlp = false;
      }
      // NLP API (with search, no filters)
      else {
        const nlpResponse = await nlpApi({
          ...searchParams,
          limit: page_limit,
          doc_type: PLATFORM,
        });

        const normalized = normalizeApiResponse(nlpResponse);
        data = normalized.data;

        const stats: PageStatsResponse = await pagestats(
          page,
          [PLATFORM],
          searchParams
        );
        totalPages = stats.pages;
        totalCount = stats.total;

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
          PLATFORM,
          'pads',
          true
        );
        const url = buildDownloadUrl(baseUrl, ids);
        setDownloadUrl(url);
      } else {
        setDownloadUrl('');
      }
    } catch (error) {
      console.error('Error fetching see page data:', error);
      setHits([]);
      setPages(0);
      setTotal(0);
      setObjectIds([]);
      setDownloadUrl('');
    } finally {
      setLoading(false);
    }
  }, [page, search, JSON.stringify(searchParams)]);

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
    downloadUrl,
    hasFilters: hasFilters(),
    refetch: fetchData,
  };
}

/**
 * Hook for tracking search events on see page
 */
export function useSeeSearchTracking(
  searchQuery: string,
  resultsCount: number,
  page: string | number,
  filterParams: any
) {
  useEffect(() => {
    if (searchQuery && searchQuery.trim().length > 0) {
      trackSearch({
        query: searchQuery.trim(),
        platform: 'see',
        searchType: 'general',
        resultsCount,
        pageNumber: parseInt(String(page)) || 1,
        filters: filterParams,
      });
    }
  }, [searchQuery, resultsCount, page, filterParams]);
}
