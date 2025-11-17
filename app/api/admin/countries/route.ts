import { NextResponse } from 'next/server';
import getSession from '@/app/lib/session';
import { query as dbQuery } from '@/app/lib/db';

export async function GET(req: Request) {
  const session = await getSession();
  const rights = session?.rights || 0;
  if (!session || rights < 4) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    // Try common column names for ISO3 code; prefer iso3
    const sql = `SELECT COALESCE(iso_a3, adm0_a3, NULL) AS code, name FROM adm0 ORDER BY name`;
    const res = await dbQuery('general', sql, []);
    const rows = (res.rows || []).map((r: any) => ({ code: r.code || '', name: r.name || '' }));
    return NextResponse.json({ countries: rows });
  } catch (e) {
    console.error('Failed to fetch adm0 countries', e);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
