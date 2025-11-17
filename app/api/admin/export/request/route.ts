import { NextResponse } from 'next/server';
import getSession from '@/app/lib/session';
import { query as dbQuery } from '@/app/lib/db';

export async function POST(req: Request) {
  const session = await getSession();
  const rights = session?.rights || 0;
  if (!session || rights < 4) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const db_keys = body?.db_keys || [];
  const kind = body?.kind || 'export';
  const format = body?.format || 'csv';

  // normalize and persist job params and options
  const rawParams = body?.params || {};
  const exclude_pii = body?.exclude_pii ?? rawParams.exclude_pii ?? false;
  const exclude_owner_uuid = body?.exclude_owner_uuid ?? rawParams.exclude_owner_uuid ?? false;
  let statuses = body?.statuses ?? rawParams.statuses ?? null;
  if (typeof statuses === 'string') {
    try { statuses = JSON.parse(statuses); } catch (e) { /* keep as string if JSON.parse fails */ }
  }
  if (!Array.isArray(statuses)) statuses = null;
  // start with any supplied params and normalize flags
  const params: any = { ...rawParams, exclude_pii: !!exclude_pii, exclude_owner_uuid: !!exclude_owner_uuid, statuses };

  // If the client submitted an additional delivery email at the top-level, persist it into params
  const additionalEmail = body?.requester_email ?? rawParams?.requester_email ?? null;
  if (additionalEmail) params.requester_email = String(additionalEmail);

  // Prevent exporting the `general` DB directly
  const forbidden = (Array.isArray(db_keys) ? db_keys : [db_keys]).includes('general');
  if (forbidden) return NextResponse.json({ error: 'Export of general DB data is not allowed' }, { status: 400 });

  try {
    const res = await dbQuery('general', `INSERT INTO export_jobs (requester_uuid, db_keys, kind, format, params) VALUES ($1,$2,$3,$4,$5) RETURNING id, status, created_at`, [session.uuid, db_keys, kind, format, params]);
    const job = res.rows?.[0];
    try {
      // notify workers to wake up and claim jobs (payload is job id)
      if (job?.id) {
        await dbQuery('general' as any, `SELECT pg_notify('export_jobs_channel', $1)`, [String(job.id)]);
      }
    } catch (notifyErr) { console.warn('pg_notify failed (continuing):', notifyErr); }
    return NextResponse.json({ job });
  } catch (e) {
    console.error('Failed to create export job', e);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
