import { NextResponse } from 'next/server';
import getSession from '@/app/lib/session';
import { query as dbQuery } from '@/app/lib/db';

export async function POST(req: Request) {
  const session = await getSession();
  const rights = session?.rights || 0;
  if (!session || rights < 4) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const uuid = body?.uuid;
  if (!uuid) return NextResponse.json({ error: 'Missing uuid' }, { status: 400 });

  try {
    // check whether deleted column exists to avoid SQL error
    const colRes = await dbQuery('general', `SELECT 1 FROM information_schema.columns WHERE table_name = $1 AND column_name = $2 LIMIT 1`, ['users', 'deleted']);
    const hasDeleted = (colRes.rows || []).length > 0;

    if (hasDeleted) {
      const res = await dbQuery('general', `UPDATE users SET deleted = true, left_at = NOW() WHERE uuid = $1 RETURNING deleted, left_at`, [uuid]);
      const deleted = res.rows?.[0]?.deleted;
      const left_at = res.rows?.[0]?.left_at;
      return NextResponse.json({ deleted, left_at });
    } else {
      // fallback to setting left_at if deleted column missing (platform uses left_at)
      const res = await dbQuery('general', `UPDATE users SET left_at = NOW() WHERE uuid = $1 RETURNING left_at`, [uuid]);
      const left_at = res.rows?.[0]?.left_at;
      return NextResponse.json({ deleted: null, left_at });
    }
  } catch (e) {
    console.error('Deactivate error', e);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
