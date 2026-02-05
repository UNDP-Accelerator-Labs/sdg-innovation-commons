/**
 * Enhanced database connection manager with proper pooling and error handling
 * Server-only module for PostgreSQL database operations using node-postgres (pg)
 * @module lib/services/database
 */

// Server-only guard
try {
  require('server-only');
} catch (e) {
  // Running outside Next.js server runtime (e.g., worker)
}

import pg from 'pg';
const { Pool } = pg;
import type { DBKey } from '../types';
import { DB_CONFIG } from '../config';

/**
 * Database configuration from environment variables
 */
interface DbConfig {
  connectionString: string;
}

/**
 * Get database configuration for a specific database key
 * Supports both full URL env var or individual components per DB
 * 
 * @param key - Database key identifier
 * @returns Database configuration or null if not configured
 */
function getDbConfig(key: DBKey): DbConfig | null {
  // Allow skipping database connections for testing/development
  if (process.env.SKIP_DB_CONNECTION === 'true') {
    console.log(`[DB] Skipping database connection for "${key}" (SKIP_DB_CONNECTION=true)`);
    return null;
  }

  const upper = key.toUpperCase();
  
  // Support both plural and singular env var prefixes (e.g., BLOGS_ and BLOG_)
  const prefixes = [upper];
  const singular = upper.replace(/S$/, '');
  if (singular !== upper) prefixes.push(singular);

  for (const prefix of prefixes) {
    // Check for full connection string
    const urlEnv = (process.env as any)[`${prefix}_DB_URL`];
    if (urlEnv) {
      return { connectionString: urlEnv };
    }

    // Build connection string from individual components
    const host = (process.env as any)[`${prefix}_DB_HOST`];
    const port = (process.env as any)[`${prefix}_DB_PORT`];
    const user = (process.env as any)[`${prefix}_DB_USER`];
    const password = (process.env as any)[`${prefix}_DB_PASSWORD`];
    const database = 
      (process.env as any)[`${prefix}_DB_NAME`] || 
      (process.env as any)[`${prefix}_DB_DB`] || 
      (process.env as any)[`${prefix}_DB`];

    if (host && user && password && database) {
      const portPart = port ? `:${port}` : '';
      const encodedUser = encodeURIComponent(user);
      const encodedPassword = encodeURIComponent(password);
      const connectionString = `postgresql://${encodedUser}:${encodedPassword}@${host}${portPart}/${database}`;
      return { connectionString };
    }
  }

  return null;
}

/**
 * Determine if SSL should be required for the connection
 * 
 * @param connectionString - Database connection string
 * @param hostEnv - Host environment variable
 * @returns Whether SSL should be required
 */
function shouldRequireSSL(connectionString: string, hostEnv: string): boolean {
  const isLocalHost = /localhost|127\.0\.0\.1|::1/i.test(connectionString) || 
                      /localhost|127\.0\.0\.1|::1/i.test(hostEnv);
  
  if (isLocalHost) {
    return false;
  }

  return DB_CONFIG.requireSSL || 
         /azure|postgres\.database\.azure\.com/i.test(connectionString) || 
         /azure|postgres\.database\.azure\.com/i.test(hostEnv);
}

/**
 * Extract database name from connection string for logging
 * 
 * @param connectionString - Database connection string
 * @returns Database name or 'unknown'
 */
function extractDbName(connectionString: string): string {
  const dbMatch = connectionString.match(/\/([^/?]+)(\?|$)/);
  return dbMatch ? dbMatch[1] : 'unknown';
}

// Singleton pool instances stored globally to survive module reloads
const globalAny: any = globalThis as any;
if (!globalAny.__pgPools) {
  globalAny.__pgPools = {};
}

/**
 * Get or create a connection pool for a specific database
 * Implements singleton pattern to reuse pools across requests
 * 
 * @param dbKey - Database key identifier
 * @returns PostgreSQL connection pool
 * @throws Error if database configuration is not found
 */
