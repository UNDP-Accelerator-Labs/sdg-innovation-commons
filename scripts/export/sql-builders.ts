/**
 * SQL query builders for export system
 */

import { hasColumn, hasTable, detectBlogContributorColumn, detectBlogContentColumn } from './database';

/**
 * Build SQL query for selecting blog/publication articles
 * @param dbKey Database key ('blogs')
 * @param allColumns Whether to select all columns or just export-relevant columns
 */
export async function buildBlogSelectSql(dbKey: string, allColumns = false): Promise<string> {
  // Prefer to use article_content and article_html_content tables when present to build a cleaned `full_text` field.
  const includeSlug = await hasColumn(dbKey, 'articles', 'slug');
  const contributorCol = await detectBlogContributorColumn(dbKey);
  const contentCol = await detectBlogContentColumn(dbKey);

  // Detect the presence of article_content/article_html_content tables
  const hasArticleContentTable = await hasTable(dbKey, 'article_content');
  const hasArticleHtmlTable = await hasTable(dbKey, 'article_html_content');

  const contributorSelect = contributorCol ? `a.${contributorCol} AS contributor,` : '';

  // Build list of available content expressions and corresponding JOINs
  const contentSources: string[] = [];
  const joins: string[] = [];
  if (hasArticleContentTable) {
    contentSources.push('b.content');
    joins.push('LEFT JOIN article_content b ON b.article_id = a.id');
  }
  if (hasArticleHtmlTable) {
    contentSources.push('c.html_content');
    joins.push('LEFT JOIN article_html_content c ON c.article_id = a.id');
  }
  if (contentCol) {
    contentSources.push(`a.${contentCol}`);
  }

  let contentExpr = '';
  if (contentSources.length) {
    // COALESCE only the available sources (avoids referencing missing aliases)
    contentExpr = `regexp_replace(regexp_replace(COALESCE(${contentSources.join(', ')}), E'\\n', ' ', 'g'), E'<iframe[^>]*>.*?</iframe>', '', 'gi') AS full_text,`;
  } else {
    contentExpr = `'' AS full_text,`;
  }

  if (allColumns) {
    // When selecting all columns, alias contributor and full_text when possible
    const contribAliasPart = contributorCol ? `, a.${contributorCol} AS contributor` : '';
    const contentAliasPart = contentCol ? `, a.${contentCol} AS full_text` : '';
    return `SELECT a.*, COALESCE(a.parsed_date, a.posted_date, a.created_at) AS chosen_date${contribAliasPart}${contentAliasPart}
            FROM articles a
            WHERE a.relevance >= 2
              AND (a.article_type = 'blog' OR a.article_type = 'publications')
              AND COALESCE(a.parsed_date, a.posted_date, a.created_at) >= '2018-01-01'
            ORDER BY chosen_date DESC`;
  }

  const joinClause = joins.length ? '\n' + joins.join('\n') : '';

  // Do not include slug in compact export; include cleaned full_text instead
  return `SELECT a.id, a.title, ${contentExpr} a.article_type, ${contributorSelect} COALESCE(a.parsed_date, a.posted_date, a.created_at) AS published_at, a.iso3
          FROM articles a
          ${joinClause}
          WHERE a.relevance >= 2
            AND (a.article_type = 'blog' OR a.article_type = 'publications')
            AND COALESCE(a.parsed_date, a.posted_date, a.created_at) >= '2018-01-01'
          ORDER BY published_at DESC`;
}

/**
 * Build SQL query for selecting pads (solutions, experiments, learning plans)
 * @param statusFilter Optional array of status values to filter by
 */
