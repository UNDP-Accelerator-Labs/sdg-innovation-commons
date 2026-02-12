/**
 * CSV and JSON Export Module
 * 
 * Handles generation and upload of CSV and JSON format exports
 * with streaming, enrichment, PII scrubbing, and Azure upload.
 */

import { PassThrough } from 'node:stream';
import {
  sleep,
  scrubPII,
  mapDataType,
  uploadStreamToAzure,
  enrichUserCached,
  fetchAdm0Map,
  streamQueryToHandler,
  fetchPadRelatedMaps,
  buildBlogSelectSql,
  buildPadsSelectSql
} from './index';

/**
 * Upload CSV or JSON export for a given key with retry logic
 * 
 * Streams data from database, enriches with user/country/tag info,
 * formats as CSV or JSON, and uploads to Azure Blob Storage.
 * 
 * Features:
 * - CSV: Header row generation, PII scrubbing, metadata formatting
 * - JSON: Array format with enriched objects
 * - Tag/template/source pad title resolution
 * - Country name enrichment via adm0Map
 * - PII scrubbing and UUID exclusion options
 * - Automatic retry with exponential backoff
 * 
 * @param job - Export job configuration
 * @param key - Data type key (blogs, solutions, experiment, learningplan)
 * @param format - Export format ('csv' or 'json')
 * @param maxRetries - Maximum retry attempts (default: 3)
 * @returns Azure blob URL of uploaded file
 */
export async function uploadKeyStreamWithRetries(
  job: any,
  key: string,
  format: string,
  maxRetries = 3
): Promise<string> {
  const destName = `export-${job.id}-${key}.${format === 'csv' ? 'csv' : 'json'}`;
  let attempt = 0;
  let lastErr: any = null;
  console.log(job);

  while (attempt < maxRetries) {
    attempt += 1;
    const pass = new PassThrough();
    const contentType = format === 'csv' ? 'text/csv' : 'application/json';
    const uploadPromise = uploadStreamToAzure(pass as any, destName, contentType);

    try {
      const adm0Map = await fetchAdm0Map();
      const { tagMap, templateMap, sourcePadMap } = await fetchPadRelatedMaps();
      const excludePii_csv = !!job.params?.exclude_pii;
      const excludeOwnerUuid_csv = !!job.params?.exclude_owner_uuid;
      const statusFilter: string[] | null = Array.isArray(job.statuses) && job.statuses.length
        ? job.statuses
        : null;

      let includeName_csv = job?.params?.include_name ?? job?.include_name ?? true;
      let includeEmail_csv = job?.params?.include_email ?? job?.include_email ?? false;
      let includeUuid_csv = job?.params?.include_uuid ?? job?.include_uuid ?? false;
      const includeAll_csv = job?.params?.include_all ?? job?.include_all ?? false;
      let effectiveIncludeName_csv = includeAll_csv ? true : !!includeName_csv;
      let effectiveIncludeEmail_csv = includeAll_csv ? true : !!includeEmail_csv;
      let effectiveIncludeUuid_csv = includeAll_csv ? true : !!includeUuid_csv;
      const includePiiOverride_csv = job?.params?.include_pii;
      if (typeof includePiiOverride_csv === 'boolean') {
        effectiveIncludeName_csv = includePiiOverride_csv;
        effectiveIncludeEmail_csv = includePiiOverride_csv;
        effectiveIncludeUuid_csv = includePiiOverride_csv;
      }
      if (excludePii_csv) {
        effectiveIncludeName_csv = false;
        effectiveIncludeEmail_csv = false;
        effectiveIncludeUuid_csv = false;
      }

      if (format === 'csv') {
        await handleCsvExport(
          pass,
          job,
          key,
          adm0Map,
          tagMap,
          templateMap,
          sourcePadMap,
          statusFilter,
          excludePii_csv,
          excludeOwnerUuid_csv,
          effectiveIncludeName_csv,
          effectiveIncludeEmail_csv,
          effectiveIncludeUuid_csv
        );
      } else {
        await handleJsonExport(
          pass,
          job,
          key,
          adm0Map,
          tagMap,
          templateMap,
          sourcePadMap,
          excludePii_csv,
          excludeOwnerUuid_csv,
          effectiveIncludeName_csv,
          effectiveIncludeEmail_csv,
          effectiveIncludeUuid_csv
        );
      }

      const url = await uploadPromise;
      return url;
    } catch (e) {
      lastErr = e;
      console.warn(
        `Upload attempt ${attempt} for ${key} failed, retrying`,
        String((e as any)?.message || e)
      );
      await sleep(500 * attempt);
      continue;
    }
  }
  throw lastErr || new Error(`Upload failed for ${key}`);
}