function getPool(dbKey: DBKey): any {
  const config = getDbConfig(dbKey);
  
  if (!config) {
    // If SKIP_DB_CONNECTION is set, return a mock pool that throws on use
    if (process.env.SKIP_DB_CONNECTION === 'true') {
      return {
        query: () => {
          throw new Error(`Database queries disabled (SKIP_DB_CONNECTION=true). Cannot query "${dbKey}".`);
        },
        connect: () => {
          throw new Error(`Database connections disabled (SKIP_DB_CONNECTION=true). Cannot connect to "${dbKey}".`);
        },
        end: () => Promise.resolve(),
      };
    }
    
    throw new Error(
      `Database config for "${dbKey}" not configured. ` +
      `Expected ${dbKey.toUpperCase()}_DB_URL or ` +
      `${dbKey.toUpperCase()}_DB_HOST/PORT/USER/PASSWORD/NAME`
    );
  }

  // Return existing pool if available
  if (globalAny.__pgPools[dbKey]) {
    return globalAny.__pgPools[dbKey];
  }

  const { connectionString } = config;
  const hostEnv = (process.env as any)[`${dbKey.toUpperCase()}_DB_HOST`] || '';
  const requireSsl = shouldRequireSSL(connectionString, hostEnv);

  const poolConfig: any = {
    connectionString,
    max: DB_CONFIG.poolMax,
    idleTimeoutMillis: DB_CONFIG.idleTimeoutMs,
  };

  if (requireSsl) {
    poolConfig.ssl = { rejectUnauthorized: false };
  }

  // Log connection info (without exposing credentials)
  const dbName = extractDbName(connectionString);
  console.log(
    `[DB] Creating pool for "${dbKey}" connecting to database: ${dbName} ` +
    `(SSL: ${requireSsl ? 'enabled' : 'disabled'})`
  );

  globalAny.__pgPools[dbKey] = new Pool(poolConfig);
  return globalAny.__pgPools[dbKey];
}

/**
 * Execute a parameterized SQL query
 * 
 * @template T - Expected result type
 * @param dbKey - Database key identifier
 * @param text - SQL query string
 * @param params - Query parameters (optional)
 * @returns Query result
 * @throws Error with detailed context if query fails
 * 
 * @example
 * ```typescript
 * const result = await query<User>('general', 
 *   'SELECT * FROM users WHERE email = $1', 
 *   ['user@example.com']
 * );
 * ```
 */
export async function query<T = any>(
  dbKey: DBKey, 
  text: string, 
  params?: any[]
): Promise<any> {
  const pool = getPool(dbKey);
  
  try {
    return await pool.query(text, params);
  } catch (error: any) {
    console.error(`[DB Error] Database "${dbKey}":`, error.message);
    console.error('[DB Error] Query:', text.substring(0, 200));
    console.error('[DB Error] Params:', params);
    throw error;
  }
}

/**
 * Get a database client from the pool for transaction management
 * Remember to release the client when done!
 * 
 * @param dbKey - Database key identifier
 * @returns PostgreSQL client
 * 
 * @example
 * ```typescript
 * const client = await getClient('general');
 * try {
 *   await client.query('BEGIN');
 *   // ... your queries
 *   await client.query('COMMIT');
 * } catch (e) {
 *   await client.query('ROLLBACK');
 *   throw e;
 * } finally {
 *   client.release();
 * }
 * ```
 */
export async function getClient(dbKey: DBKey): Promise<any> {
  const pool = getPool(dbKey);
  return await pool.connect();
}

/**
 * Execute multiple queries in a transaction
 * Automatically handles commit/rollback and client release
 * 
 * @template T - Expected result type
 * @param dbKey - Database key identifier
 * @param callback - Async function that performs queries
 * @returns Result from callback
 * 
 * @example
 * ```typescript
 * const result = await transaction('general', async (client) => {
 *   await client.query('INSERT INTO users ...');
 *   await client.query('INSERT INTO profiles ...');
 *   return { success: true };
 * });
 * ```
 */
export async function transaction<T>(
  dbKey: DBKey,
  callback: (client: any) => Promise<T>
): Promise<T> {
  const client = await getClient(dbKey);
  
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Close all database connection pools
 * Useful for graceful shutdown
 */
export async function closeAllPools(): Promise<void> {
  const pools = globalAny.__pgPools || {};
  const closePromises = Object.values(pools).map((pool: any) => pool.end());
  await Promise.all(closePromises);
  globalAny.__pgPools = {};
  console.log('[DB] All connection pools closed');
}

/**
 * Default export with legacy compatibility
 */
export default {
  query,
  getClient,
  transaction,
  closeAllPools,
};
