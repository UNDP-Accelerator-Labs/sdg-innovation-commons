// Helper function to track search queries
'use client';

interface SearchTrackingOptions {
  query: string;
  platform?: string;
  searchType?: 'general' | 'filter' | 'advanced';
  resultsCount?: number;
  pageNumber?: number;
  filters?: Record<string, any>;
}

// Function to detect platform from current URL
function detectPlatformFromUrl(): string {
  if (typeof window === 'undefined') return 'unknown';
  
  const path = window.location.pathname;
  
  // Platform detection based on URL patterns
  if (path.includes('/learn/') || path.includes('/learn')) {
    return 'what-we-learn';
  } else if (path.includes('/see/') || path.includes('/see')) {
    return 'what-we-see';
  } else if (path.includes('/test/') || path.includes('/test')) {
    return 'what-we-test';
  } else if (path.includes('/boards/') || path.includes('/boards')) {
    return 'boards';
  } else if (path.includes('/search/solutions') || path.includes('/solutions')) {
    return 'solutions';
  } else if (path.includes('/search/experiments') || path.includes('/experiments')) {
    return 'experiments';
  } else if (path.includes('/search/action-plans') || path.includes('/action-plans')) {
    return 'action-plans';
  } else if (path.includes('/search/')) {
    return 'global-search';
  } else if (path.includes('/pads/')) {
    return 'pads';
  } else if (path.includes('/next-practices/')) {
    return 'next-practices';
  } else if (path.includes('/about/') || path.includes('/about')) {
    return 'about';
  } else if (path.includes('/profile/') || path.includes('/profile')) {
    return 'profile';
  } else {
    return 'general';
  }
}

// Prevent duplicate tracking of the same search
const trackedSearches = new Set<string>();

export async function trackSearch(options: SearchTrackingOptions) {
  // Only track if query is meaningful
  if (!options.query || options.query.trim().length < 2) {
    console.log('🔍 Search tracking skipped: query too short or empty');
    return;
  }

  // Create a unique key for this search to prevent duplicates
  const searchKey = JSON.stringify({
    query: options.query.trim().toLowerCase(),
    platform: options.platform,
    page: options.pageNumber || 1
  });

  // Don't track the same search multiple times in quick succession
  if (trackedSearches.has(searchKey)) {
    return;
  }

  trackedSearches.add(searchKey);
  
  // Remove from tracking set after 5 seconds to allow re-tracking
  setTimeout(() => {
    trackedSearches.delete(searchKey);
  }, 5000);

  try {
    // Auto-detect platform if not provided
    const detectedPlatform = options.platform || detectPlatformFromUrl();
    
    const body = {
      query: options.query.trim(),
      platform: detectedPlatform,
      searchType: options.searchType || 'general',
      resultsCount: Math.max(0, options.resultsCount || 0),
      pageNumber: Math.max(1, options.pageNumber || 1),
      filters: options.filters || null,
      referrerUrl: typeof window !== 'undefined' ? document.referrer || null : null,
      searchPageUrl: typeof window !== 'undefined' ? window.location.href || null : null
    };

    // Validate body before sending
    if (!body.query || typeof body.query !== 'string') {
      console.warn('🔍 Invalid search query for tracking:', body.query);
      return;
    }
    const response = await fetch('/api/analytics/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn('🔍 Failed to track search:', response.status, errorText);
    } else {
      console.log('🔍 Search tracked successfully');
    }
  } catch (error) {
    // Silently fail search tracking - don't impact user experience
    console.warn('🔍 Search tracking error:', error);
  }
}

// Debounced version for real-time search
let searchTrackingTimeout: NodeJS.Timeout;

export function trackSearchDebounced(options: SearchTrackingOptions, delay: number = 1000) {
  // Validate options before debouncing
  if (!options.query || options.query.trim().length < 2) {
    return;
  }

  clearTimeout(searchTrackingTimeout);
  searchTrackingTimeout = setTimeout(() => {
    trackSearch(options);
  }, delay);
}
