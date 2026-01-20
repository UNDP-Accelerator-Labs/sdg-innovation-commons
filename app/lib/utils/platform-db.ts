/**
 * External database platform mapping utilities
 * Server-only functions for database operations
 * @module lib/utils/platform-db
 */

'use server';

import { query } from '../services/database';

const CACHE_TTL = 1000 * 60 * 60 * 24; // 1 day
let CACHE_TS = 0;
let CACHE_MAP: Map<string, number> = new Map();

/**
 * Load external database platform mappings
 * Caches results for performance
 * 
 * @returns Map of platform shortkeys to database IDs
 */
export async function loadExternDb(): Promise<Map<string, number>> {
  if (Date.now() - CACHE_TS < CACHE_TTL && CACHE_MAP.size > 0) return CACHE_MAP;
  
  try {
    const res = await query("general", "SELECT id, db FROM extern_db");
    const rows = res?.rows || [];
    const m = new Map<string, number>();
    
    rows.forEach((r: any) => {
      if (r.db) m.set(String(r.db).toLowerCase(), r.id);
    });
    
    CACHE_MAP = m;
    CACHE_TS = Date.now();
    return CACHE_MAP;
  } catch (error) {
    console.error("loadExternDb error:", error);
    return CACHE_MAP;
  }
}

/**
 * Get external database ID for a platform name
 * 
 * @param platformName - Platform name to look up
 * @returns Database ID or null if not found
 */
export async function getExternDbIdForPlatform(
  platformName: string
): Promise<number | null> {
  if (!platformName) return null;
  
  const { mapPlatformToShortkey } = await import('./platform');
  const short = mapPlatformToShortkey(platformName);
  const key = String(short).toLowerCase();
  const map = await loadExternDb();
  
  return map.get(key) ?? null;
}
