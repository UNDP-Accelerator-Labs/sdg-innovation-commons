#!/usr/bin/env ts-node
/**
 * Export Worker - Main Entry Point
 * 
 * Long-running worker process that:
 * - Claims pending export jobs from the database
 * - Processes them using modular export handlers
 * - Uploads results to Azure Blob Storage
 * - Sends email notifications on completion
 * - Handles job failures and retries
 */

import * as os from 'os';
import { query as dbQuery, getClient } from '../app/lib/db';
import { createNotification } from '../app/lib/data/notifications';

// Import modular export utilities
import {
  sleep,
  sendExportNotification as sendNotification,
  ensureJobColumns,
  reaper,
  claimPendingJobs,
  processJob,
} from './export';

import type { ExportJob } from './export';

/**
 * Main worker loop
 * 
 * Continuously:
 * 1. Runs reaper to reclaim stuck jobs
 * 2. Claims pending jobs atomically
 * 3. Processes each job (XLSX/CSV/JSON export)
 * 4. Uploads to Azure and sends notifications
 * 5. Marks jobs as done or failed
 * 
 * Uses PostgreSQL LISTEN/NOTIFY for efficient job polling
 */
async function main() {
  console.log('Export worker started');

  // Ensure schema has worker columns
  await ensureJobColumns();

  const workerId = `${os.hostname()}:${process.pid}:${Math.random().toString(36).slice(2, 8)}`;

  // Set up heartbeat interval to mark jobs as alive
  let heartbeatInterval: NodeJS.Timer | null = null;
  heartbeatInterval = setInterval(async () => {
    try {
      await dbQuery(
        'general' as any,
        `UPDATE export_jobs SET last_heartbeat = now(), updated_at = now() WHERE worker_id = $1 AND status = 'processing'`,
        [workerId]
      );
    } catch (e) {
      console.warn('Heartbeat failed', String((e as any)?.message || e));
    }
  }, 30 * 1000);

  // Set up a dedicated listener client for LISTEN/NOTIFY
  let listenClient: any = null;
  try {
    listenClient = await getClient('general' as any);
    // pg requires a real client for notifications
    await listenClient.query('LISTEN export_jobs_channel');
    listenClient.on('notification', (msg: any) => {
      // Simple log — the loop will attempt to claim immediately after notification
      console.log('Received notification on export_jobs_channel', msg.payload);
    });
  } catch (e) {
    console.warn('Failed to establish LISTEN client, falling back to polling', e);
    try {
      if (listenClient) listenClient.release();
    } catch (e) {}
    listenClient = null;
  }

  // Main worker loop
  while (true) {
    try {
      // Run reaper to reclaim stuck jobs before claiming
      await reaper(10, 5);

      // Attempt to claim jobs atomically and tag with workerId
      const claimed = await claimPendingJobs(5, workerId);
      if (!claimed || claimed.length === 0) {
        // Nothing claimed — wait for either a notification or a short timeout
        if (listenClient) {
          await new Promise<void>((resolve) => {
            const onNotify = () => {
              resolve();
            };
            // Attach once listener
            listenClient.once('notification', onNotify);
            // Fallback timeout
            const t = setTimeout(() => {
              try {
                listenClient.removeListener('notification', onNotify);
              } catch (e) {}
              resolve();
            }, 5000);
          });
          continue; // Loop and try claiming again
        } else {
          await sleep(5000);
          continue;
        }
      }

      // Process each claimed job
      for (const job of claimed) {
        console.log('Processing job', job.id, 'worker', workerId);
        try {
          const { blobUrl, outFiles } = await processJob(job);

          const expiresAt = new Date(Date.now() + 24 * 3600 * 1000).toISOString();
          await dbQuery(
            'general' as any,
            `UPDATE export_jobs SET status='done', blob_url=$1, expires_at=$2, updated_at=now(), worker_id=NULL, last_heartbeat = now() WHERE id=$3`,
            [blobUrl, expiresAt, job.id]
          );

          // Notify requester
          if (process.env.SMTP_HOST) {
            // Always use requester_uuid to determine primary recipient when possible; include additional email as CC if provided
            let primaryEmail: string | null = null;
            if (job.requester_uuid) {
              const u = await dbQuery(
                'general' as any,
                `SELECT email FROM users WHERE uuid = $1 LIMIT 1`,
                [job.requester_uuid]
              );
              primaryEmail = u.rows?.[0]?.email || null;
            }
            const ccEmail = job.params?.requester_email ? String(job.params.requester_email) : null;
            const toEmail = primaryEmail || ccEmail;

            // If toEmail exists also create an admin notification that export completed, for audit (info)
            try {
              const adminUiBase = process.env.NEXTAUTH_URL || process.env.LOCAL_BASE_URL || 'http://localhost:3000';
              await createNotification({
                type: 'export_completed',
                level: 'info',
                payload: {
                  message: `Export job ${job.id} completed by worker ${workerId}`,
                  blobUrl,
                  jobId: job.id,
                },
                metadata: { adminUrl: `${adminUiBase}/admin/notifications` },
                related_uuids: job.requester_uuid ? [job.requester_uuid] : [],
              });
            } catch (e) {
              console.warn('Failed to persist admin notification for export completion', e);
            }

            const to = toEmail;
            const cc = ccEmail && ccEmail !== toEmail ? ccEmail : undefined;
            if (to && blobUrl) await sendNotification(to, blobUrl, cc);
          }

          // Cleanup tmp (no-op for streaming paths, kept for compatibility)
          // No temp files created in current streaming implementation
        } catch (err: any) {
          console.error('Job failed', job.id, err);
          try {
            await dbQuery(
              'general' as any,
              `UPDATE export_jobs SET status='failed', error=$1, updated_at=now(), worker_id=NULL, last_heartbeat = now() WHERE id=$2`,
              [String(err?.message || err), job.id]
            );
          } catch (e) {
            console.error('Failed to mark job failed', e);
          }
        }
      }
    } catch (err) {
      console.error('Worker loop error', err);
      await sleep(2000);
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
