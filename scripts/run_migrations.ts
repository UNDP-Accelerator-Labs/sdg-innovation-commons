#!/usr/bin/env ts-node
// Migration runner: applies SQL files from app/lib/db-schema to the DB(s) specified by a header in each SQL file.
// Usage:
//   pnpm dlx ts-node scripts/run_migrations.ts           # applies migrations for all files (uses each file's DB header or 'general')
//   pnpm dlx ts-node scripts/run_migrations.ts --db=general  # only apply migrations targeting 'general'

import fs from 'fs';
import path from 'path';
import { query } from '../app/lib/db';

function parseDbHeader(sql: string): string[] {
  // look for a header like: -- DB: general,blogs
  const lines = sql.split(/\r?\n/).slice(0, 5);
  for (const l of lines) {
    const m = l.match(/^\s*--\s*DB:\s*(.+)$/i);
    if (m) {
      return m[1].split(',').map(s => s.trim()).filter(Boolean);
    }
  }
  return ['general']; // default
}

async function ensureMigrationsTableFor(dbKey: string) {
  await query(dbKey as any, `CREATE TABLE IF NOT EXISTS schema_migrations (id SERIAL PRIMARY KEY, filename TEXT UNIQUE NOT NULL, applied_at timestamptz NOT NULL DEFAULT NOW())`);
}

async function getAppliedFor(dbKey: string) {
  const res = await query(dbKey as any, `SELECT filename FROM schema_migrations`);
  return new Set(res.rows.map((r: any) => r.filename));
}

async function applyMigrationToDb(filePath: string, filename: string, dbKey: string) {
  const sql = fs.readFileSync(filePath, 'utf8');
  console.log(`Applying ${filename} -> ${dbKey}`);
  try {
    await query(dbKey as any, 'BEGIN');
    await query(dbKey as any, sql);
    await query(dbKey as any, `INSERT INTO schema_migrations (filename) VALUES ($1)`, [filename]);
    await query(dbKey as any, 'COMMIT');
    console.log(`Applied ${filename} on ${dbKey}`);
  } catch (e) {
    console.error(`Failed applying ${filename} on ${dbKey}`, e);
    try { await query(dbKey as any, 'ROLLBACK'); } catch (rbErr) { console.error('Rollback failed', rbErr); }
    throw e;
  }
}

async function main() {
  const argv = process.argv.slice(2);
  const argDb = argv.find(a => a.startsWith('--db='));
  const runAll = argv.includes('--all') || false;
  const filterDb = argDb ? argDb.split('=')[1] : undefined;

  const dir = path.resolve(process.cwd(), 'app/lib/db-schema');
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.sql')).sort();

  // Build a map filename -> dbKeys
  const fileDbMap: Record<string, string[]> = {};
  for (const f of files) {
    const full = path.join(dir, f);
    const sql = fs.readFileSync(full, 'utf8');
    const dbKeys = parseDbHeader(sql);
    fileDbMap[f] = dbKeys;
  }

  // Determine which DB keys we will touch (use filterDb if provided)
  const dbKeysSet = new Set<string>();
  for (const f of files) {
    const keys = fileDbMap[f];
    for (const k of keys) dbKeysSet.add(k);
  }

  // If a filter DB was provided, only consider that DB
  const dbKeysToCheck = filterDb ? [filterDb] : Array.from(dbKeysSet);

  // Ensure migrations table exists for each DB we might write to
  for (const dbKey of dbKeysToCheck) {
    await ensureMigrationsTableFor(dbKey as any);
  }

  // For each DB, get applied migrations
  const appliedByDb: Record<string, Set<string>> = {} as any;
  for (const dbKey of dbKeysToCheck) {
    appliedByDb[dbKey] = await getAppliedFor(dbKey as any);
  }

  // Iterate files and apply to their target DBs
  for (const f of files) {
    const targets = fileDbMap[f];
    // If --db was provided, skip files that don't target it
    if (filterDb && !targets.includes(filterDb)) {
      console.log(`Skipping ${f} (not for ${filterDb})`);
      continue;
    }

    // For each target DB for this file
    for (const dbKey of targets) {
      const applied = appliedByDb[dbKey] || new Set<string>();
      if (applied.has(f)) {
        console.log(`Skipping ${f} on ${dbKey} (already applied)`);
        continue;
      }

      const full = path.join(dir, f);
      await applyMigrationToDb(full, f, dbKey);
      // mark applied in memory so subsequent files in same run see it
      applied.add(f);
    }
  }

  console.log('Migrations complete');
}

main().catch(err => { console.error(err); process.exit(1); });
