/**
 * XLSX export functionality
 * Handles streaming XLSX generation with ExcelJS and Azure Blob Storage upload
 */

import { PassThrough } from 'stream';
import {
  sleep,
  scrubPII,
  mapCategoryForDb,
  mapDataType,
  uploadStreamToAzure,
  enrichUserCached,
  fetchAdm0Map,
  streamQueryToHandler,
  buildExportNotes,
  fetchPadRelatedMaps,
  buildBlogSelectSql,
  buildPadsSelectSql,
} from './';

// Try to require exceljs dynamically
let ExcelJS: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  ExcelJS = require('exceljs');
} catch (e) {
  ExcelJS = null;
  console.warn('exceljs not installed — XLSX export will fall back to CSV/JSON');
}

/**
 * Upload XLSX export with automatic retry logic
 * Streams data directly to Azure Blob Storage using ExcelJS streaming writer
 */
export async function uploadXlsxWithRetries(job: any, maxRetries = 3): Promise<{ blobUrl: string; outFiles: any[] }> {
  if (!ExcelJS) {
    throw new Error('ExcelJS is not installed - cannot generate XLSX exports');
  }

  const destName = `export-${job.id}.xlsx`;
  let attempt = 0;
  let lastErr: any = null;

  while (attempt < maxRetries) {
    attempt += 1;
    const pass = new PassThrough();
    const uploadPromise = uploadStreamToAzure(
      pass as any,
      destName,
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );

    try {
      // Stream data into workbook which writes into the PassThrough
      const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({ stream: pass });
      const dbKeys: string[] = job.db_keys || [];
      const adm0Map = await fetchAdm0Map();
      const { tagMap, templateMap, sourcePadMap } = await fetchPadRelatedMaps();
      const excludePii = !!job.exclude_pii;
      const excludeOwnerUuid = !!job.exclude_owner_uuid;
      const statusFilter: string[] | null =
        Array.isArray(job.statuses) && job.statuses.length ? job.statuses : null;

      let includeName = job?.params?.include_name ?? job?.include_name ?? true;
      let includeEmail = job?.params?.include_email ?? job?.include_email ?? false;
      let includeUuid = job?.params?.include_uuid ?? job?.include_uuid ?? false;
      const includeAll = job?.params?.include_all ?? job?.include_all ?? false;
      let effectiveIncludeName = includeAll ? true : !!includeName;
      let effectiveIncludeEmail = includeAll ? true : !!includeEmail;
      let effectiveIncludeUuid = includeAll ? true : !!includeUuid;
      const includePiiOverride = job?.params?.include_pii;
      if (typeof includePiiOverride === 'boolean') {
        effectiveIncludeName = includePiiOverride;
        effectiveIncludeEmail = includePiiOverride;
        effectiveIncludeUuid = includePiiOverride;
      }
      if (job?.exclude_pii) {
        effectiveIncludeName = false;
        effectiveIncludeEmail = false;
        effectiveIncludeUuid = false;
      }

      for (const key of dbKeys) {
        // Use group-based sheet names so experiments+learningplans end up in the same sheet
        const group = mapCategoryForDb(key); // 'what-we-see' | 'what-we-test' | 'what-we-learn'
        const sheetName = `${group}`.slice(0, 31);
        // Maintain worksheet reuse across keys that map to the same group
        if (!workbook.__sheetMap) workbook.__sheetMap = {} as any;
        if (!workbook.__sheetMap[sheetName]) {
          workbook.__sheetMap[sheetName] = {
            ws: workbook.addWorksheet(sheetName),
            columnsWritten: false,
          };
        }
        const sheetEntry = workbook.__sheetMap[sheetName];
        let columnsWritten = sheetEntry.columnsWritten;
        const ws = sheetEntry.ws;

        try {
          if (key === 'blogs') {
            // For blogs/publications: force-disable contributor and metadata datapoints
            const forBlogsForceDisableMetadata = true;
            const includeTags = forBlogsForceDisableMetadata ? false : (job?.params?.include_tags ?? true);
            const includeLocations = forBlogsForceDisableMetadata
              ? false
              : (job?.params?.include_locations ?? true);
            const includeMetafields = forBlogsForceDisableMetadata
              ? false
              : (job?.params?.include_metafields ?? true);
            const includeEngagement = forBlogsForceDisableMetadata
              ? false
              : (job?.params?.include_engagement ?? true);
            const includeComments = forBlogsForceDisableMetadata
              ? false
              : (job?.params?.include_comments ?? true);
            // For blog exports we do not expose contributor PII or UUIDs even if requested
            const blogEffectiveIncludeUuid = false;
            const blogEffectiveIncludeName = false;
            const blogEffectiveIncludeEmail = false;
            const includeCountry =
              !excludePii &&
              (blogEffectiveIncludeName || blogEffectiveIncludeEmail || blogEffectiveIncludeUuid);

            const sql = await buildBlogSelectSql('blogs', false);
            await streamQueryToHandler('blogs', sql, [], async (r: any) => {
              if (!columnsWritten) {
                const header: string[] = [
                  'id',
                  'title',
                  'full_text',
                  'article_type',
                  'data_type',
                  'published_at',
                  'iso3',
                ];
                if (blogEffectiveIncludeUuid && !excludeOwnerUuid) header.push('contributor_uuid');
                if (!excludePii && blogEffectiveIncludeName) header.push('contributor_name');
                if (!excludePii && blogEffectiveIncludeEmail) header.push('contributor_email');
                if (includeCountry) header.push('contributor_country');
                if (includeTags) header.push('tags');
                if (includeLocations) header.push('locations');
                if (includeMetafields) header.push('metafields');
                if (includeEngagement) header.push('engagement');
                if (includeComments) header.push('comments');

                ws.addRow(header).commit();

                // Set wrapText for the full_text column
                try {
                  const fullTextColIndex = header.indexOf('full_text') + 1; // 1-based
                  const col = ws.getColumn(fullTextColIndex);
                  col.width = Math.max(
                    40,
                    Math.min(
                      120,
                      Math.floor(
                        process.env.EXPORT_FULLTEXT_COL_WIDTH
                          ? Number(process.env.EXPORT_FULLTEXT_COL_WIDTH)
                          : 80
                      )
                    )
                  );
                  col.alignment = { wrapText: true, vertical: 'top' };
                } catch (e) {
                  /* ignore styling errors in streaming writer */
                }

                columnsWritten = true;
                sheetEntry.columnsWritten = true;
              }

              const user = await enrichUserCached(r.contributor);
              const dataType = mapDataType('blogs', r);
              const contributorUuidVal = blogEffectiveIncludeUuid ? r.contributor || '' : '';
              const contributorNameVal =
                !excludePii && blogEffectiveIncludeName ? user?.name || '' : '';
              const contributorEmailVal =
                !excludePii && blogEffectiveIncludeEmail ? user?.email || '' : '';

              let fullTextVal = (r.full_text ||
                r.content ||
                r.html_content ||
                r.body ||
                r.text ||
                '') as string;
              fullTextVal = scrubPII(fullTextVal, excludePii, r.id) as string;

              // Scrub title as well since it may contain PII
              const titleVal = scrubPII(r.title, excludePii, r.id);

              const rowVals: any[] = [
                r.id,
                titleVal,
                fullTextVal,
                r.article_type,
                dataType,
                r.published_at,
                r.iso3,
              ];
              if (blogEffectiveIncludeUuid && !excludeOwnerUuid) rowVals.push(contributorUuidVal);
              if (!excludePii && blogEffectiveIncludeName) rowVals.push(contributorNameVal);
              if (!excludePii && blogEffectiveIncludeEmail) rowVals.push(contributorEmailVal);
              if (includeCountry) rowVals.push(''); // blogs do not expose contributor country

              ws.addRow(rowVals).commit();
            });
          } else if (['solutions', 'experiment', 'learningplan'].includes(key)) {
            // Build pads query with optional status filter
            const { sql, params } = await buildPadsSelectSql(statusFilter);

            await streamQueryToHandler(key, sql, params, async (r: any) => {
              const includeCountry =
                !excludePii &&
                (effectiveIncludeName || effectiveIncludeEmail || effectiveIncludeUuid);
              if (!columnsWritten) {
                const baseHeader: string[] = ['pad_id', 'title', 'data_type'];
                if (effectiveIncludeUuid && !excludeOwnerUuid) baseHeader.push('owner_uuid');
                if (!excludePii && effectiveIncludeName) baseHeader.push('owner_name');
                if (!excludePii && effectiveIncludeEmail) baseHeader.push('owner_email');
                if (includeCountry) baseHeader.push('owner_country');
                baseHeader.push(
                  'status',
                  'created_at',
                  'updated_at',
                  'source_pad_id',
                  'source_pad_title',
                  'template',
                  'template_title',
                  'full_text'
                );

                const includeTags = job?.params?.include_tags ?? true;
                const includeLocations = job?.params?.include_locations ?? true;
                const includeMetafields = job?.params?.include_metafields ?? true;
                const includeEngagement = job?.params?.include_engagement ?? true;
                const includeComments = job?.params?.include_comments ?? true;
                const includeAnyMetadata =
                  includeTags ||
                  includeLocations ||
                  includeMetafields ||
                  includeEngagement ||
                  includeComments;
                if (includeMetafields) baseHeader.push('sections');
                if (includeTags) baseHeader.push('tags');
                if (includeLocations) baseHeader.push('locations');
                if (includeMetafields) baseHeader.push('metafields');
                if (includeEngagement) baseHeader.push('engagement');
                if (includeComments) baseHeader.push('comments');

                ws.addRow(baseHeader).commit();
                columnsWritten = true;
                sheetEntry.columnsWritten = true;
              }

              const pad_id = r.pad_id ?? null;
              const dataType = mapDataType(key, r);
              let owner_uuid = effectiveIncludeUuid ? r.contributor_id ?? null : '';
              const title = scrubPII(r.title ?? '', excludePii, pad_id);
              const status = r.status ?? '';
              const created_at = r.created_at ?? null;
              const updated_at = r.updated_at ?? null;
              const source_pad_id = r.source_pad_id ?? null;
              const template = r.template ?? null;
              let full_text = r.full_text ?? null;
              const sections = r.sections ?? null;

              const tags = Array.isArray(r.tags)
                ? r.tags
                : (() => {
                    try {
                      return JSON.parse(r.tags || '[]');
                    } catch (e) {
                      return [];
                    }
                  })();
              const locations = Array.isArray(r.locations)
                ? r.locations
                : (() => {
                    try {
                      return JSON.parse(r.locations || '[]');
                    } catch (e) {
                      return [];
                    }
                  })();
              const metafields = Array.isArray(r.metafields)
                ? r.metafields
                : (() => {
                    try {
                      return JSON.parse(r.metafields || '[]');
                    } catch (e) {
                      return [];
                    }
                  })();
              const engagement = Array.isArray(r.engagement)
                ? r.engagement
                : (() => {
                    try {
                      return JSON.parse(r.engagement || '[]');
                    } catch (e) {
                      return [];
                    }
                  })();
              const comments = Array.isArray(r.comments)
                ? r.comments
                : (() => {
                    try {
                      return JSON.parse(r.comments || '[]');
                    } catch (e) {
                      return [];
                    }
                  })();

              const user = await enrichUserCached(owner_uuid);
              const countryName =
                (user?.iso3 && adm0Map.get(user.iso3?.toLowerCase())) || user?.iso3 || '';
              const name = !excludePii && effectiveIncludeName ? user?.name || '' : '';
              const email = !excludePii && effectiveIncludeEmail ? user?.email || '' : '';

              const formatTags = (arr: any[]) =>
                arr
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
              const formatLocations = (arr: any[]) =>
                arr
                  .map((l: any) =>
                    l ? `${l.lat ?? ''},${l.lng ?? ''}${l.iso3 ? ` (${l.iso3})` : ''}` : ''
                  )
                  .join('; ');
              const formatMeta = (arr: any[]) =>
                arr
                  .map((m: any) =>
                    m
                      ? `${m.name ?? m.key ?? ''}:${m.value ?? m['value'] ?? JSON.stringify(m)}`
                      : ''
                  )
                  .join('; ');
              const formatEng = (arr: any[]) =>
                arr
                  .map((e: any) =>
                    e ? `${e.type ?? ''}:${e.count ?? e['count'] ?? JSON.stringify(e)}` : ''
                  )
                  .join('; ');
              const formatComments = (arr: any[]) =>
                arr
                  .map((c: any) =>
                    c
                      ? `${c.user_id ?? c.contributor ?? ''}:${String(c.message ?? '')
                          .replace(/\s+/g, ' ')
                          .slice(0, 120)}`
                      : ''
                  )
                  .join(' || ');

              const includeTags = job?.params?.include_tags ?? true;
              const includeLocations = job?.params?.include_locations ?? true;
              const includeMetafields = job?.params?.include_metafields ?? true;
              const includeEngagement = job?.params?.include_engagement ?? true;
              const includeComments = job?.params?.include_comments ?? true;
              const includeAnyMetadata =
                includeTags ||
                includeLocations ||
                includeMetafields ||
                includeEngagement ||
                includeComments;

              const tagsStr = includeTags ? formatTags(tags) : '';
              const locStr = includeLocations ? formatLocations(locations) : '';
              const mfStr = includeMetafields ? formatMeta(metafields) : '';
              const egStr = includeEngagement ? formatEng(engagement) : '';
              const cmStr = includeComments ? formatComments(comments) : '';

              const sourceTitle =
                sourcePadMap && source_pad_id ? sourcePadMap[String(source_pad_id)] || '' : '';
              const templateTitle =
                templateMap && template ? templateMap[String(template)]?.title || '' : '';

              const rowArr: any[] = [pad_id, title, dataType];
              if (effectiveIncludeUuid && !excludeOwnerUuid) rowArr.push(owner_uuid);
              if (!excludePii && effectiveIncludeName) rowArr.push(name);
              if (!excludePii && effectiveIncludeEmail) rowArr.push(email);
              if (includeCountry) rowArr.push(countryName);
              rowArr.push(
                status,
                created_at,
                updated_at,
                source_pad_id,
                sourceTitle,
                template,
                templateTitle
              );
              rowArr.push(scrubPII(full_text, excludePii, pad_id));
              if (includeAnyMetadata) rowArr.push(scrubPII(sections, excludePii, pad_id));
              if (includeTags) rowArr.push(tagsStr);
              if (includeLocations) rowArr.push(locStr);
              if (includeMetafields) rowArr.push(mfStr);
              if (includeEngagement) rowArr.push(egStr);
              if (includeComments) rowArr.push(cmStr);
              ws.addRow(rowArr).commit();
            });
          } else {
            // Fallback sheets
            const sql = key === 'blogs' ? await buildBlogSelectSql('blogs', true) : `SELECT * FROM pads`;
            let header: string[] | null = null;
            const includeTags = job?.params?.include_tags ?? true;
            const includeLocations = job?.params?.include_locations ?? true;
            const includeMetafields = job?.params?.include_metafields ?? true;
            const includeEngagement = job?.params?.include_engagement ?? true;
            const includeComments = job?.params?.include_comments ?? true;
            const includeAnyMetadata =
              includeTags || includeLocations || includeMetafields || includeEngagement || includeComments;

            await streamQueryToHandler(key, sql, [], async (r: any) => {
              if (!columnsWritten) {
                header = Object.keys(r).filter((k: string) => {
                  const lk = k.toLowerCase();
                  if (
                    excludePii &&
                    (lk.includes('name') || lk.includes('email') || lk.includes('country'))
                  )
                    return false;
                  if (
                    excludeOwnerUuid &&
                    (lk === 'owner_uuid' ||
                      lk === 'owner' ||
                      lk === 'contributor' ||
                      lk === 'contributor_id' ||
                      lk === 'contributor_uuid' ||
                      lk === 'user_uuid')
                  )
                    return false;
                  if (!includeTags && (lk === 'tags' || lk === 'tag' || lk === 'tag_list'))
                    return false;
                  if (!includeLocations && (lk === 'locations' || lk === 'location')) return false;
                  if (!includeMetafields && lk === 'metafields') return false;
                  if (!includeEngagement && lk === 'engagement') return false;
                  if (!includeComments && lk === 'comments') return false;
                  if (!includeAnyMetadata && lk === 'sections') return false;
                  return true;
                });
                ws.addRow(header).commit();
                columnsWritten = true;
                sheetEntry.columnsWritten = true;
              }

              const vals = header!.map((h) => {
                let v = r[h];
                const lk = String(h).toLowerCase();
                if (!includeTags && (lk === 'tags' || lk === 'tag' || lk === 'tag_list')) return '';
                if (!includeLocations && (lk === 'locations' || lk === 'location')) return '';
                if (!includeMetafields && lk === 'metafields') return '';
                if (!includeEngagement && lk === 'engagement') return '';
                if (!includeComments && lk === 'comments') return '';
                if (
                  excludeOwnerUuid &&
                  (lk === 'owner_uuid' ||
                    lk === 'owner' ||
                    lk === 'contributor' ||
                    lk === 'contributor_id' ||
                    lk === 'contributor_uuid' ||
                    lk === 'user_uuid')
                )
                  return '';
                if (excludePii && lk.includes('country')) return '';
                if (!includeAnyMetadata && lk === 'sections') return '';
                if (typeof v === 'string') return scrubPII(v, excludePii, r.pad_id || r.id);
                return v;
              });
              ws.addRow(vals).commit();
            });
          }
        } catch (sheetErr: any) {
          console.error(`Failed processing sheet for ${key}`, sheetErr);
        }
      }

      // Add Notes sheet
      try {
        const notes = buildExportNotes(job, dbKeys, !!job.exclude_pii).split('\n');
        const notesSheet = workbook.addWorksheet('Notes');
        for (const line of notes) notesSheet.addRow([line]).commit();
      } catch (noteErr: any) {
        console.warn('Failed to write Notes sheet', noteErr);
      }

      await workbook.commit();
      const url = await uploadPromise;
      return { blobUrl: url, outFiles: [] };
    } catch (e) {
      lastErr = e;
      console.warn(
        `XLSX upload attempt ${attempt} failed, retrying`,
        String((e as any)?.message || e)
      );
      await sleep(500 * attempt);
      continue;
    }
  }
  throw lastErr || new Error('XLSX upload failed');
}
