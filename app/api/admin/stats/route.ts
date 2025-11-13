import { NextResponse } from 'next/server';
import getSession from '@/app/lib/session';
import { query as dbQuery } from '@/app/lib/db';

function computeStartAndGroup(range?: string, year?: string) {
  const now = new Date();
  if (!range || range === '30d') return { start: new Date(Date.now() - 30 * 24 * 3600 * 1000), grp: 'day' };
  if (range === '6m') return { start: new Date(now.getFullYear(), now.getMonth() - 6, now.getDate()), grp: 'month' };
  if (range === '1y') return { start: new Date(Date.now() - 365 * 24 * 3600 * 1000), grp: 'month' };
  if (range === 'year' && year) {
    const y = Number(year);
    if (!Number.isNaN(y)) return { start: new Date(y, 0, 1), end: new Date(y + 1, 0, 1), grp: 'month' };
  }
  return { start: new Date(Date.now() - 30 * 24 * 3600 * 1000), grp: 'day' };
}

export async function GET(req: Request) {
  const session = await getSession();
  const rights = session?.rights || 0;
  if (!session || rights < 4) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(req.url);
  const contentRange = url.searchParams.get('contentRange') || '30d';
  const year = url.searchParams.get('year') || undefined;
  const { start, end, grp } = computeStartAndGroup(contentRange, year) as any;
  const grpSql = grp === 'month' ? 'month' : 'day';
  const startIso = start.toISOString();
  const endIso = (end && end.toISOString()) || null;

  try {
    // Users counts
    const totalUsersRes = await dbQuery('general', `SELECT COUNT(*)::int AS count FROM users`);
    const totalUsers = totalUsersRes.rows?.[0]?.count || 0;

    const newUsers30Res = await dbQuery('general', `SELECT COUNT(*)::int AS count FROM users WHERE created_at >= now() - interval '30 days'`);
    const newUsers30 = newUsers30Res.rows?.[0]?.count || 0;

    const usersByRightsRes = await dbQuery('general', `SELECT rights, COUNT(*)::int AS count FROM users GROUP BY rights ORDER BY rights DESC`);
    const usersByRights: Record<string, number> = {};
    (usersByRightsRes.rows || []).forEach((r: any) => { usersByRights[r.rights] = Number(r.count); });

    // Users timeseries (last 30 days)
    const timeseriesRes = await dbQuery('general', `
      SELECT to_char(date_trunc('day', created_at), 'YYYY-MM-DD') AS date, COUNT(*)::int AS count
      FROM users
      WHERE created_at >= now() - interval '30 days'
      GROUP BY date
      ORDER BY date
    `);
    const newUsersTimeseries = (timeseriesRes.rows || []).map((r: any) => ({ date: r.date, count: Number(r.count) }));

    // existing per-platform counts
    const solutions = { published: 0, preprint: 0, draft: 0 };
    const experiment = { published: 0, preprint: 0, draft: 0 };
    const learningplan = { published: 0, preprint: 0, draft: 0 };

    async function fetchCountsFromDB(dbKey: any, tableName = 'pads') {
      try {
        const r = await dbQuery(dbKey as any, `SELECT status, COUNT(*)::int AS count FROM ${tableName} GROUP BY status`);
        const out: any = { published: 0, preprint: 0, draft: 0 };
        (r.rows || []).forEach((row: any) => {
          const s = Number(row.status);
          if (s === 3) out.published += Number(row.count);
          else if (s === 2) out.preprint += Number(row.count);
          else out.draft += Number(row.count);
        });
        return out;
      } catch (e) {
        console.error('Error querying pads for', dbKey, e);
        return { published: 0, preprint: 0, draft: 0 };
      }
    }

    Object.assign(solutions, await fetchCountsFromDB('solutions', 'pads'));
    Object.assign(experiment, await fetchCountsFromDB('experiment', 'pads'));
    Object.assign(learningplan, await fetchCountsFromDB('learningplan', 'pads'));

    // Keep original blog/publication counts for compatibility
    let blogsCount = 0;
    let publicationsCount = 0;
    try {
      const b = await dbQuery('blogs', `SELECT COUNT(*)::int AS count FROM articles WHERE relevance >= 2 AND article_type = 'blog'`);
      blogsCount = b.rows?.[0]?.count || 0;
      const p = await dbQuery('blogs', `SELECT COUNT(*)::int AS count FROM articles WHERE relevance >= 2 AND article_type = 'publications'`);
      publicationsCount = p.rows?.[0]?.count || 0;
    } catch (e) {
      // non-fatal
      console.warn('Failed to fetch blogs/publications counts', e);
    }

    // Content timeseries across sources
    const sources = [
      { key: 'solutions', table: 'pads', label: 'Solutions' },
      { key: 'experiment', table: 'pads', label: 'Experiments' },
      { key: 'learningplan', table: 'pads', label: 'Learning Plans' },
      { key: 'blogs', table: 'articles', label: 'Blogs/Publications' },
    ];

    // map date -> { source: count }
    const dateMap: Record<string, Record<string, number>> = {};

    // helper: detect timestamp column name for a table in a DB by probing information_schema
    // accepts optional preferredNames array to check in order (used for blogs to prefer parsed_date/poste d_date/created_at)
    async function findTimestampColumn(dbKey: string, tableName: string, preferredNames?: string[]) {
      const defaultCandidates = ['created_at','created','created_on','createdAt','date','published_at','published','created_date','date_created','ts'];
      const candidates = (preferredNames && preferredNames.length) ? [...preferredNames, ...defaultCandidates.filter(c=>!preferredNames.includes(c))] : defaultCandidates;
      for (const c of candidates) {
        try {
          const q = `SELECT column_name FROM information_schema.columns WHERE table_name = $1 AND column_name = $2 LIMIT 1`;
          const r = await dbQuery(dbKey as any, q, [tableName, c]);
          if (r.rows && r.rows.length > 0) return c;
        } catch (e) {
          // ignore errors probing information_schema on some DBs
        }
      }
      return null;
    }

    for (const s of sources) {
      try {
        // prefer parsed_date, posted_date, created_at for blogs
        const tsCol = s.key === 'blogs' ? await findTimestampColumn(s.key, s.table, ['parsed_date','posted_date','created_at']) : await findTimestampColumn(s.key, s.table);
        if (!tsCol) {
          console.warn('No timestamp column found for', s.key, s.table, '- skipping timeseries');
          continue;
        }

        const dateTrunc = grpSql === 'month' ? `date_trunc('month', ${tsCol})` : `date_trunc('day', ${tsCol})`;
        let whereClause = `${dateTrunc} IS NOT NULL AND ${tsCol} >= $1`;
        let params: any[] = [startIso];
        if (endIso) {
          whereClause = `${dateTrunc} IS NOT NULL AND ${tsCol} >= $1 AND ${tsCol} < $2`;
          params = [startIso, endIso];
        }

        // For blogs/articles, only count high-relevance blog/publication types so they are grouped together
        let sql: string;
        if (s.key === 'blogs') {
          // filter by relevance and article_type
          if (endIso) {
            sql = `SELECT to_char(${dateTrunc}, 'YYYY-MM-DD') AS date, COUNT(*)::int AS count FROM ${s.table} WHERE ${tsCol} >= $1 AND ${tsCol} < $2 AND relevance >= 2 AND (article_type = 'blog' OR article_type = 'publications') GROUP BY date ORDER BY date`;
            params = [startIso, endIso];
          } else {
            sql = `SELECT to_char(${dateTrunc}, 'YYYY-MM-DD') AS date, COUNT(*)::int AS count FROM ${s.table} WHERE ${tsCol} >= $1 AND relevance >= 2 AND (article_type = 'blog' OR article_type = 'publications') GROUP BY date ORDER BY date`;
            params = [startIso];
          }
        } else {
          sql = `SELECT to_char(${dateTrunc}, 'YYYY-MM-DD') AS date, COUNT(*)::int AS count FROM ${s.table} WHERE ${whereClause} GROUP BY date ORDER BY date`;
        }

        const res = await dbQuery(s.key as any, sql, params);
        (res.rows || []).forEach((r: any) => {
          const d = r.date;
          if (!dateMap[d]) dateMap[d] = {};
          dateMap[d][s.key] = Number(r.count) || 0;
        });
      } catch (e) {
        console.warn('Failed to query content timeseries for', s.key, e);
      }
    }

    // build final timeseries array sorted by date
    const dates = Object.keys(dateMap).sort();
    const contentTimeseries = dates.map(d => {
      const obj: any = { date: d };
      for (const s of sources) obj[s.key] = dateMap[d][s.key] || 0;
      return obj;
    });

    return NextResponse.json({
      totalUsers,
      newUsers30d: newUsers30,
      usersByRights,
      newUsersTimeseries,
      solutions,
      experiment,
      learningplan,
      blogsCount,
      publicationsCount,
      contentTimeseries,
    });
  } catch (err) {
    console.error('Admin stats error', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
