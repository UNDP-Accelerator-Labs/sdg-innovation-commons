"use client";

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'sdg_external_db_v1';
const TTL = 1000 * 60 * 60 * 24; // 24 hours

export type ExternalDbEntry = { id: number; db: string; name?: string };

export default function useExternalDb() {
  const [data, setData] = useState<ExternalDbEntry[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function load() {
      setLoading(true);

      try {
        const stored = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.ts && Date.now() - parsed.ts < TTL && parsed.data) {
            setData(parsed.data);
            setLoading(false);
            return;
          }
        }

        const res = await fetch('/api/external-db/values');
        const json = await res.json();
        if (json?.ok && Array.isArray(json.data)) {
          setData(json.data);
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ ts: Date.now(), data: json.data }));
          } catch (e) {
            // ignore storage errors
          }
        }
      } catch (error) {
        console.error('Failed to load external DB values:', error);
      }

      setLoading(false);
    }

    load();
  }, []);

  function getIdByDb(dbName: string): number | null {
    if (!data) return null;
    const entry = data.find((d) => d.db === dbName || d.db === dbName.toLowerCase());
    return entry ? entry.id : null;
  }

  return { data, loading, getIdByDb };
}
