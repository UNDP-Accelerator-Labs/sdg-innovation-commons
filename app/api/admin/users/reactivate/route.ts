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
    const res = await dbQuery('general', `UPDATE users SET deleted = false WHERE uuid = $1 RETURNING deleted`, [uuid]);
    const deleted = res.rows?.[0]?.deleted;
    return NextResponse.json({ deleted });
  } catch (e) {
    console.error('Reactivate error', e);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
