import { NextResponse } from 'next/server';
import getSession from '@/app/lib/session';
import { query as dbQuery } from '@/app/lib/db';

export async function POST(req: Request) {
  const session = await getSession();
  const rights = session?.rights || 0;
  if (!session || rights < 4) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const uuid = body?.uuid;
  if (!uuid) return NextResponse.json({ error: 'Missing uuid' }, { status: 400 });

  // Supported updatable fields from the client
  const candidates = ['name', 'email', 'country', 'rights'];

  // Collect provided fields
  const provided: Record<string, any> = {};
  for (const k of candidates) {
    if (Object.prototype.hasOwnProperty.call(body, k) && body[k] !== undefined) provided[k] = body[k];
  }

  if (Object.keys(provided).length === 0) {
    return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });
  }

  try {
    // Probe information_schema to get all columns for the users table
    const colRes = await dbQuery('general', `
      SELECT column_name FROM information_schema.columns
      WHERE table_name = $1
    `, ['users']);

    const availableCols = (colRes.rows || []).map((r: any) => r.column_name);

    // Map client-provided keys to actual DB columns (handle iso3 vs country)
    const toUpdate: string[] = [];
    // track values in same order as toUpdate
    const values: any[] = [];

    // helper to push column+value
    const pushCol = (col: string, val: any) => {
      toUpdate.push(col);
      values.push(val);
    };

    for (const k of Object.keys(provided)) {
      if (k === 'country') {
        if (availableCols.includes('country')) {
          pushCol('country', provided[k]);
        } else if (availableCols.includes('iso3')) {
          // map client 'country' to DB 'iso3'
          pushCol('iso3', provided[k]);
        } else {
          // no country-like column available; skip
        }
      } else {
        if (availableCols.includes(k)) pushCol(k, provided[k]);
      }
    }

    if (toUpdate.length === 0) {
      return NextResponse.json({ error: 'No valid columns to update' }, { status: 400 });
    }

    // Enforce rights constraints: cannot set target rights higher than requester's rights
    if (toUpdate.includes('rights')) {
      const idx = toUpdate.indexOf('rights');
      const newRights = parseInt(String(values[idx]), 10);
      if (isNaN(newRights) || newRights < 0) return NextResponse.json({ error: 'Invalid rights value' }, { status: 400 });
      if (newRights > rights) return NextResponse.json({ error: 'Cannot grant rights higher than your own' }, { status: 403 });
      values[idx] = newRights;
    }

    // Build parameterized SET clause
    const setClauses: string[] = toUpdate.map((col, idx) => `${col} = $${idx + 1}`);

    // Add uuid as final parameter
    values.push(uuid);

    // Build safe RETURNING clause: only return columns that exist; alias iso3 AS country for client
    const returningCols: string[] = [];
    const want = ['uuid', 'name', 'email', 'rights', 'deleted', 'left_at'];
    for (const c of want) {
      if (availableCols.includes(c)) returningCols.push(c);
    }
    if (availableCols.includes('country')) {
      if (!returningCols.includes('country')) returningCols.push('country');
    } else if (availableCols.includes('iso3')) {
      // alias iso3 to country for client convenience
      returningCols.push('iso3 AS country');
    }

    const sql = `UPDATE users SET ${setClauses.join(', ')} WHERE uuid = $${values.length} RETURNING ${returningCols.join(', ')}`;

    const res = await dbQuery('general', sql, values);
    const updated = res.rows?.[0] ?? null;
    if (!updated) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // normalize response: ensure `country` field is present (may be iso3)
    if (updated.country === undefined && updated.iso3 !== undefined) {
      updated.country = updated.iso3;
      delete updated.iso3;
    }

    return NextResponse.json({ user: updated });
  } catch (e) {
    console.error('Update user error', e);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
