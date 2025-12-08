// Job management for export queue

import { query as dbQuery } from '../../app/lib/db';
import type { ExportJob } from './types';

/**
 * Ensure required columns exist in export_jobs table
 */
export async function ensureJobColumns(): Promise<void> {
  try {
    await dbQuery('general' as any, `
      ALTER TABLE export_jobs 
      ADD COLUMN IF NOT EXISTS worker_id TEXT,
      ADD COLUMN IF NOT EXISTS last_heartbeat TIMESTAMPTZ
    `);
  } catch (e) {
    console.warn('Failed to add worker columns (may already exist)', e);
  }
}

/**
 * Reclaim jobs that have timed out or failed
 * @param timeoutMinutes - Timeout duration in minutes
 * @param maxRetries - Maximum number of retry attempts
 * @returns Number of jobs reclaimed
 */
export async function reaper(
  timeoutMinutes = 10,
  maxRetries = 5
): Promise<number> {
  const cutoff = new Date(Date.now() - timeoutMinutes * 60 * 1000).toISOString();
  
  const result = await dbQuery('general' as any, `
    WITH stuck AS (
      SELECT id, COALESCE((params->>'retries')::int, 0) AS retry_count
      FROM export_jobs
      WHERE status = 'processing'
        AND (last_heartbeat < $1 OR last_heartbeat IS NULL)
    )
    UPDATE export_jobs
    SET 
      status = CASE 
        WHEN s.retry_count >= $2 THEN 'failed'
        ELSE 'pending'
      END,
      error = CASE 
        WHEN s.retry_count >= $2 THEN 'Max retries exceeded'
        ELSE NULL
      END,
      params = jsonb_set(
        COALESCE(params, '{}'::jsonb),
        '{retries}',
        to_jsonb(s.retry_count + 1)
      ),
      worker_id = NULL,
      updated_at = now()
    FROM stuck s
    WHERE export_jobs.id = s.id
    RETURNING export_jobs.id
  `, [cutoff, maxRetries]);

  const count = result.rows?.length || 0;
  if (count > 0) {
    console.log(`Reaper reclaimed ${count} stuck jobs`);
  }
  return count;
}

/**
 * Atomically claim pending jobs for processing
 * @param limit - Maximum number of jobs to claim
 * @param workerId - Worker identifier
 * @returns Array of claimed jobs
 */
export async function claimPendingJobs(
  limit = 5,
  workerId?: string
): Promise<ExportJob[]> {
  const result = await dbQuery('general' as any, `
    UPDATE export_jobs
    SET 
      status = 'processing',
      worker_id = $1,
      last_heartbeat = now(),
      updated_at = now()
    WHERE id IN (
      SELECT id FROM export_jobs
      WHERE status = 'pending'
      ORDER BY created_at ASC
      LIMIT $2
      FOR UPDATE SKIP LOCKED
    )
    RETURNING *
  `, [workerId, limit]);

  return result.rows || [];
}

/**
 * Update job status to done
 * @param jobId - Job ID
 * @param blobUrl - URL to the exported file
 */
export async function markJobDone(
  jobId: string | number,
  blobUrl: string
): Promise<void> {
  const expiresAt = new Date(Date.now() + 24 * 3600 * 1000).toISOString();
  await dbQuery('general' as any, `
    UPDATE export_jobs 
    SET 
      status = 'done',
      blob_url = $1,
      expires_at = $2,
      updated_at = now(),
      worker_id = NULL,
      last_heartbeat = now()
    WHERE id = $3
  `, [blobUrl, expiresAt, jobId]);
}

/**
 * Update job status to failed
 * @param jobId - Job ID
 * @param error - Error message
 */
export async function markJobFailed(
  jobId: string | number,
  error: string
): Promise<void> {
  await dbQuery('general' as any, `
    UPDATE export_jobs 
    SET 
      status = 'failed',
      error = $1,
      updated_at = now(),
      worker_id = NULL,
      last_heartbeat = now()
    WHERE id = $2
  `, [error, jobId]);
}

/**
 * Send heartbeat for active worker
 * @param workerId - Worker identifier
 */
export async function sendHeartbeat(workerId: string): Promise<void> {
  try {
    await dbQuery('general' as any, `
      UPDATE export_jobs 
      SET last_heartbeat = now(), updated_at = now() 
      WHERE worker_id = $1 AND status = 'processing'
    `, [workerId]);
  } catch (e) {
    console.warn('Heartbeat failed', String((e as any)?.message || e));
  }
}