/**
 * Handle CSV export generation
 */
async function handleCsvExport(
  pass: PassThrough,
  job: any,
  key: string,
  adm0Map: Map<string, string>,
  tagMap: Record<string, string> | null,
  templateMap: Record<string, any> | null,
  sourcePadMap: Record<string, string> | null,
  statusFilter: string[] | null,
  excludePii: boolean,
  excludeOwnerUuid: boolean,
  includeName: boolean,
  includeEmail: boolean,
  includeUuid: boolean
): Promise<void> {
  let headerWritten = false;
  let header: string[] | null = null;

  // Metadata flags
  const includeTags = job?.params?.include_tags ?? true;
  const includeLocations = job?.params?.include_locations ?? true;
  const includeMetafields = job?.params?.include_metafields ?? true;
  const includeEngagement = job?.params?.include_engagement ?? true;
  const includeComments = job?.params?.include_comments ?? true;
  const includeAnyMetadata = includeTags || includeLocations || includeMetafields || includeEngagement || includeComments;

  // Build SQL query
  let sql: string;
  let params: any[] = [];
  if (['solutions', 'experiment', 'learningplan'].includes(key) && statusFilter) {
    // For pads, use include_pii logic (inverse of excludePii) to determine if we want original or redacted data
    const includePii = !excludePii;
    const { sql: builtSql, params: builtParams } = await buildPadsSelectSql(statusFilter, includePii);
    sql = builtSql;
    params = builtParams;
  } else {
    sql = key === 'blogs' ? await buildBlogSelectSql(key, false) : `SELECT * FROM pads`;
  }

  await streamQueryToHandler(key, sql, params, async (r: any) => {
    const enriched = await enrichRow(
      r,
      key,
      adm0Map,
      tagMap,
      templateMap,
      sourcePadMap,
      excludePii,
      excludeOwnerUuid,
      includeName,
      includeEmail,
      includeUuid,
      includeTags,
      includeLocations,
      includeMetafields,
      includeEngagement,
      includeComments
    );

    if (!headerWritten) {
      // Build header excluding disabled columns
      header = Object.keys(enriched).filter((k) => {
        const lk = k.toLowerCase();
        if (excludePii && (lk.includes('name') || lk.includes('email') || lk === 'owner_name' || lk === 'contributor_name' || lk === 'owner_email' || lk === 'contributor_email')) return false;
        if (excludeOwnerUuid && (lk === 'owner_uuid' || lk === 'owner' || lk === 'contributor' || lk === 'contributor_id' || lk === 'contributor_uuid' || lk === 'user_uuid')) return false;
        if (excludePii && lk.includes('country')) return false;
        if (!includeTags && (lk === 'tags' || lk === 'tag' || lk === 'tag_list')) return false;
        if (!includeLocations && (lk === 'locations' || lk === 'location')) return false;
        if (!includeMetafields && lk === 'metafields') return false;
        if (!includeEngagement && lk === 'engagement') return false;
        if (!includeComments && lk === 'comments') return false;
        if (!includeAnyMetadata && lk === 'sections') return false;
        return true;
      });
      pass.write(header.join(',') + '\n');
      headerWritten = true;
    }

    // Ensure PII/UUID exclusion for row output
    if (excludeOwnerUuid) {
      delete enriched.owner;
      delete enriched.owner_uuid;
      delete enriched.owner_id;
      delete enriched.contributor;
      delete enriched.contributor_id;
      delete enriched.contributor_uuid;
      delete enriched.user_uuid;
      delete enriched.user_id;
    }
    if (excludePii) {
      for (const hh of Object.keys(enriched)) {
        if (typeof enriched[hh] === 'string') enriched[hh] = scrubPII(enriched[hh], true);
      }
    }

    // Write CSV row
    const row = header!.map((h: string) => enriched[h] ?? '');
    pass.write(
      row
        .map((v: any) =>
          typeof v === 'string' ? `"${String(v).replace(/"/g, '""')}"` : String(v)
        )
        .join(',') + '\n'
    );
  });

  pass.end();
}

/**
 * Handle JSON export generation
 */
