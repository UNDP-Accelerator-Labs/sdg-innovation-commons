#!/usr/bin/env ts-node
import fs from 'fs';
import path from 'path';
import { query as dbQuery, getClient } from '../app/lib/db';
import { BlobServiceClient, StorageSharedKeyCredential, generateBlobSASQueryParameters, BlobSASPermissions } from '@azure/storage-blob';
import nodemailer from 'nodemailer';
import os from 'os';
import { Stream, PassThrough } from 'stream';
import { createNotification } from '../app/lib/data/platform-api';

// Try to require exceljs dynamically so the worker still runs if the package is missing
let ExcelJS: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  ExcelJS = require('exceljs');
} catch (e) {
  ExcelJS = null;
  console.warn('exceljs not installed — XLSX export will fall back to CSV/JSON');
}

// pg-query-stream for streaming rows
let QueryStream: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  QueryStream = require('pg-query-stream');
} catch (e) {
  QueryStream = null;
  console.warn('pg-query-stream not installed — large exports may consume more memory');
}

async function sleep(ms:number){ return new Promise(res=>setTimeout(res,ms)); }

// helper to await writable stream finish
function waitStreamFinish(stream: Stream & { on: any }) {
  return new Promise<void>((resolve, reject) => {
    stream.on('finish', () => resolve());
    stream.on('end', () => resolve());
    stream.on('error', (err: any) => reject(err));
  });
}

// Helper to scrub PII from free text when excludePii is enabled.
// Removes email addresses and phone numbers and replaces them with a placeholder.
function scrubPII(val: any, excludePii: boolean) {
  if (!excludePii) return val;
  if (val === null || typeof val === 'undefined') return val;
  let s = typeof val === 'string' ? val : JSON.stringify(val);
  // remove emails
  s = s.replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, '[redacted_email]');
  // remove common phone number patterns (international and local)
  s = s.replace(/\+?\d[\d()\-\s]{6,}\d/g, '[redacted_phone]');
  // remove sequences that look like national ids (simple heuristic: long digit sequences)
  s = s.replace(/\b\d{6,}\b/g, '[redacted_id]');
  return s;
}

function mapCategoryForDb(key: string) {
  // categories: what we see (solutions), what we test (experiment, learningplan), what we learn (blogs)
  if (key === 'solutions') return 'what-we-see';
  if (['experiment','learningplan'].includes(key)) return 'what-we-test';
  if (key === 'blogs') return 'what-we-learn';
  return 'other';
}

// helper map to data type label
function mapDataType(key:string, row:any) {
  if (key === 'blogs') return (row?.article_type === 'publications') ? 'publication' : 'blog';
  if (key === 'solutions') return 'solution';
  if (key === 'experiment') return 'experiment';
  if (key === 'learningplan') return 'learningplan';
  return key;
}


//upload a readable stream directly to Azure Blob with simple retry/backoff
async function uploadStreamToAzure(readable: any, destName: string, contentType?: string) {
  const conn = process.env.AZURE_STORAGE_CONNECTION_STRING;
  if (!conn) throw new Error('AZURE_STORAGE_CONNECTION_STRING not configured');
  const client = BlobServiceClient.fromConnectionString(conn);
  const containerName = process.env.AZURE_EXPORT_CONTAINER || 'exports';
  const container = client.getContainerClient(containerName);
  await container.createIfNotExists().catch(()=>{});
  const block = container.getBlockBlobClient(destName);

  const bufferSize = 4 * 1024 * 1024; // 4MB
  const maxConcurrency = 5;

  // Note: this function does a single attempt. Caller should recreate the stream if they want retry safety.
  const uploadOptions: any = {};
  if (contentType) uploadOptions.blobHTTPHeaders = { blobContentType: contentType };
  await block.uploadStream(readable as any, bufferSize, maxConcurrency, uploadOptions);

  // Build return URL (prefer env SAS token, otherwise attempt to generate per-blob SAS)
  let returnUrl = block.url;
  if (process.env.AZURE_EXPORT_SAS_TOKEN) {
    returnUrl = `${block.url}?${process.env.AZURE_EXPORT_SAS_TOKEN}`;
    console.log('Uploaded stream to Azure (with provided SAS token):', destName, returnUrl);
    return returnUrl;
  }

  try {
    const m = String(conn).match(/AccountName=([^;]+);AccountKey=([^;]+);/);
    if (m) {
      const account = m[1];
      const accountKey = m[2];
      const sharedKey = new StorageSharedKeyCredential(account, accountKey);
      const expiresOn = new Date(Date.now() + 24 * 3600 * 1000);
      const sas = generateBlobSASQueryParameters({
        containerName,
        blobName: destName,
        permissions: BlobSASPermissions.parse('r'),
        startsOn: new Date(Date.now() - 5 * 60 * 1000),
        expiresOn,
      }, sharedKey).toString();
      returnUrl = `${block.url}?${sas}`;
      console.log('Uploaded stream to Azure (generated SAS):', destName, returnUrl);
      return returnUrl;
    }
  } catch (e) {
    console.warn('Failed to generate SAS token (stream), returning raw blob URL', String((e as any)?.message || e));
  }

  console.log('Uploaded stream to Azure (raw URL):', destName, returnUrl);
  return returnUrl;
}

async function sendNotification(toEmail: string, blobUrl: string, ccEmail?: string) {
  if (!process.env.SMTP_HOST) return;
  const transporter = nodemailer.createTransport({ host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT), auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } });

  const subject = 'Your data export is ready — SDG Innovation Commons';
  const textBody = [
    'Hello,',
    '',
    'Your requested data export is ready for download.',
    '',
    `Download link: ${blobUrl}`,
    '',
    'This link will be available for 24 hours.',
    '',
    'Regards,',
    'SDG Innovation Commons — Data Exports'
  ].join('\n');

  const htmlBody = `
    <div style="font-family: Arial, Helvetica, sans-serif; color: #111;">
      <p>Hello,</p>
      <p>Your requested data export is ready for download.</p>
      <p><a href="${blobUrl}" style="color: #0a66c2; text-decoration: none; font-weight: 600;">Download export</a></p>
      <p style="font-size:12px; color:#666;">This link will be available for 24 hours. If it expires or is no longer available, request a new export from the Admin Exports panel.</p>
      <p>Regards,<br/><strong>SDG Innovation Commons — Data Exports</strong></p>
    </div>
  `;

  const mailOptions: any = {
    from: process.env.SMTP_USER,
    to: toEmail,
    subject,
    text: textBody,
    html: htmlBody
  };

  if (ccEmail) mailOptions.cc = ccEmail;

  try {
    if(process.env.NODE_ENV === 'production') {
      await transporter.sendMail(mailOptions);
    }
    console.log('Sent export notification to', toEmail, ccEmail ? `(cc: ${ccEmail})` : '', 'for', blobUrl);
  } catch (e) {
    console.error('Failed to send export email', e);
  }
}

// small cache-based per-uuid enrich function to avoid loading all users at once
const usersCache: Record<string, any> = {};
async function enrichUserCached(uuid?: string) {
  if (!uuid) return null;
  const key = String(uuid);
  if (usersCache[key]) return usersCache[key];
  try {
    const res = await dbQuery('general' as any, `SELECT uuid, name, email, iso3 FROM users WHERE uuid = $1 LIMIT 1`, [key]);
    const row = res.rows?.[0] || null;
    usersCache[key] = row;
    return row;
  } catch (e) {
    console.warn('Failed to fetch user for enrichment', e);
    usersCache[key] = null;
    return null;
  }
}

