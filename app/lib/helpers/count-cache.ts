/**
 * Simple in-memory cache for API count results
 * Reduces redundant count queries for frequently accessed pages
 */

interface CacheEntry {
  count: number;
  timestamp: number;
}

const countCache = new Map<string, CacheEntry>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Generate cache key from API parameters
 */
export function generateCacheKey(
  endpoint: string,
  params: Record<string, any>
): string {
  // Sort keys for consistent cache keys
  const sortedParams = Object.keys(params)
    .sort()
    .reduce((acc, key) => {
      // Exclude pagination params from cache key
      if (key !== 'page' && key !== 'limit' && key !== 'offset') {
        acc[key] = params[key];
      }
      return acc;
    }, {} as Record<string, any>);

  return `${endpoint}:${JSON.stringify(sortedParams)}`;
}

/**
 * Get cached count if available and not expired
 */
export function getCachedCount(cacheKey: string): number | null {
  const cached = countCache.get(cacheKey);
  
  if (!cached) return null;
  
  const age = Date.now() - cached.timestamp;
  if (age > CACHE_TTL) {
    countCache.delete(cacheKey);
    return null;
  }
  
  return cached.count;
}

/**
 * Store count in cache
 */
export function setCachedCount(cacheKey: string, count: number): void {
  countCache.set(cacheKey, {
    count,
    timestamp: Date.now(),
  });
}

/**
 * Clear all cached counts
 */
export function clearCountCache(): void {
  countCache.clear();
}

/**
 * Clear expired cache entries (runs periodically)
 */
export function cleanExpiredCache(): void {
  const now = Date.now();
  for (const [key, entry] of countCache.entries()) {
    if (now - entry.timestamp > CACHE_TTL) {
      countCache.delete(key);
    }
  }
}

// Clean expired cache every 10 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanExpiredCache, 10 * 60 * 1000);
}