async function handleJsonExport(
  pass: PassThrough,
  job: any,
  key: string,
  adm0Map: Map<string, string>,
  tagMap: Record<string, string> | null,
  templateMap: Record<string, any> | null,
  sourcePadMap: Record<string, string> | null,
  excludePii: boolean,
  excludeOwnerUuid: boolean,
  includeName: boolean,
  includeEmail: boolean,
  includeUuid: boolean
): Promise<void> {
  pass.write('[');
  let first = true;

  // Metadata flags
  const includeTags = job?.params?.include_tags ?? true;
  const includeLocations = job?.params?.include_locations ?? true;
  const includeMetafields = job?.params?.include_metafields ?? true;
  const includeEngagement = job?.params?.include_engagement ?? true;
  const includeComments = job?.params?.include_comments ?? true;

  const sql = key === 'blogs' ? await buildBlogSelectSql(key, false) : `SELECT * FROM pads`;

  await streamQueryToHandler(key, sql, [], async (r: any) => {
    const enriched = await enrichRow(
      r,
      key,
      adm0Map,
      tagMap,
      templateMap,
      sourcePadMap,
      excludePii,
      excludeOwnerUuid,
      includeName,
      includeEmail,
      includeUuid,
      includeTags,
      includeLocations,
      includeMetafields,
      includeEngagement,
      includeComments
    );

    const chunk = JSON.stringify(enriched);
    if (!first) pass.write(',\n');
    pass.write(chunk);
    first = false;
  });

  pass.write(']');
  pass.end();
}

/**
 * Enrich a database row with user info, country, tags, and metadata
 */
async function enrichRow(
  r: any,
  key: string,
  adm0Map: Map<string, string>,
  tagMap: Record<string, string> | null,
  templateMap: Record<string, any> | null,
  sourcePadMap: Record<string, string> | null,
  excludePii: boolean,
  excludeOwnerUuid: boolean,
  includeName: boolean,
  includeEmail: boolean,
  includeUuid: boolean,
  includeTags: boolean,
  includeLocations: boolean,
  includeMetafields: boolean,
  includeEngagement: boolean,
  includeComments: boolean
): Promise<any> {
  const resolvedOwnerId =
    r.contributor ?? r.owner ?? r.owner_uuid ?? r.user_uuid ?? r.contributor_id ?? r.owner_id ?? null;
  const user = await enrichUserCached(resolvedOwnerId);
  const countryName =
    (user?.iso3 && adm0Map.get(user.iso3?.toLowerCase())) || user?.iso3 || r.iso3 || '';

  // Build enriched object
  const enriched: any = Object.assign({}, r);
  enriched.data_type = mapDataType(key, r);

  // Add user info fields when allowed
  if (!excludePii && includeName) {
    enriched.owner_name = user?.name ?? '';
    enriched.contributor_name = user?.name ?? '';
  }
  if (!excludePii && includeEmail) {
    enriched.owner_email = user?.email ?? '';
    enriched.contributor_email = user?.email ?? '';
  }
  if (includeUuid && !excludeOwnerUuid) {
    enriched.owner_uuid = resolvedOwnerId ?? '';
    enriched.contributor_uuid = resolvedOwnerId ?? '';
  }

  // Country is PII: exclude for blogs and when PII excluded
  if (!excludePii && key !== 'blogs') {
    enriched.contributor_country = countryName;
    enriched.owner_country = countryName;
  }

  // Remove owner/contributor fields when UUID exclusion requested
  if (excludeOwnerUuid) {
    delete enriched.owner;
    delete enriched.owner_uuid;
    delete enriched.owner_id;
    delete enriched.contributor;
    delete enriched.contributor_id;
    delete enriched.contributor_uuid;
    delete enriched.user_uuid;
    delete enriched.user_id;
  }

  // Parse metadata arrays
  const tags = parseJsonArray(r.tags);
  const locations = parseJsonArray(r.locations);
  const metafields = parseJsonArray(r.metafields);
  const engagement = parseJsonArray(r.engagement);
  const comments = parseJsonArray(r.comments);

  // Format and add metadata fields
  if (includeTags) {
    enriched.tags = formatTagsResolved(tags, tagMap);
  } else {
    delete enriched.tags;
  }

  if (includeLocations) {
    enriched.locations = formatLocations(locations);
  } else {
    delete enriched.locations;
  }

  if (includeMetafields) {
    enriched.metafields = formatMeta(metafields);
  } else {
    delete enriched.metafields;
  }

  if (includeEngagement) {
    enriched.engagement = formatEng(engagement);
  } else {
    delete enriched.engagement;
  }

  if (includeComments) {
    enriched.comments = formatComments(comments);
  } else {
    delete enriched.comments;
  }

  // Add resolved template/source titles
  try {
    const tplId = r.template ?? r.template_id ?? r.templateId ?? null;
    const srcId = r.source_pad_id ?? r.source ?? r.source_id ?? r.sourcePadId ?? null;
    if (tplId) {
      enriched.template_title =
        templateMap && templateMap[String(tplId)] ? templateMap[String(tplId)].title : '';
    }
    if (srcId) {
      enriched.source_pad_title =
        sourcePadMap && sourcePadMap[String(srcId)] ? sourcePadMap[String(srcId)] : '';
    }
  } catch (e) {
    /* ignore resolution errors */
  }

  // Scrub PII in free-text fields
  if (excludePii) {
    // Get record ID for logging (testing purpose)
    const recordId = r.pad_id ?? r.id ?? r.blog_id ?? 'unknown';
    
    // Scrub all string and stringified fields that might contain PII
    if (typeof enriched.full_text === 'string') {
      enriched.full_text = scrubPII(enriched.full_text, true, recordId);
    }
    if (typeof enriched.title === 'string') {
      enriched.title = scrubPII(enriched.title, true, recordId);
    }
    if (typeof enriched.sections === 'string') {
      enriched.sections = scrubPII(enriched.sections, true, recordId);
    }
    if (typeof enriched.tags === 'string') {
      enriched.tags = scrubPII(enriched.tags, true, recordId);
    }
    if (typeof enriched.locations === 'string') {
      enriched.locations = scrubPII(enriched.locations, true, recordId);
    }
    if (typeof enriched.metafields === 'string') {
      enriched.metafields = scrubPII(enriched.metafields, true, recordId);
    }
    if (typeof enriched.comments === 'string') {
      enriched.comments = scrubPII(enriched.comments, true, recordId);
    }
    // Scrub any description or content fields
    if (typeof enriched.description === 'string') {
      enriched.description = scrubPII(enriched.description, true, recordId);
    }
    if (typeof enriched.content === 'string') {
      enriched.content = scrubPII(enriched.content, true, recordId);
    }
  }

  return enriched;
}

