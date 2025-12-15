// Server-only Postgres helper for multiple databases using node-postgres (pg)
// When running under ts-node in the worker container, the virtual "server-only" module may not be present.
// Use a runtime-safe require to avoid crashing the worker.
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('server-only');
} catch (e) {
  // ignore: running outside Next.js server runtime
}
import pg from 'pg';

export type DBKey = 'experiment' | 'learningplan' | 'solutions' | 'general' | 'blogs';

// Support either full URL env var or individual components per DB.
function envFor(key: DBKey) {
  const upper = key.toUpperCase();
  // Support both plural and singular env var prefixes (e.g. BLOGS_ and BLOG_)
  const prefixes = [upper];
  const singular = upper.replace(/S$/, '');
  if (singular !== upper) prefixes.push(singular);

  for (const p of prefixes) {
    const urlEnv = (process.env as any)[`${p}_DB_URL`];
    if (urlEnv) return { connectionString: urlEnv };

    const host = (process.env as any)[`${p}_DB_HOST`];
    const port = (process.env as any)[`${p}_DB_PORT`];
    const user = (process.env as any)[`${p}_DB_USER`];
    const password = (process.env as any)[`${p}_DB_PASSWORD`];
    // Allow NAME or DB key variants (e.g. BLOG_DB_NAME or BLOG_DB)
    const database = (process.env as any)[`${p}_DB_NAME`] || (process.env as any)[`${p}_DB_DB`] || (process.env as any)[`${p}_DB`];

    if (host && user && password && database) {
      const portPart = port ? `:${port}` : '';
      const encodedUser = encodeURIComponent(user);
      const encodedPassword = encodeURIComponent(password);
      const conn = `postgresql://${encodedUser}:${encodedPassword}@${host}${portPart}/${database}`;
      return { connectionString: conn };
    }
  }

  return null;
}

// Keep singleton Pool instances across module reloads
const globalAny: any = globalThis as any;
if (!globalAny.__pgPools) globalAny.__pgPools = {};

function getPool(dbKey: DBKey): any {
  const cfg = envFor(dbKey);
  if (!cfg) throw new Error(`Database config for "${dbKey}" not configured. Expected ${dbKey.toUpperCase()}_DB_URL or ${dbKey.toUpperCase()}_DB_HOST/PORT/USER/PASSWORD/NAME`);

  if (!globalAny.__pgPools[dbKey]) {
    const connStr: string = cfg.connectionString as string;
    const hostEnv = (process.env as any)[`${dbKey.toUpperCase()}_DB_HOST`] || '';
    
    // Don't require SSL for localhost/local connections
    const isLocalHost = /localhost|127\.0\.0\.1|::1/i.test(connStr) || /localhost|127\.0\.0\.1|::1/i.test(hostEnv);
    const requireSsl = !isLocalHost && ((process.env.DB_REQUIRE_SSL === 'true') || /azure|postgres\.database\.azure\.com/i.test(connStr) || /azure|postgres\.database\.azure\.com/i.test(hostEnv));

    const poolConfig: any = {
      connectionString: connStr,
      max: Number(process.env.PG_POOL_MAX) || 10,
      idleTimeoutMillis: Number(process.env.PG_IDLE_TIMEOUT_MS) || 30000,
    };

    if (requireSsl) {
      poolConfig.ssl = { rejectUnauthorized: false };
    }

    // Log connection info (mask password)
    const dbMatch = connStr.match(/\/([^/]+)(\?|$)/);
    const dbName = dbMatch ? dbMatch[1] : 'unknown';
    console.log(`[DB] Creating pool for "${dbKey}" connecting to database: ${dbName} (SSL: ${requireSsl ? 'enabled' : 'disabled'})`);

    globalAny.__pgPools[dbKey] = new pg.Pool(poolConfig);
  }

  return globalAny.__pgPools[dbKey];
}

export async function query<T = any>(dbKey: DBKey, text: string, params?: any[]): Promise<any> {
  const pool = getPool(dbKey);
  try {
    return await pool.query(text, params);
  } catch (error: any) {
    console.error(`Database query error for "${dbKey}":`, error.message);
    console.error('Query:', text.substring(0, 200));
    console.error('Params:', params);
    throw error;
  }
}

export async function getClient(dbKey: DBKey): Promise<any> {
  const pool = getPool(dbKey);
  const client = await pool.connect();
  return client;
}

export default { query, getClient };