async function fetchAdm0Map() {
  try {
    const candidates = ['iso_a3','adm0_a3','iso_n3'];

    // Try to find a matching column on a table named exactly 'adm0'
    const colRes = await dbQuery('general' as any, `
      SELECT column_name, table_schema, table_name FROM information_schema.columns
      WHERE lower(table_name) = 'adm0' AND column_name = ANY($1)
      ORDER BY array_position($1, column_name) NULLS LAST
      LIMIT 1
    `, [candidates]);

    let table_schema: string | null = null;
    let table_name: string | null = null;
    let col: string | null = null;

    if (colRes.rows && colRes.rows.length) {
      col = colRes.rows[0].column_name;
      table_schema = colRes.rows[0].table_schema || 'public';
      table_name = colRes.rows[0].table_name || 'adm0';
    } else {
      // Fallback: find any table that looks like adm0 and then a preferred column on it
      const tbl = await dbQuery('general' as any, `
        SELECT table_schema, table_name FROM information_schema.tables
        WHERE lower(table_name) LIKE '%adm0%'
        LIMIT 1
      `);
      if (tbl.rows && tbl.rows.length) {
        table_schema = tbl.rows[0].table_schema || 'public';
        table_name = tbl.rows[0].table_name;
        const colRes2 = await dbQuery('general' as any, `
          SELECT column_name FROM information_schema.columns
          WHERE table_schema = $1 AND table_name = $2 AND column_name = ANY($3)
          ORDER BY array_position($3, column_name) NULLS LAST
          LIMIT 1
        `, [table_schema, table_name, candidates]);
        if (colRes2.rows && colRes2.rows.length) col = colRes2.rows[0].column_name;
      }
    }

    if (!col || !table_name || !table_schema) {
      console.warn('adm0 table or iso column not found; returning empty map');
      return {};
    }

    // Use fully-qualified identifier to avoid ambiguity
    const sql = `SELECT ${col} AS iso3, name FROM "${table_schema}"."${table_name}"`;
    const r = await dbQuery('general' as any, sql);
    const map: Record<string,string> = {};
    (r.rows || []).forEach((row:any)=>{ if (row.iso3) map[String(row.iso3).toLowerCase()] = row.name; });
    return map;
  } catch (e) {
    console.warn('Failed to fetch adm0 map', String((e as any)?.message || e));
    return {};
  }
}

// helper: stream a query using pg-query-stream and call onRow for each row
async function streamQueryToHandler(dbKey: string, sql: string, params: any[], onRow: (row:any)=>Promise<void>) {
  if (!QueryStream) {
    // fallback to non-streaming
    const r = await dbQuery(dbKey as any, sql, params || []);
    for (const row of (r.rows || [])) await onRow(row);
    return;
  }

  const client = await getClient(dbKey as any);
  const qs = new QueryStream(sql, params || []);
  const stream = client.query(qs);

  return new Promise<void>((resolve, reject) => {
    stream.on('data', async (row: any) => {
      stream.pause();
      try {
        await onRow(row);
      } catch (e) {
        console.error('onRow handler error', e);
        // continue processing other rows after logging
      }
      stream.resume();
    });
    stream.on('end', () => {
      try { client.release(); } catch(e){}
      resolve();
    });
    stream.on('error', (err: any) => {
      try { client.release(); } catch(e){}
      reject(err);
    });
  });
}

// ensure export_jobs has columns for worker tracing without failing if already present
async function ensureJobColumns() {
  try {
    await dbQuery('general' as any, `ALTER TABLE export_jobs ADD COLUMN IF NOT EXISTS worker_id text;`);
    await dbQuery('general' as any, `ALTER TABLE export_jobs ADD COLUMN IF NOT EXISTS last_heartbeat timestamptz;`);
    await dbQuery('general' as any, `ALTER TABLE export_jobs ADD COLUMN IF NOT EXISTS attempt_count integer DEFAULT 0;`);
  } catch (e) {
    console.warn('Failed to ensure export_jobs columns (continuing):', String((e as any)?.message || e));
  }
}

// Reclaim stuck processing jobs older than timeoutMinutes
async function reaper(timeoutMinutes = 10, maxRetries = 5) {
  try {
    const q = `
      WITH stale AS (
        SELECT id, attempt_count FROM export_jobs
        WHERE status = 'processing' AND (last_heartbeat IS NULL OR last_heartbeat < now() - ($1 || ' minutes')::interval)
      )
      UPDATE export_jobs
      SET status = CASE WHEN COALESCE(stale.attempt_count,0) + 1 > $2 THEN 'failed' ELSE 'pending' END,
          worker_id = NULL,
          last_heartbeat = NULL,
          attempt_count = COALESCE(stale.attempt_count,0) + 1,
          updated_at = now()
      FROM stale
      WHERE export_jobs.id = stale.id
      RETURNING export_jobs.id, export_jobs.status, export_jobs.attempt_count;
    `;
    const res = await dbQuery('general' as any, q, [String(timeoutMinutes), maxRetries]);
    if (res.rows && res.rows.length) console.log('Reaper reset stale jobs:', res.rows.map((r:any)=>r.id));
  } catch (e) {
    console.warn('Reaper failed', String((e as any)?.message || e));
  }
}

// Claim pending jobs and assign to this worker (atomic)
async function claimPendingJobs(limit = 5, workerId?: string) {
  const client = await getClient('general' as any);
  try {
    await client.query('BEGIN');
    const claimSql = `
      WITH c AS (
        SELECT id FROM export_jobs
        WHERE status = 'pending'
        ORDER BY created_at
        LIMIT $1
        FOR UPDATE SKIP LOCKED
      )
      UPDATE export_jobs
      SET status = 'processing', updated_at = now(), worker_id = $2, last_heartbeat = now()
      WHERE id IN (SELECT id FROM c)
      RETURNING *;
    `;
    const res = await client.query(claimSql, [limit, workerId || null]);
    await client.query('COMMIT');
    return res.rows || [];
  } catch (e) {
    try { await client.query('ROLLBACK'); } catch (rb) { }
    throw e;
  } finally {
    try { client.release(); } catch (e) { }
  }
}

// Helper to build export notes
function buildExportNotes(job:any, dbKeys:string[], excludePii = false) {
  const lines:string[] = [];
  lines.push('Export report');
  lines.push('==============');
  lines.push(`Databases: ${dbKeys.join(', ')}`);
  lines.push(`Format: ${String(job.format || 'csv').toUpperCase()}`);
  lines.push('');

  // Canonical descriptions taken from the site pages
  const seeText = "Explore our notes on solutions to SDG priorities and problems mapped around the world.";
  const testText = "Discover wicked development challenges we are curious about and the experiments conducted to learn what works and what doesn't in sustainable development.";
  const learnText = "Explore our curated collection of blogs and publications that foster collaboration, innovation, and continuous learning within the Accelerator Lab networks.";

  lines.push('What we see (solutions):');
  lines.push(`- ${seeText}`);
  lines.push('');
  lines.push('What we test (experiments, learning plans):');
  lines.push(`- ${testText}`);
  lines.push('');
  lines.push('What we learn (blogs):');
  lines.push(`- ${learnText}`);
  lines.push('');

  lines.push('Enrichments applied:');
  lines.push('- Contributor/owner lookups: when a contributor/owner UUID is present we try to resolve name, email and iso3 from the central `users` table (general DB).');
  lines.push('- Country names: iso3 codes are mapped to adm0 names when a matching table exists in the general DB.');
  lines.push('');
  lines.push('Privacy note:');
  if (excludePii) {
    lines.push('- Personal data (names, emails) has been excluded from this export as requested. Only UUIDs and country information are included.');
  } else {
    lines.push('- The export includes personal data (names, emails) resolved from user UUIDs when available. Ensure you store and share this file in accordance with data protection rules.');
  }
  if (job.exclude_owner_uuid) {
    lines.push('- Owner UUIDs have been excluded from this export as requested.');
  }
  if (Array.isArray(job.statuses) && job.statuses.length) {
    lines.push(`- Only pads with the following statuses are included: ${job.statuses.join(', ')}.`);
  }
  lines.push('');
  lines.push('Data elements & usage:');
  lines.push('- id / pad_id: internal identifier for the record. Use for cross-referencing with the application DB.');
  lines.push('- owner_uuid / contributor_uuid: user UUIDs (redacted when exclude_owner_uuid=true). Use to join back to user records when available.');
  lines.push('- owner_name / contributor_name: resolved display name from the users table (omitted when exclude_pii=true).');
  lines.push('- owner_email / contributor_email: resolved email (omitted when exclude_pii=true).');
  lines.push('- owner_country / contributor_country: resolved country name from iso3 (treated as PII and omitted when exclude_pii=true).');
  lines.push('- full_text / sections: content and structured sections from the pad/article. Note: when metadata is disabled (no tags/locations/metafields/engagement/comments requested) sections may be omitted.');
  lines.push('- tags / locations / metafields / engagement / comments: optional metadata enrichments. These are only included when explicitly requested and for non-blog exports.');
  lines.push('- data_type / article_type / status: categorical fields to help filter and aggregate exports.');
  lines.push('');
  lines.push('Caveats:');
  lines.push('- Not all platforms use the same column names; the exporter attempts to map common fields (id, owner, created_at) but some columns may be missing or differently named.');
  lines.push('- Large exports stream directly to Azure Blob Storage and may take several seconds to complete before the link becomes valid.');
  return lines.join('\n');
}

