// Database operations for export system

import { query as dbQuery, getClient } from '../../app/lib/db';
import type { ExportJob, UserInfo } from './types';

// Cache for user information to avoid repeated database queries
const usersCache: Record<string, UserInfo | null> = {};

/**
 * Fetch user information with caching
 * @param uuid - User UUID
 * @returns User information or null
 */
export async function enrichUserCached(uuid?: string): Promise<UserInfo | null> {
  if (!uuid) return null;
  
  const key = String(uuid);
  if (usersCache[key]) return usersCache[key];
  
  try {
    const res = await dbQuery('general' as any, `
      SELECT uuid, name, email, iso3 FROM users WHERE uuid = $1 LIMIT 1
    `, [key]);
    const row = res.rows?.[0] || null;
    usersCache[key] = row;
    return row;
  } catch (e) {
    console.warn('Failed to fetch user for enrichment', e);
    usersCache[key] = null;
    return null;
  }
}

/**
 * Fetch administrative boundaries map (ADM0)
 * @returns Map of ISO codes to country names
 */
export async function fetchAdm0Map(): Promise<Map<string, string>> {
  try {
    const candidates = ['iso_a3', 'adm0_a3', 'iso_n3'];

    // Try to find a matching column on a table named exactly 'adm0'
    const colRes = await dbQuery('general' as any, `
      SELECT column_name, table_schema, table_name FROM information_schema.columns
      WHERE lower(table_name) = 'adm0' AND column_name = ANY($1)
      ORDER BY array_position($1, column_name) NULLS LAST
      LIMIT 1
    `, [candidates]);

    let table_schema: string | null = null;
    let table_name: string | null = null;
    let col: string | null = null;

    if (colRes.rows && colRes.rows.length) {
      col = colRes.rows[0].column_name;
      table_schema = colRes.rows[0].table_schema || 'public';
      table_name = colRes.rows[0].table_name || 'adm0';
    } else {
      // Fallback: find any table that looks like adm0 and then a preferred column on it
      const tbl = await dbQuery('general' as any, `
        SELECT table_schema, table_name FROM information_schema.tables
        WHERE lower(table_name) LIKE '%adm0%'
        LIMIT 1
      `);
      if (tbl.rows && tbl.rows.length) {
        table_schema = tbl.rows[0].table_schema || 'public';
        table_name = tbl.rows[0].table_name;
        const colRes2 = await dbQuery('general' as any, `
          SELECT column_name FROM information_schema.columns
          WHERE table_schema = $1 AND table_name = $2 AND column_name = ANY($3)
          ORDER BY array_position($3, column_name) NULLS LAST
          LIMIT 1
        `, [table_schema, table_name, candidates]);
        if (colRes2.rows && colRes2.rows.length) {
          col = colRes2.rows[0].column_name;
        }
      }
    }

    if (!table_schema || !table_name || !col) {
      console.warn('No adm0 table found with recognized columns, skipping ISO3 map fetch');
      return new Map();
    }

    const qry = `SELECT ${col} AS iso3, adm0_a3_us AS name FROM "${table_schema}"."${table_name}"`;
    const res = await dbQuery('general' as any, qry);
    const map = new Map<string, string>();
    for (const r of res.rows || []) {
      if (r.iso3 && r.name) map.set(r.iso3, r.name);
    }
    return map;
  } catch (e) {
    console.warn('Failed to fetch adm0 map', e);
    return new Map();
  }
}

/**
 * Stream query results and process each row with a handler
 * @param dbKey - Database key
 * @param sql - SQL query string
 * @param params - Query parameters
 * @param onRow - Handler function for each row
 */
export async function streamQueryToHandler(
  dbKey: string,
  sql: string,
  params: any[],
  onRow: (row: any) => Promise<void>
): Promise<void> {
  let QueryStream: any = null;
  try {
    QueryStream = require('pg-query-stream');
  } catch (e) {
    QueryStream = null;
  }

  if (QueryStream) {
    const client = await getClient(dbKey as any);
    try {
      const stream = client.query(new QueryStream(sql, params));
      for await (const row of stream) {
        await onRow(row);
      }
    } finally {
      client.release();
    }
  } else {
    // Fallback to loading all rows into memory
    const result = await dbQuery(dbKey as any, sql, params);
    for (const row of result.rows || []) {
      await onRow(row);
    }
  }
}

/**
 * Check if a column exists in a table
 * @param dbKey - Database key
 * @param tableName - Table name
 * @param columnName - Column name
 * @returns True if column exists
 */
export async function hasColumn(
  dbKey: string,
  tableName: string,
  columnName: string
): Promise<boolean> {
  const result = await dbQuery(dbKey as any, `
    SELECT 1 FROM information_schema.columns
    WHERE table_name = $1 AND column_name = $2 LIMIT 1
  `, [tableName, columnName]);
  return result.rows && result.rows.length > 0;
}

/**
 * Check if a table exists
 * @param dbKey - Database key
 * @param tableName - Table name
 * @returns True if table exists
 */
export async function hasTable(dbKey: string, tableName: string): Promise<boolean> {
  const result = await dbQuery(dbKey as any, `
    SELECT 1 FROM information_schema.tables WHERE table_name = $1 LIMIT 1
  `, [tableName]);
  return result.rows && result.rows.length > 0;
}

/**
 * Detect which contributor column exists in the articles table
 * @param dbKey - Database key
 * @returns Column name or null
 */
export async function detectBlogContributorColumn(dbKey: string): Promise<string | null> {
  const candidates = ['contributor', 'source'];
  for (const col of candidates) {
    if (await hasColumn(dbKey, 'articles', col)) {
      return col;
    }
  }
  return null;
}

/**
 * Detect which content column exists in the articles table
 * @param dbKey - Database key
 * @returns Column name or null
 */
export async function detectBlogContentColumn(dbKey: string): Promise<string | null> {
  const candidates = ['sections', 'full_text'];
  for (const col of candidates) {
    if (await hasColumn(dbKey, 'articles', col)) {
      return col;
    }
  }
  return null;
}