/**
 * Helper: Parse JSON array from string or return existing array
 */
function parseJsonArray(value: any): any[] {
  if (Array.isArray(value)) return value;
  try {
    return JSON.parse(value || '[]');
  } catch (e) {
    return [];
  }
}

/**
 * Helper: Format tags with resolution using tagMap
 */
function formatTagsResolved(arr: any[], tagMap: Record<string, string> | null): string {
  return arr
    .map((t: any) => {
      if (!t) return '';
      const rawTag = t.tag ?? t.tag_id ?? t.type ?? null;
      if (rawTag == null) return JSON.stringify(t);
      const key = String(rawTag);
      if (tagMap && tagMap[key]) return tagMap[key];
      return String(rawTag);
    })
    .filter(Boolean)
    .join('; ');
}

/**
 * Helper: Format locations
 */
function formatLocations(arr: any[]): string {
  return arr
    .map((l: any) =>
      l ? `${l.lat ?? ''},${l.lng ?? ''}${l.iso3 ? ` (${l.iso3})` : ''}` : ''
    )
    .join('; ');
}

/**
 * Helper: Format metafields
 */
function formatMeta(arr: any[]): string {
  return arr
    .map((m: any) =>
      m ? `${m.name ?? m.key ?? ''}:${m.value ?? m['value'] ?? JSON.stringify(m)}` : ''
    )
    .join('; ');
}

/**
 * Helper: Format engagement
 */
function formatEng(arr: any[]): string {
  return arr
    .map((e: any) =>
      e ? `${e.type ?? ''}:${e.count ?? e['count'] ?? JSON.stringify(e)}` : ''
    )
    .join('; ');
}

/**
 * Helper: Format comments
 */
function formatComments(arr: any[]): string {
  return arr
    .map((c: any) =>
      c
        ? `${c.user_id ?? c.contributor ?? ''}:${String(c.message ?? '')
            .replace(/\s+/g, ' ')
            .slice(0, 120)}`
        : ''
    )
    .join(' || ');
}