// Upload helpers that recreate streams on retry by re-running DB queries
async function uploadXlsxWithRetries(job:any, maxRetries = 3) {
  const destName = `export-${job.id}.xlsx`;
  let attempt = 0;
  let lastErr: any = null;
  while (attempt < maxRetries) {
    attempt += 1;
    const pass = new PassThrough();
    const uploadPromise = uploadStreamToAzure(pass as any, destName, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    try {
      // stream data into workbook which writes into the PassThrough
      const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({ stream: pass });
      const dbKeys: string[] = job.db_keys || [];
      const adm0Map = await fetchAdm0Map();
      const { tagMap, templateMap, sourcePadMap } = await fetchPadRelatedMaps();
      const excludePii = !!job.exclude_pii;
      const excludeOwnerUuid = !!job.exclude_owner_uuid;
      const statusFilter: string[] | null = Array.isArray(job.statuses) && job.statuses.length ? job.statuses : null;

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
        const sheetName = `${group}`.slice(0,31);
        // maintain worksheet reuse across keys that map to the same group
        if (!workbook.__sheetMap) workbook.__sheetMap = {} as any;
        if (!workbook.__sheetMap[sheetName]) {
          workbook.__sheetMap[sheetName] = { ws: workbook.addWorksheet(sheetName), columnsWritten: false };
        }
        const sheetEntry = workbook.__sheetMap[sheetName];
        let columnsWritten = sheetEntry.columnsWritten;
        const ws = sheetEntry.ws;

        try {
          if (key === 'blogs') {
            // For blogs/publications: force-disable contributor and metadata datapoints — these articles do not reliably have tags/locations/contributor/metafields
            const forBlogsForceDisableMetadata = true;
            const includeTags = forBlogsForceDisableMetadata ? false : (job?.params?.include_tags ?? true);
            const includeLocations = forBlogsForceDisableMetadata ? false : (job?.params?.include_locations ?? true);
            const includeMetafields = forBlogsForceDisableMetadata ? false : (job?.params?.include_metafields ?? true);
            const includeEngagement = forBlogsForceDisableMetadata ? false : (job?.params?.include_engagement ?? true);
            const includeComments = forBlogsForceDisableMetadata ? false : (job?.params?.include_comments ?? true);
            // For blog exports we do not expose contributor PII or UUIDs even if requested
            const blogEffectiveIncludeUuid = false;
            const blogEffectiveIncludeName = false;
            const blogEffectiveIncludeEmail = false;
            // include country only when PII is allowed and at least one of name/email/uuid would be present
            const includeCountry = !excludePii && (blogEffectiveIncludeName || blogEffectiveIncludeEmail || blogEffectiveIncludeUuid);
            // Use the blog-specific effective flags below when building header/rows
            const sql = await buildBlogSelectSql('blogs', false);
            await streamQueryToHandler('blogs', sql, [], async (r:any) => {
              // decide whether to include contributor/owner country column (omit when PII excluded)
              if (!columnsWritten) {
                // include enrichment and optional metadata columns
                const header: string[] = ['id','title','full_text','article_type','data_type','published_at','iso3'];
                // include contributor UUID only when requested and owner UUID exclusion not set (blogs: disabled)
                if (blogEffectiveIncludeUuid && !excludeOwnerUuid) header.push('contributor_uuid');
                // contributor PII columns are intentionally disabled for blogs
                if (!excludePii && blogEffectiveIncludeName) header.push('contributor_name');
                if (!excludePii && blogEffectiveIncludeEmail) header.push('contributor_email');
                // include contributor_country only when PII is not excluded and contributor fields are present
                if (includeCountry) header.push('contributor_country');
                // metadata flags (forced-off for blogs)
                if (includeTags) header.push('tags');
                if (includeLocations) header.push('locations');
                if (includeMetafields) header.push('metafields');
                if (includeEngagement) header.push('engagement');
                if (includeComments) header.push('comments');

                ws.addRow(header).commit();

                // set wrapText for the full_text column (it's the 3rd column index = 3)
                try {
                  const fullTextColIndex = header.indexOf('full_text') + 1; // 1-based
                  const col = ws.getColumn(fullTextColIndex);
                  col.width = Math.max(40, Math.min(120, Math.floor(process.env.EXPORT_FULLTEXT_COL_WIDTH ? Number(process.env.EXPORT_FULLTEXT_COL_WIDTH) : 80)));
                  col.alignment = { wrapText: true, vertical: 'top' };
                } catch(e){ /* ignore styling errors in streaming writer */ }

                columnsWritten = true;
                sheetEntry.columnsWritten = true;
              }

              const user = await enrichUserCached(r.contributor);
              const dataType = mapDataType('blogs', r);
              const contributorUuidVal = blogEffectiveIncludeUuid ? (r.contributor || '') : '';
              const contributorNameVal = (!excludePii && blogEffectiveIncludeName) ? (user?.name || '') : '';
              const contributorEmailVal = (!excludePii && blogEffectiveIncludeEmail) ? (user?.email || '') : '';

              // ensure full_text is available (may be from joins or article column)
              let fullTextVal = (r.full_text || r.content || r.html_content || r.body || r.text || '') as string;
              fullTextVal = scrubPII(fullTextVal, excludePii) as string;

              // metadata fields (articles may or may not have these)
              // metadata flags already set for blogs above (forced-off)
              // const includeTags, includeLocations, includeMetafields, includeEngagement, includeComments

              const tags = Array.isArray(r.tags) ? r.tags : (() => { try { return JSON.parse(r.tags || '[]'); } catch(e){ return []; } })();
              const locations = Array.isArray(r.locations) ? r.locations : (() => { try { return JSON.parse(r.locations || '[]'); } catch(e){ return []; } })();
              const metafields = Array.isArray(r.metafields) ? r.metafields : (() => { try { return JSON.parse(r.metafields || '[]'); } catch(e){ return []; } })();
              const engagement = Array.isArray(r.engagement) ? r.engagement : (() => { try { return JSON.parse(r.engagement || '[]'); } catch(e){ return []; } })();
              const comments = Array.isArray(r.comments) ? r.comments : (() => { try { return JSON.parse(r.comments || '[]'); } catch(e){ return []; } })();

              const formatTags = (arr:any[]) => arr.map((t:any)=> (t && (t.tag || t.tag_id || t.type) ? String(t.tag || t.tag_id || t.type) : JSON.stringify(t))).join('; ');
              const formatLocations = (arr:any[]) => arr.map((l:any)=> (l ? `${l.lat ?? ''},${l.lng ?? ''}${l.iso3 ? ` (${l.iso3})` : ''}` : '')).join('; ');
              const formatMeta = (arr:any[]) => arr.map((m:any)=> (m ? `${m.name ?? m.key ?? ''}:${m.value ?? m['value'] ?? JSON.stringify(m)}` : '')).join('; ');
              const formatEng = (arr:any[]) => arr.map((e:any)=> (e ? `${e.type ?? ''}:${e.count ?? e['count'] ?? JSON.stringify(e)}` : '')).join('; ');
              const formatComments = (arr:any[]) => arr.map((c:any)=> (c ? `${c.user_id ?? c.contributor ?? ''}:${String(c.message ?? '').replace(/\s+/g,' ').slice(0,120)}` : '')).join(' || ');

              const tagsStr = false ? '' : '';
              const locStr = false ? '' : '';
              const mfStr = false ? '' : '';
              const egStr = false ? '' : '';
              const cmStr = false ? '' : '';

              // build row values respecting excluded PII columns
              const rowVals:any[] = [r.id, r.title, fullTextVal, r.article_type, dataType, r.published_at, r.iso3];
              if (blogEffectiveIncludeUuid && !excludeOwnerUuid) rowVals.push(contributorUuidVal);
              if (!excludePii && blogEffectiveIncludeName) rowVals.push(contributorNameVal);
              if (!excludePii && blogEffectiveIncludeEmail) rowVals.push(contributorEmailVal);
              if (includeCountry) rowVals.push(''); // blogs do not expose contributor country
              // blogs force-disable metadata columns
              // tags/locations/metafields/engagement/comments intentionally omitted for blogs

              ws.addRow(rowVals).commit();
            });

          } else if (['solutions','experiment','learningplan'].includes(key)) {
            // Build pads query with optional status filter
            const { sql, params } = await buildPadsSelectSql(statusFilter);

            await streamQueryToHandler(key, sql, params, async (r:any) => {
              // decide whether to include owner country column (omit when PII excluded)
              // include country only if PII is allowed and at least one of name/email/uuid would be present
              const includeCountry = !excludePii && (effectiveIncludeName || effectiveIncludeEmail || effectiveIncludeUuid);
              if (!columnsWritten) {
                // base pad columns + data_type + owner info
                // include resolved template/source title columns
                const baseHeader: string[] = ['pad_id','title','data_type'];
                // include owner UUID only when not excluded
                if (effectiveIncludeUuid && !excludeOwnerUuid) baseHeader.push('owner_uuid');
                if (!excludePii && effectiveIncludeName) baseHeader.push('owner_name');
                if (!excludePii && effectiveIncludeEmail) baseHeader.push('owner_email');
                if (includeCountry) baseHeader.push('owner_country');
                baseHeader.push('status','created_at','updated_at','source_pad_id','source_pad_title','template','template_title','full_text');
                // Determine whether any metadata columns are enabled — if none, sections should be omitted
                const includeTags = job?.params?.include_tags ?? true;
                const includeLocations = job?.params?.include_locations ?? true;
                const includeMetafields = job?.params?.include_metafields ?? true;
                const includeEngagement = job?.params?.include_engagement ?? true;
                const includeComments = job?.params?.include_comments ?? true;
                const includeAnyMetadata = includeTags || includeLocations || includeMetafields || includeEngagement || includeComments;
                if (includeMetafields) baseHeader.push('sections');
                // metadata flags
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
              let owner_uuid = effectiveIncludeUuid ? (r.contributor_id ?? null) : '';
              const title = r.title ?? '';
              const status = r.status ?? '';
              const created_at = r.created_at ?? null;
              const updated_at = r.updated_at ?? null;
              const source_pad_id = r.source_pad_id ?? null;
              const template = r.template ?? null;
              let full_text = r.full_text ?? null;
              const sections = r.sections ?? null;

              // parse JSON columns (may already be objects)
              const tags = Array.isArray(r.tags) ? r.tags : (() => { try { return JSON.parse(r.tags || '[]'); } catch(e){ return []; } })();
              const locations = Array.isArray(r.locations) ? r.locations : (() => { try { return JSON.parse(r.locations || '[]'); } catch(e){ return []; } })();
              const metafields = Array.isArray(r.metafields) ? r.metafields : (() => { try { return JSON.parse(r.metafields || '[]'); } catch(e){ return []; } })();
              const engagement = Array.isArray(r.engagement) ? r.engagement : (() => { try { return JSON.parse(r.engagement || '[]'); } catch(e){ return []; } })();
              const comments = Array.isArray(r.comments) ? r.comments : (() => { try { return JSON.parse(r.comments || '[]'); } catch(e){ return []; } })();

              const user = await enrichUserCached(owner_uuid);
              const countryName = (user?.iso3 && adm0Map[user.iso3?.toLowerCase()]) || user?.iso3 || '';
              const name = (!excludePii && effectiveIncludeName) ? (user?.name || '') : '';
              const email = (!excludePii && effectiveIncludeEmail) ? (user?.email || '') : '';

              const formatTags = (arr:any[]) => arr.map((t:any)=>{
                // prefer explicit name, then try tag_id resolution via tagMap
                if (!t) return '';
                const rawTag = (t.tag ?? t.tag_id ?? t.type ?? null);
                if (rawTag == null) return JSON.stringify(t);
                const key = String(rawTag);
                if (tagMap && tagMap[key]) return tagMap[key];
                return String(rawTag);
              }).filter(Boolean).join('; ');
              const formatLocations = (arr:any[]) => arr.map((l:any)=> (l ? `${l.lat ?? ''},${l.lng ?? ''}${l.iso3 ? ` (${l.iso3})` : ''}` : '')).join('; ');
              const formatMeta = (arr:any[]) => arr.map((m:any)=> (m ? `${m.name ?? m.key ?? ''}:${m.value ?? m['value'] ?? JSON.stringify(m)}` : '')).join('; ');
              const formatEng = (arr:any[]) => arr.map((e:any)=> (e ? `${e.type ?? ''}:${e.count ?? e['count'] ?? JSON.stringify(e)}` : '')).join('; ');
              const formatComments = (arr:any[]) => arr.map((c:any)=> (c ? `${c.user_id ?? c.contributor ?? ''}:${String(c.message ?? '').replace(/\s+/g,' ').slice(0,120)}` : '')).join(' || ');

              const includeTags = job?.params?.include_tags ?? true;
              const includeLocations = job?.params?.include_locations ?? true;
              const includeMetafields = job?.params?.include_metafields ?? true;
              const includeEngagement = job?.params?.include_engagement ?? true;
              const includeComments = job?.params?.include_comments ?? true;
              const includeAnyMetadata = includeTags || includeLocations || includeMetafields || includeEngagement || includeComments;

              const tagsStr = includeTags ? formatTags(tags) : '';
              const locStr = includeLocations ? formatLocations(locations) : '';
              const mfStr = includeMetafields ? formatMeta(metafields) : '';
              const egStr = includeEngagement ? formatEng(engagement) : '';
              const cmStr = includeComments ? formatComments(comments) : '';

              const sourceTitle = sourcePadMap && source_pad_id ? (sourcePadMap[String(source_pad_id)] || '') : '';
              const templateTitle = templateMap && template ? (templateMap[String(template)]?.title || '') : '';

              // build row array matching header and excluding PII columns when requested
              const rowArr:any[] = [pad_id, title, dataType];
              if (effectiveIncludeUuid && !excludeOwnerUuid) rowArr.push(owner_uuid);
              if (!excludePii && effectiveIncludeName) rowArr.push(name);
              if (!excludePii && effectiveIncludeEmail) rowArr.push(email);
              if (includeCountry) rowArr.push(countryName);
              rowArr.push(status, created_at, updated_at, source_pad_id, sourceTitle, template, templateTitle);
              rowArr.push(scrubPII(full_text, excludePii));
              if (includeAnyMetadata) rowArr.push(sections);
              if (includeTags) rowArr.push(tagsStr);
              if (includeLocations) rowArr.push(locStr);
              if (includeMetafields) rowArr.push(mfStr);
              if (includeEngagement) rowArr.push(egStr);
              if (includeComments) rowArr.push(cmStr);
              ws.addRow(rowArr).commit();
            });

            // no separate metadata sheets: everything is embedded in the pad row now

          } else {
            // fallback sheets
            const sql = key === 'blogs' ? await buildBlogSelectSql('blogs', true) : `SELECT * FROM pads`;
            let header: string[] | null = null;
            // Respect include_* flags in fallback sheets so we don't create columns for disabled metadata
            const includeTags = job?.params?.include_tags ?? true;
            const includeLocations = job?.params?.include_locations ?? true;
            const includeMetafields = job?.params?.include_metafields ?? true;
            const includeEngagement = job?.params?.include_engagement ?? true;
            const includeComments = job?.params?.include_comments ?? true;
            const includeAnyMetadata = includeTags || includeLocations || includeMetafields || includeEngagement || includeComments;
            await streamQueryToHandler(key, sql, [], async (r:any) => {
              if (!columnsWritten) {
                // If excludePii is active, strip name/email-like headers from fallback sheets
                header = Object.keys(r).filter((k:string)=> {
                  const lk = k.toLowerCase();
                  if (excludePii && (lk.includes('name') || lk.includes('email') || lk.includes('country'))) return false;
                  if (excludeOwnerUuid && (lk === 'owner_uuid' || lk === 'owner' || lk === 'contributor' || lk === 'contributor_id' || lk === 'contributor_uuid' || lk === 'user_uuid')) return false;
                  if (!includeTags && (lk === 'tags' || lk === 'tag' || lk === 'tag_list')) return false;
                  if (!includeLocations && (lk === 'locations' || lk === 'location')) return false;
                  if (!includeMetafields && lk === 'metafields') return false;
                  if (!includeEngagement && lk === 'engagement') return false;
                  if (!includeComments && lk === 'comments') return false;
                  // sections is treated as metadata — omit if all metadata disabled
                  if (!includeAnyMetadata && lk === 'sections') return false;
                  return true;
                });
                ws.addRow(header).commit();
                columnsWritten = true;
                sheetEntry.columnsWritten = true;
              }
              // scrub values for PII-sensitive fields in fallback
              const vals = header!.map(h => {
                let v = r[h];
                // if the job disabled some metadata, ensure we don't leak original fields
                const lk = String(h).toLowerCase();
                if (!includeTags && (lk === 'tags' || lk === 'tag' || lk === 'tag_list')) return '';
                if (!includeLocations && (lk === 'locations' || lk === 'location')) return '';
                if (!includeMetafields && lk === 'metafields') return '';
                if (!includeEngagement && (lk === 'engagement')) return '';
                if (!includeComments && (lk === 'comments')) return '';
                if (excludeOwnerUuid && (lk === 'owner_uuid' || lk === 'owner' || lk === 'contributor' || lk === 'contributor_id' || lk === 'contributor_uuid' || lk === 'user_uuid')) return '';
                if (excludePii && lk.includes('country')) return '';
                if (!includeAnyMetadata && lk === 'sections') return '';
                if (typeof v === 'string') return scrubPII(v, excludePii);
                return v;
              });
              ws.addRow(vals).commit();
            });
          }
        } catch (sheetErr:any) {
          console.error(`Failed processing sheet for ${key}`, sheetErr);
        }
      }

      // Add Notes sheet
      try {
        const notes = buildExportNotes(job, dbKeys, !!job.exclude_pii).split('\n');
        const notesSheet = workbook.addWorksheet('Notes');
        for (const line of notes) notesSheet.addRow([line]).commit();
      } catch (noteErr:any) {
        console.warn('Failed to write Notes sheet', noteErr);
      }

      await workbook.commit();
      // await upload
      const url = await uploadPromise;
      return { blobUrl: url, outFiles: [] };
    } catch (e) {
      lastErr = e;
      console.warn(`XLSX upload attempt ${attempt} failed, retrying`, String((e as any)?.message || e));
      // allow next attempt to recreate the streams and re-run queries
      await sleep(500 * attempt);
      continue;
    }
  }
  throw lastErr || new Error('XLSX upload failed');
}

async function uploadKeyStreamWithRetries(job:any, key:string, format:string, maxRetries = 3) {
  const destName = `export-${job.id}-${key}.${format === 'csv' ? 'csv' : 'json'}`;
  let attempt = 0;
  let lastErr: any = null;
  console.log(job)
  while (attempt < maxRetries) {
    attempt += 1;
    const pass = new PassThrough();
    const contentType = format === 'csv' ? 'text/csv' : 'application/json';
    const uploadPromise = uploadStreamToAzure(pass as any, destName, contentType);
    try {
      const adm0Map = await fetchAdm0Map();
      const { tagMap, templateMap, sourcePadMap } = await fetchPadRelatedMaps();
      const excludePii_csv = !!job.exclude_pii;
      const excludeOwnerUuid_csv = !!job.exclude_owner_uuid;
      const statusFilter: string[] | null = Array.isArray(job.statuses) && job.statuses.length ? job.statuses : null;

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
      if (job?.exclude_pii) {
        effectiveIncludeName_csv = false;
        effectiveIncludeEmail_csv = false;
        effectiveIncludeUuid_csv = false;
      }

      if (format === 'csv'){
        let headerWritten = false;
        let header: string[] | null = null;
        const includeCountry = !excludePii_csv && (job?.params?.include_country ?? true);
        // for blogs disable contributor & metadata
        if (key === 'blogs') {
          // override flags for blogs/publications: no contributor/tags/locations/metafields
          // includeCountry already tied to excludePii_csv; for blogs we don't export country either
        }
        // Build pads query with optional status filter when applicable
        let sql:string;
        let params:any[] = [];
        if (['solutions','experiment','learningplan'].includes(key) && statusFilter) {
          const { sql: builtSql, params: builtParams } = await buildPadsSelectSql(statusFilter);
          sql = builtSql;
          params = builtParams;
        } else {
          sql = key === 'blogs' ? await buildBlogSelectSql(key, false) : `SELECT * FROM pads`;
        }

        await streamQueryToHandler(key, sql, params, async (r:any) => {
          // enrich row
          const resolvedOwnerId = r.contributor ?? r.owner ?? r.owner_uuid ?? r.user_uuid ?? r.contributor_id ?? r.owner_id ?? null;
          const user = await enrichUserCached(resolvedOwnerId);
          const countryName = (user?.iso3 && adm0Map[user.iso3?.toLowerCase()]) || user?.iso3 || r.iso3 || '';
          // build enriched object but only include optional fields when enabled
          const enriched: any = Object.assign({}, r);
          enriched.data_type = mapDataType(key, r);
          // only attach contributor_name/email when allowed; otherwise leave property absent
          if (!excludePii_csv && effectiveIncludeName_csv) {
            enriched.owner_name = user?.name ?? '';
            enriched.contributor_name = user?.name ?? '';
          }
          if (!excludePii_csv && effectiveIncludeEmail_csv) {
            enriched.owner_email = user?.email ?? '';
            enriched.contributor_email = user?.email ?? '';
          }
          // include owner/contributor uuid when requested
          if (effectiveIncludeUuid_csv && !excludeOwnerUuid_csv) {
            enriched.owner_uuid = resolvedOwnerId ?? '';
            enriched.contributor_uuid = resolvedOwnerId ?? '';
          }
          // contributor_country is treated as PII: only include when PII not excluded and not a blog
          if (!excludePii_csv && key !== 'blogs') {
            enriched.contributor_country = countryName;
            enriched.owner_country = countryName;
          }
          // remove owner/contributor id fields entirely when owner UUID exclusion requested
          if (excludeOwnerUuid_csv) {
            delete enriched.owner; delete enriched.owner_uuid; delete enriched.owner_id; delete enriched.contributor; delete enriched.contributor_id; delete enriched.contributor_uuid; delete enriched.user_uuid; delete enriched.user_id;
            // also ensure explicit resolved uuid fields are removed
            delete enriched.owner_uuid; delete enriched.contributor_uuid;
          }

          // metadata flags
          const includeTags = job?.params?.include_tags ?? true;
          const includeLocations = job?.params?.include_locations ?? true;
          const includeMetafields = job?.params?.include_metafields ?? true;
          const includeEngagement = job?.params?.include_engagement ?? true;
          const includeComments = job?.params?.include_comments ?? true;
          const includeAnyMetadata_csv = includeTags || includeLocations || includeMetafields || includeEngagement || includeComments;

          // parse and format metadata fields if present
          const tags = Array.isArray(r.tags) ? r.tags : (() => { try { return JSON.parse(r.tags || '[]'); } catch(e){ return []; } })();
          const locations = Array.isArray(r.locations) ? r.locations : (() => { try { return JSON.parse(r.locations || '[]'); } catch(e){ return []; } })();
          const metafields = Array.isArray(r.metafields) ? r.metafields : (() => { try { return JSON.parse(r.metafields || '[]'); } catch(e){ return []; } })();
          const engagement = Array.isArray(r.engagement) ? r.engagement : (() => { try { return JSON.parse(r.engagement || '[]'); } catch(e){ return []; } })();
          const comments = Array.isArray(r.comments) ? r.comments : (() => { try { return JSON.parse(r.comments || '[]'); } catch(e){ return []; } })();

          const formatTags = (arr:any[]) => arr.map((t:any)=> (t && (t.tag || t.tag_id || t.type) ? String(t.tag || t.tag_id || t.type) : JSON.stringify(t))).join('; ');
          // replace with resolution using tagMap
          const formatTagsResolved = (arr:any[]) => arr.map((t:any)=>{
            if (!t) return '';
            const rawTag = (t.tag ?? t.tag_id ?? t.type ?? null);
            if (rawTag == null) return JSON.stringify(t);
            const key = String(rawTag);
            if (tagMap && tagMap[key]) return tagMap[key];
            return String(rawTag);
          }).filter(Boolean).join('; ');

          if (includeTags) enriched.tags = formatTagsResolved(tags);
          else delete enriched.tags;

          const formatLocations = (arr:any[]) => arr.map((l:any)=> (l ? `${l.lat ?? ''},${l.lng ?? ''}${l.iso3 ? ` (${l.iso3})` : ''}` : '')).join('; ');
          const formatMeta = (arr:any[]) => arr.map((m:any)=> (m ? `${m.name ?? m.key ?? ''}:${m.value ?? m['value'] ?? JSON.stringify(m)}` : '')).join('; ');
          const formatEng = (arr:any[]) => arr.map((e:any)=> (e ? `${e.type ?? ''}:${e.count ?? e['count'] ?? JSON.stringify(e)}` : '')).join('; ');
          const formatComments = (arr:any[]) => arr.map((c:any)=> (c ? `${c.user_id ?? c.contributor ?? ''}:${String(c.message ?? '').replace(/\s+/g,' ').slice(0,120)}` : '')).join(' || ');

          if (includeLocations) enriched.locations = formatLocations(locations);
          else delete enriched.locations;
          if (includeMetafields) enriched.metafields = formatMeta(metafields);
          else delete enriched.metafields;
          if (includeEngagement) enriched.engagement = formatEng(engagement);
          else delete enriched.engagement;
          if (includeComments) enriched.comments = formatComments(comments);
          else delete enriched.comments;

          // add resolved template/source titles
          try {
            const tplId = r.template ?? r.template_id ?? r.templateId ?? null;
            const srcId = r.source_pad_id ?? r.source ?? r.source_id ?? r.sourcePadId ?? null;
            if (tplId) enriched.template_title = templateMap && templateMap[String(tplId)] ? templateMap[String(tplId)].title : '';
            if (srcId) enriched.source_pad_title = sourcePadMap && sourcePadMap[String(srcId)] ? sourcePadMap[String(srcId)] : '';
          } catch(e){ /* ignore resolution errors */ }

          // scrub PII in free-text fields
          if (excludePii_csv) {
            if (typeof enriched.full_text === 'string') enriched.full_text = scrubPII(enriched.full_text, true);
            // scrub any metadata-like string fields
            if (typeof enriched.tags === 'string') enriched.tags = scrubPII(enriched.tags, true);
          }

          if (!headerWritten) {
            // build header optionally excluding PII columns and disabled metadata
            header = Object.keys(enriched).filter(k => {
              const lk = k.toLowerCase();
              if (excludePii_csv && (lk.includes('name') || lk.includes('email') || lk === 'owner_name' || lk === 'contributor_name' || lk === 'owner_email' || lk === 'contributor_email')) return false;
              if (excludeOwnerUuid_csv && (lk === 'owner_uuid' || lk === 'owner' || lk === 'contributor' || lk === 'contributor_id' || lk === 'contributor_uuid' || lk === 'user_uuid')) return false;   
              if (excludePii_csv && lk.includes('country')) return false;
              if (!includeTags && (lk === 'tags' || lk === 'tag' || lk === 'tag_list')) return false;
              if (!includeLocations && (lk === 'locations' || lk === 'location')) return false;
              if (!includeMetafields && lk === 'metafields') return false;
              if (!includeEngagement && lk === 'engagement') return false;
              if (!includeComments && lk === 'comments') return false;
              // sections is treated as metadata — omit if all metadata disabled
              if (!includeAnyMetadata_csv && lk === 'sections') return false;
              return true;
            });
            pass.write(header.join(',') + '\n');
            headerWritten = true;
          }

          // ensure we redact any owner/contributor fields in rows when exclusion requested
          if (excludeOwnerUuid_csv) {
            delete enriched.owner; delete enriched.owner_uuid; delete enriched.owner_id; delete enriched.contributor; delete enriched.contributor_id; delete enriched.contributor_uuid; delete enriched.user_uuid; delete enriched.user_id;
          }
          if (job?.exclude_pii) {
            // scrub PII from string values
            for (const hh of Object.keys(enriched)) {
              if (typeof enriched[hh] === 'string') enriched[hh] = scrubPII(enriched[hh], true);
            }
          }
          // write row using header order
          const row = header!.map((h: string) => (enriched[h] ?? ''));
          pass.write((row.map((v: any) => typeof v === 'string' ? `"${String(v).replace(/"/g,'""')}"` : String(v))).join(',') + '\n');
        });
        pass.end();
        const url = await uploadPromise;
        return url;

      } else {
        // JSON path
        pass.write('[');
        let first = true;
        const sql = key === 'blogs' ? await buildBlogSelectSql(key, false) : `SELECT * FROM pads`;
        await streamQueryToHandler(key, sql, [], async (r:any) => {
          const resolvedOwnerId = r.contributor ?? r.owner ?? r.owner_uuid ?? r.user_uuid ?? r.contributor_id ?? r.owner_id ?? null;
          const user = await enrichUserCached(resolvedOwnerId);
          const countryName = (user?.iso3 && adm0Map[user.iso3?.toLowerCase()]) || user?.iso3 || r.iso3 || '';
          // Build enriched object but omit disabled fields entirely so JSON objects don't contain empty columns
          const enriched:any = Object.assign({}, r);
          enriched.data_type = mapDataType(key, r);
          if (!excludePii_csv && effectiveIncludeName_csv) {
            enriched.owner_name = user?.name ?? '';
            enriched.contributor_name = user?.name ?? '';
          }
          if (!excludePii_csv && effectiveIncludeEmail_csv) {
            enriched.owner_email = user?.email ?? '';
            enriched.contributor_email = user?.email ?? '';
          }
          if (effectiveIncludeUuid_csv && !excludeOwnerUuid_csv) {
            enriched.owner_uuid = resolvedOwnerId ?? '';
            enriched.contributor_uuid = resolvedOwnerId ?? '';
          }
          // contributor_country treated as PII: do not include when excludePii_csv or for blogs
          if (!excludePii_csv && key !== 'blogs') {
            enriched.contributor_country = countryName;
            enriched.owner_country = countryName;
          }
          // remove owner/contributor id fields entirely when owner UUID exclusion requested
          if (excludeOwnerUuid_csv) {
            delete enriched.owner; delete enriched.owner_uuid; delete enriched.owner_id; delete enriched.contributor; delete enriched.contributor_id; delete enriched.contributor_uuid; delete enriched.user_uuid; delete enriched.user_id;
          }

          // metadata flags and formatting
          const includeTags = job?.params?.include_tags ?? true;
          const includeLocations = job?.params?.include_locations ?? true;
          const includeMetafields = job?.params?.include_metafields ?? true;
          const includeEngagement = job?.params?.include_engagement ?? true;
          const includeComments = job?.params?.include_comments ?? true;
          const includeAnyMetadata_csv = includeTags || includeLocations || includeMetafields || includeEngagement || includeComments;

          const tags = Array.isArray(r.tags) ? r.tags : (() => { try { return JSON.parse(r.tags || '[]'); } catch(e){ return []; } })();
          const locations = Array.isArray(r.locations) ? r.locations : (() => { try { return JSON.parse(r.locations || '[]'); } catch(e){ return []; } })();
          const metafields = Array.isArray(r.metafields) ? r.metafields : (() => { try { return JSON.parse(r.metafields || '[]'); } catch(e){ return []; } })();
          const engagement = Array.isArray(r.engagement) ? r.engagement : (() => { try { return JSON.parse(r.engagement || '[]'); } catch(e){ return []; } })();
          const comments = Array.isArray(r.comments) ? r.comments : (() => { try { return JSON.parse(r.comments || '[]'); } catch(e){ return []; } })();

          // replace tag formatting with resolved version
          if (includeTags) enriched.tags = (function(arr:any[]){ return arr.map((t:any)=>{
            if (!t) return '';
            const rawTag = (t.tag ?? t.tag_id ?? t.type ?? null);
            if (rawTag == null) return JSON.stringify(t);
            const key = String(rawTag);
            if (tagMap && tagMap[key]) return tagMap[key];
            return String(rawTag);
          }).filter(Boolean).join('; '); })(tags);
          else delete enriched.tags;

          const formatLocations = (arr:any[]) => arr.map((l:any)=> (l ? `${l.lat ?? ''},${l.lng ?? ''}${l.iso3 ? ` (${l.iso3})` : ''}` : '')).join('; ');
          const formatMeta = (arr:any[]) => arr.map((m:any)=> (m ? `${m.name ?? m.key ?? ''}:${m.value ?? m['value'] ?? JSON.stringify(m)}` : '')).join('; ');
          const formatEng = (arr:any[]) => arr.map((e:any)=> (e ? `${e.type ?? ''}:${e.count ?? e['count'] ?? JSON.stringify(e)}` : '')).join('; ');
          const formatComments = (arr:any[]) => arr.map((c:any)=> (c ? `${c.user_id ?? c.contributor ?? ''}:${String(c.message ?? '').replace(/\s+/g,' ').slice(0,120)}` : '')).join(' || ');

          if (includeLocations) enriched.locations = formatLocations(locations);
          else delete enriched.locations;
          if (includeMetafields) enriched.metafields = formatMeta(metafields);
          else delete enriched.metafields;
          if (includeEngagement) enriched.engagement = formatEng(engagement);
          else delete enriched.engagement;
          if (includeComments) enriched.comments = formatComments(comments);
          else delete enriched.comments;

          // add resolved template/source titles
          try {
            const tplId = r.template ?? r.template_id ?? r.templateId ?? null;
            const srcId = r.source_pad_id ?? r.source ?? r.source_id ?? r.sourcePadId ?? null;
            if (tplId) enriched.template_title = templateMap && templateMap[String(tplId)] ? templateMap[String(tplId)].title : '';
            if (srcId) enriched.source_pad_title = sourcePadMap && sourcePadMap[String(srcId)] ? sourcePadMap[String(srcId)] : '';
          } catch(e){ /* ignore resolution errors */ }

          // scrub PII in free-text fields
          if (excludePii_csv) {
            if (typeof enriched.full_text === 'string') enriched.full_text = scrubPII(enriched.full_text, true);
          }

          const chunk = JSON.stringify(enriched);
          if (!first) pass.write(',\n');
          pass.write(chunk);
          first = false;
        });
        pass.write(']');
        pass.end();
        const url = await uploadPromise;
        return url;
      }
    } catch (e) {
      lastErr = e;
      console.warn(`Upload attempt ${attempt} for ${key} failed, retrying`, String((e as any)?.message || e));
      await sleep(500 * attempt);
      continue;
    }
  }
  throw lastErr || new Error(`Upload failed for ${key}`);
}

async function processJob(job:any){
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tmp-export-'));
  const outFiles: string[] = [];
  try {
    const dbKeys: string[] = job.db_keys || [];
    // Build adm0 map once
    const adm0Map = await fetchAdm0Map();

    if (job.format === 'xlsx' && ExcelJS) {
      // Use retry-safe XLSX uploader
      return await uploadXlsxWithRetries(job, 3);
    }

    // fallback behavior: produce CSV/JSON per-db as streams directly to blob (retry-safe per key)
    const producedBlobUrls: string[] = [];
    for (const key of dbKeys) {
      if (key === 'general') throw new Error('Direct export of general DB is forbidden');
      const url = await uploadKeyStreamWithRetries(job, key, job.format || 'csv', 3);
      producedBlobUrls.push(url);
    }

    // If we produced a single blob, return it; if multiple, create a small manifest JSON blob listing them
    let blobUrl: string | null = null;
    if (producedBlobUrls.length === 1) {
      blobUrl = producedBlobUrls[0];
    } else {
      const manifestName = `export-${job.id}-manifest.json`;
      const manifestStream = new PassThrough();
      const manifestPromise = uploadStreamToAzure(manifestStream as any, manifestName, 'application/json');
      manifestStream.write(JSON.stringify({ files: producedBlobUrls, created_at: new Date().toISOString() }, null, 2));
      manifestStream.end();
      blobUrl = await manifestPromise;
    }

    return { blobUrl, outFiles: [] };
  } finally {
    // caller will cleanup (no temp files created in streaming paths)
  }
}

async function hasColumn(dbKey: string, tableName: string, columnName: string) {
  try {
    const q = `SELECT 1 FROM information_schema.columns WHERE table_name = $1 AND column_name = $2 LIMIT 1`;
    const r = await dbQuery(dbKey as any, q, [tableName, columnName]);
    return (r.rows || []).length > 0;
  } catch (e) {
    console.warn('hasColumn check failed', dbKey, tableName, columnName, String((e as any)?.message || e));
    return false;
  }
}

async function hasTable(dbKey: string, tableName: string) {
  try {
    const q = `SELECT 1 FROM information_schema.tables WHERE table_name = $1 LIMIT 1`;
    const r = await dbQuery(dbKey as any, q, [tableName]);
    return (r.rows || []).length > 0;
  } catch (e) {
    console.warn('hasTable check failed', dbKey, tableName, String((e as any)?.message || e));
    return false;
  }
}

const blogContributorColumnCache: Record<string,string|null> = {};
async function detectBlogContributorColumn(dbKey: string) {
  if (blogContributorColumnCache[dbKey] !== undefined) return blogContributorColumnCache[dbKey];
  const candidates = ['contributor','author','owner','user_id','created_by','created_by_uuid'];
  for (const c of candidates) {
    if (await hasColumn(dbKey, 'articles', c)) {
      blogContributorColumnCache[dbKey] = c;
      return c;
    }
  }
  blogContributorColumnCache[dbKey] = null;
  return null;
}

// detect content column for articles and alias it to full_text in exports
const blogContentColumnCache: Record<string,string|null> = {};
async function detectBlogContentColumn(dbKey: string) {
  if (blogContentColumnCache[dbKey] !== undefined) return blogContentColumnCache[dbKey];
  const candidates = ['content','body','full_text','text','article_body','html'];
  for (const c of candidates) {
    if (await hasColumn(dbKey, 'articles', c)) {
      blogContentColumnCache[dbKey] = c;
      return c;
    }
  }
  blogContentColumnCache[dbKey] = null;
  return null;
}

async function buildBlogSelectSql(dbKey: string, allColumns = false) {
  // Prefer to use article_content and article_html_content tables when present to build a cleaned `full_text` field.
  const includeSlug = await hasColumn(dbKey, 'articles', 'slug');
  const contributorCol = await detectBlogContributorColumn(dbKey);
  const contentCol = await detectBlogContentColumn(dbKey);

  // detect the presence of article_content/article_html_content tables
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
    // when selecting all columns, alias contributor and full_text when possible
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

async function buildPadsSelectSql(statusFilter: string[] | null) {
  // Returns { sql, params }
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

async function fetchPadRelatedMaps() {
  // Prefetch tag, template and source pad title maps from the general DB.
  // This avoids cross-db joins and lets the exporter enrich rows in-memory.
  const tagMap: Record<string,string> = {};
  const templateMap: Record<string,{title?:string, full_text?:string}> = {};
  const sourcePadMap: Record<string,string> = {};
  try {
    // tags
    try {
      const tRes = await dbQuery('general' as any, `SELECT id, name FROM tags`);
      (tRes.rows || []).forEach((r:any) => { if (r.id) tagMap[String(r.id)] = r.name || '' });
    } catch (e) {
      // tags table may not exist in some installs
      // swallow and continue with empty map
      // console.warn('Could not load tags map', e);
    }

    // templates
    try {
      const tplRes = await dbQuery('general' as any, `SELECT id, title, full_text FROM templates`);
      (tplRes.rows || []).forEach((r:any) => { if (r.id) templateMap[String(r.id)] = { title: r.title || '', full_text: r.full_text || '' } });
    } catch (e) {
      // ignore if templates table missing
    }

    // source pads (best-effort: this table may or may not exist in general DB)
    try {
      const spRes = await dbQuery('general' as any, `SELECT id, title FROM pads`);
      (spRes.rows || []).forEach((r:any) => { if (r.id) sourcePadMap[String(r.id)] = r.title || '' });
    } catch (e) {
      // ignore if pads table missing in general DB
    }
  } catch (e) {
    console.warn('fetchPadRelatedMaps encountered an error', String((e as any)?.message || e));
  }
  return { tagMap, templateMap, sourcePadMap };
}

async function main(){
  console.log('Export worker started');

  // ensure schema has worker columns
  await ensureJobColumns();

  const workerId = `${os.hostname()}:${process.pid}:${Math.random().toString(36).slice(2,8)}`;

  // set up heartbeat interval
  let heartbeatInterval: NodeJS.Timer | null = null;
  heartbeatInterval = setInterval(async () => {
    try {
      await dbQuery('general' as any, `UPDATE export_jobs SET last_heartbeat = now(), updated_at = now() WHERE worker_id = $1 AND status = 'processing'`, [workerId]);
    } catch (e) {
      console.warn('Heartbeat failed', String((e as any)?.message || e));
    }
  }, 30 * 1000);

  // set up a dedicated listener client for LISTEN/NOTIFY
  let listenClient: any = null;
  try {
    listenClient = await getClient('general' as any);
    // pg requires a real client for notifications
    await listenClient.query('LISTEN export_jobs_channel');
    listenClient.on('notification', (msg:any) => {
      // simple log — the loop will attempt to claim immediately after notification
      console.log('Received notification on export_jobs_channel', msg.payload);
    });
  } catch (e) {
    console.warn('Failed to establish LISTEN client, falling back to polling', e);
    try { if (listenClient) listenClient.release(); } catch(e){}
    listenClient = null;
  }

  while(true){
    try{
      // run reaper to reclaim stuck jobs before claiming
      await reaper(10, 5);

      // Attempt to claim jobs atomically and tag with workerId
      const claimed = await claimPendingJobs(5, workerId);
      if (!claimed || claimed.length === 0) {
        // nothing claimed — wait for either a notification or a short timeout
        if (listenClient) {
          await new Promise<void>((resolve) => {
            const onNotify = () => { resolve(); };
            // attach once listener
            listenClient.once('notification', onNotify);
            // fallback timeout
            const t = setTimeout(() => {
              try { listenClient.removeListener('notification', onNotify); } catch(e){}
              resolve();
            }, 5000);
          });
          continue; // loop and try claiming again
        } else {
          await sleep(5000);
          continue;
        }
      }

      for (const job of claimed) {
        console.log('Processing job', job.id, 'worker', workerId);
        try {
          const { blobUrl, outFiles } = await processJob(job);

          const expiresAt = new Date(Date.now() + 24 * 3600 * 1000).toISOString();
          await dbQuery('general' as any, `UPDATE export_jobs SET status='done', blob_url=$1, expires_at=$2, updated_at=now(), worker_id=NULL, last_heartbeat = now() WHERE id=$3`, [blobUrl, expiresAt, job.id]);

          // notify requester
          if (process.env.SMTP_HOST){
            // Always use requester_uuid to determine primary recipient when possible; include additional email as CC if provided
            let primaryEmail: string | null = null;
            if (job.requester_uuid) {
              const u = await dbQuery('general' as any, `SELECT email FROM users WHERE uuid = $1 LIMIT 1`, [job.requester_uuid]);
              primaryEmail = u.rows?.[0]?.email || null;
            }
            const ccEmail = job.params?.requester_email ? String(job.params.requester_email) : null;
            const toEmail = primaryEmail || ccEmail;

            // if toEmail exists also create an admin notification that export completed, for audit (info)
            try {
              const adminUiBase = process.env.NODE_ENV === 'production' ? 'https://sdg-innovation-commons.org' : (process.env.LOCAL_BASE_URL || 'http://localhost:3000');
              await createNotification({
                type: 'export_completed',
                level: 'info',
                payload: {
                  message: `Export job ${job.id} completed by worker ${workerId}`,
                  blobUrl,
                  jobId: job.id,
                },
                metadata: { adminUrl: `${adminUiBase}/admin/notifications` },
                related_uuids: job.requester_uuid ? [job.requester_uuid] : [],
              });
            } catch (e) {
              console.warn('Failed to persist admin notification for export completion', e);
            }

            const to = toEmail;
            const cc = ccEmail && ccEmail !== toEmail ? ccEmail : undefined;
            if (to) await sendNotification(to, blobUrl, cc);
          }

          // cleanup tmp (no-op for streaming paths, kept for compatibility)
          try{ outFiles.forEach(f => fs.unlinkSync(f)); if (outFiles.length) fs.rmdirSync(path.dirname(outFiles[0])); } catch(e){}

        } catch (err:any) {
          console.error('Job failed', job.id, err);
          try{ await dbQuery('general' as any, `UPDATE export_jobs SET status='failed', error=$1, updated_at=now(), worker_id=NULL, last_heartbeat = now() WHERE id=$2`, [String(err?.message || err), job.id]); } catch(e){ console.error('Failed to mark job failed', e); }
        }
      }
    }catch(err){ console.error('Worker loop error', err); await sleep(2000); }
  }
}

main().catch(e=>{ console.error(e); process.exit(1); });