export async function buildPadsSelectSql(statusFilter: string[] | null): Promise<{ sql: string; params: any[] }> {
  if (statusFilter && statusFilter.length) {
    const sql = `SELECT p.id AS pad_id,
      p.owner AS contributor_id,
      p.title,
      p.date AS created_at,
      p.update_at AS updated_at,
      p.status,
      p.source AS source_pad_id,
      p.template,
      p.full_text,
      p.sections,
      COALESCE((SELECT jsonb_agg(jsonb_build_object('pad_id', t.pad, 'tag_id', t.tag_id, 'type', t.type)) FROM tagging t WHERE t.pad = p.id), '[]') AS tags,
      COALESCE((SELECT jsonb_agg(jsonb_build_object('pad_id', l.pad, 'lat', l.lat, 'lng', l.lng, 'iso3', l.iso3)) FROM locations l WHERE l.pad = p.id), '[]') AS locations,
      COALESCE((SELECT jsonb_agg(jsonb_build_object('pad_id', m.pad, 'type', m.type, 'name', m.name, 'key', m.key, 'value', m.value)) FROM metafields m WHERE m.pad = p.id), '[]') AS metafields,
      COALESCE((SELECT jsonb_agg(jsonb_build_object('pad_id', e.docid, 'type', e.type, 'count', (SELECT count(*) FROM engagement ee WHERE ee.docid = p.id AND ee.type = e.type))) FROM engagement e WHERE e.doctype = 'pad' AND e.docid = p.id), '[]') AS engagement,
      COALESCE((SELECT jsonb_agg(jsonb_build_object('pad_id', c.docid, 'message_id', c.message_id, 'response_to_message_id', c.response_to_message_id, 'user_id', c.user_id, 'date', c.date, 'message', c.message)) FROM (
        SELECT docid, id AS message_id, source AS response_to_message_id, contributor AS user_id, date, message
        FROM comments WHERE doctype = 'pad' AND docid = p.id ORDER BY id
      ) c), '[]') AS comments
    FROM pads p
    WHERE p.status = ANY($1)
      AND p.id NOT IN (SELECT review FROM reviews)
    ORDER BY p.id DESC`;
    return { sql, params: [statusFilter] };
  }

  const sql = `SELECT p.id AS pad_id,
      p.owner AS contributor_id,
      p.title,
      p.date AS created_at,
      p.update_at AS updated_at,
      p.status,
      p.source AS source_pad_id,
      p.template,
      p.full_text,
      p.sections,
      COALESCE((SELECT jsonb_agg(jsonb_build_object('pad_id', t.pad, 'tag_id', t.tag_id, 'type', t.type)) FROM tagging t WHERE t.pad = p.id), '[]') AS tags,
      COALESCE((SELECT jsonb_agg(jsonb_build_object('pad_id', l.pad, 'lat', l.lat, 'lng', l.lng, 'iso3', l.iso3)) FROM locations l WHERE l.pad = p.id), '[]') AS locations,
      COALESCE((SELECT jsonb_agg(jsonb_build_object('pad_id', m.pad, 'type', m.type, 'name', m.name, 'key', m.key, 'value', m.value)) FROM metafields m WHERE m.pad = p.id), '[]') AS metafields,
      COALESCE((SELECT jsonb_agg(jsonb_build_object('pad_id', e.docid, 'type', e.type, 'count', (SELECT count(*) FROM engagement ee WHERE ee.docid = p.id AND ee.type = e.type))) FROM engagement e WHERE e.doctype = 'pad' AND e.docid = p.id), '[]') AS engagement,
      COALESCE((SELECT jsonb_agg(jsonb_build_object('pad_id', c.docid, 'message_id', c.message_id, 'response_to_message_id', c.response_to_message_id, 'user_id', c.user_id, 'date', c.date, 'message', c.message)) FROM (
        SELECT docid, id AS message_id, source AS response_to_message_id, contributor AS user_id, date, message
        FROM comments WHERE doctype = 'pad' AND docid = p.id ORDER BY id
      ) c), '[]') AS comments
    FROM pads p
    WHERE p.id NOT IN (SELECT review FROM reviews)
    ORDER BY p.id DESC`;
  return { sql, params: [] };
}
