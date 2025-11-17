import { NextResponse } from 'next/server';
import getSession from '@/app/lib/session';
import { query as dbQuery } from '@/app/lib/db';

export async function GET(req: Request) {
  const session = await getSession();
  const rights = session?.rights || 0;
  if (!session || rights < 4) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const sql = `
      SELECT ej.id, ej.requester_uuid, u.name AS requester_name, u.email AS requester_email,
             ej.db_keys, ej.kind, ej.format, ej.status, ej.blob_url, ej.expires_at, ej.error, ej.created_at, ej.updated_at,
             ej.params
      FROM export_jobs ej
      LEFT JOIN users u ON ej.requester_uuid = u.uuid
      ORDER BY ej.created_at DESC
      LIMIT 100
    `;
    const res = await dbQuery('general', sql);

    // aggregated stats for dashboard
    const pendingRes = await dbQuery('general', `SELECT COUNT(*)::int AS cnt FROM export_jobs WHERE status = 'pending'`);
    const done24Res = await dbQuery('general', `SELECT COUNT(*)::int AS cnt FROM export_jobs WHERE status = 'done' AND created_at >= NOW() - INTERVAL '24 hours'`);
    const totalDoneRes = await dbQuery('general', `SELECT COUNT(*)::int AS cnt FROM export_jobs WHERE status = 'done'`);

    const stats = {
      pending_count: pendingRes.rows?.[0]?.cnt ?? 0,
      completed_last_24h_count: done24Res.rows?.[0]?.cnt ?? 0,
      total_done_count: totalDoneRes.rows?.[0]?.cnt ?? 0,
    };

    return NextResponse.json({ jobs: res.rows || [], stats });
  } catch (e) {
    console.error('Failed to list export jobs', e);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
