/**
 * Custom hooks for next-practices page data management
 * @module next-practices/hooks
 */

'use client';

import { useState, useEffect } from 'react';
import type { Collection } from './types';

/**
 * Hook for fetching user's collections
 */
export function useMyCollections(isLoggedIn: boolean) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    
    if (!isLoggedIn) {
      setCollections([]);
      return;
    }

    setLoading(true);
    setError(null);

    (async () => {
      try {
        const res = await fetch('/api/my-collections');
        if (!mounted) return;
        
        if (res.ok) {
          const data = await res.json();
          setCollections(data || []);
        } else {
          throw new Error('Failed to fetch collections');
        }
      } catch (e) {
        console.error('Failed to fetch my collections', e);
        if (mounted) {
          setError(e instanceof Error ? e : new Error('Unknown error'));
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [isLoggedIn]);

  return { collections, loading, error };
}

/**
 * Hook for fetching public collections
 */
export function usePublicCollections(limit: number = 12) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const res = await fetch(`/api/collections?list=public&limit=${limit}`);
        if (!mounted) return;
        
        if (res.ok) {
          const data = await res.json();
          setCollections(data || []);
        } else {
          throw new Error('Failed to fetch public collections');
        }
      } catch (e) {
        console.error('Failed to fetch public collections', e);
        if (mounted) {
          setError(e instanceof Error ? e : new Error('Unknown error'));
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [limit]);

  return { collections, loading, error };
}
