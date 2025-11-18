#!/usr/bin/env node
// Simple heartbeat writer — writes a small JSON file and optionally upserts to Postgres so the main app can check worker health when worker runs in a separate container.
const fs = require('fs');
const path = require('path');
const os = require('os');

const heartbeatPath = process.env.WEBJOB_HEARTBEAT_FILE || path.join(process.cwd(), 'App_Data', 'jobs', 'continuous', 'worker', 'worker.heartbeat.json');
const intervalMs = Math.max(5000, parseInt(process.env.WEBJOB_HEARTBEAT_INTERVAL || '30', 10) * 1000);

// Build a stable worker id for this process
const workerId = process.env.WORKER_ID || `${os.hostname()}:${process.pid}:${Math.random().toString(36).slice(2,8)}`;

// Optional Postgres client (use DATABASE_URL or specific GENERAL_DB_URL envs)
let pgPool = null;
let canWriteDb = false;

// Initialize PG connection if possible. This supports either a full connection string
// (GENERAL_DB_URL / DATABASE_URL) or discrete env vars (GENERAL_DB_HOST, GENERAL_DB_PORT, GENERAL_DB_USER, GENERAL_DB_PASSWORD, GENERAL_DB_NAME).
// Also respects DB_REQUIRE_SSL, GENERAL_DB_REQUIRE_SSL or PGSSLMODE to enable ssl with rejectUnauthorized=false when needed (Azure Postgres).
(async function initPg() {
  try {
    const pgConnString = process.env.GENERAL_DB_URL || process.env.GENERAL_DB || process.env.GENERAL_DB_URL || process.env.DATABASE_URL || null;
    const host = process.env.GENERAL_DB_HOST || process.env.GENERAL_DB_HOSTNAME || process.env.DB_HOST || null;

    if (!pgConnString && !host) {
      // No DB configuration provided
      return;
    }

    const { Pool } = require('pg');

    // Determine SSL requirement similar to app/lib/db.ts
    const dbRequireSslFlag = String(process.env.DB_REQUIRE_SSL || process.env.GENERAL_DB_REQUIRE_SSL || process.env.PGSSLMODE || '').toLowerCase();

    const looksLikeAzure = (str) => !!(str && /azure|postgres\.database\.azure\.com/i.test(str));

    let poolConfig = null;
    if (pgConnString) {
      poolConfig = { connectionString: pgConnString, max: 1 };
      const requireSsl = (dbRequireSslFlag === 'true' || dbRequireSslFlag === 'require' || looksLikeAzure(pgConnString));
      if (requireSsl) poolConfig.ssl = { rejectUnauthorized: false };
    } else {
      const port = process.env.GENERAL_DB_PORT ? parseInt(process.env.GENERAL_DB_PORT, 10) : 5432;
      poolConfig = {
        host: host,
        port: port,
        user: process.env.GENERAL_DB_USER,
        password: process.env.GENERAL_DB_PASSWORD,
        database: process.env.GENERAL_DB_NAME || process.env.GENERAL_DB || null,
        max: 1,
      };
      const requireSsl = (dbRequireSslFlag === 'true' || dbRequireSslFlag === 'require' || looksLikeAzure(host));
      if (requireSsl) poolConfig.ssl = { rejectUnauthorized: false };
    }

    pgPool = new Pool(poolConfig);

    // Perform a quick test query to validate the connection. If it fails, we won't enable DB writes.
    try {
      await pgPool.query('SELECT 1');
      canWriteDb = true;
      console.log('worker_heartbeat: connected to Postgres for worker health writes');
    } catch (connErr) {
      console.warn('worker_heartbeat: Postgres test query failed (will skip DB writes)', connErr && connErr.message ? connErr.message : connErr);
      try { await pgPool.end(); } catch (e) {}
      pgPool = null;
      canWriteDb = false;
    }
  } catch (e) {
    console.warn('worker_heartbeat: pg not available or failed to initialize, will skip DB writes', e && e.message ? e.message : e);
    pgPool = null;
    canWriteDb = false;
  }
})();

async function writeDbBeat(obj) {
  if (!canWriteDb || !pgPool) return;
  try {
    // upsert into worker_health table
    const sql = `INSERT INTO worker_health (worker_id, last_seen, pid, uptime, metadata) VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (worker_id) DO UPDATE SET last_seen = EXCLUDED.last_seen, pid = EXCLUDED.pid, uptime = EXCLUDED.uptime, metadata = EXCLUDED.metadata, updated_at = now()`;
    await pgPool.query(sql, [workerId, obj.timestamp, obj.pid, obj.uptime, obj.metadata || null]);
  } catch (e) {
    console.warn('worker_heartbeat: failed to upsert to DB', e?.message || e);
  }
}

function writeBeat() {
  const data = {
    timestamp: new Date().toISOString(),
    pid: process.pid,
    uptime: process.uptime(),
    metadata: {
      hostname: os.hostname(),
    },
  };
  try {
    // Write local file for backward compatibility / local testing
    fs.mkdirSync(path.dirname(heartbeatPath), { recursive: true });
    fs.writeFileSync(heartbeatPath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('worker_heartbeat: failed to write heartbeat file', err?.message || err);
  }

  // Try DB write asynchronously
  if (canWriteDb) {
    writeDbBeat(data).catch(()=>{});
  }
}

writeBeat();
const timer = setInterval(writeBeat, intervalMs);

async function shutdown(code) {
  try { writeBeat(); } catch (e) {}
  clearInterval(timer);
  if (pgPool) {
    try { await pgPool.end(); } catch (e) {}
  }
  process.exit(code || 0);
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));
process.on('uncaughtException', (err) => { console.error('worker_heartbeat uncaughtException', err); shutdown(1); });

// Keep process alive
setInterval(() => {}, 1 << 30);
