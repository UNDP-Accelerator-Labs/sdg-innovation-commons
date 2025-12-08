/**
 * Job Processing Module
 * 
 * Orchestrates export job execution, format selection, and result aggregation.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import { PassThrough } from 'node:stream';
import { uploadXlsxWithRetries } from './xlsx-export';
import { uploadKeyStreamWithRetries } from './csv-json-export';
import { fetchAdm0Map, uploadStreamToAzure } from './index';

// ExcelJS dynamic import check
let ExcelJS: any = null;
try {
  ExcelJS = require('exceljs');
} catch (e) {
  console.warn('ExcelJS not available; XLSX exports disabled');
}

/**
 * Process an export job by format (XLSX, CSV, JSON)
 * 
 * Routes to appropriate export handler based on format:
 * - XLSX: Uses ExcelJS streaming with retry logic
 * - CSV/JSON: Streams directly to Azure per database key
 * 
 * Returns blob URL (single export) or manifest URL (multiple exports)
 * 
 * @param job - Export job configuration
 * @returns Object with blobUrl and outFiles array
 */
export async function processJob(job: any): Promise<{ blobUrl: string | null; outFiles: string[] }> {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tmp-export-'));
  const outFiles: string[] = [];

  try {
    const dbKeys: string[] = job.db_keys || [];
    // Build adm0 map once for country enrichment
    const adm0Map = await fetchAdm0Map();

    if (job.format === 'xlsx' && ExcelJS) {
      // Use retry-safe XLSX uploader
      return await uploadXlsxWithRetries(job, 3);
    }

    // Fallback: produce CSV/JSON per-db as streams directly to blob (retry-safe per key)
    const producedBlobUrls: string[] = [];
    for (const key of dbKeys) {
      if (key === 'general') throw new Error('Direct export of general DB is forbidden');
      const url = await uploadKeyStreamWithRetries(job, key, job.format || 'csv', 3);
      producedBlobUrls.push(url);
    }

    // If single blob, return it; if multiple, create manifest JSON blob
    let blobUrl: string | null = null;
    if (producedBlobUrls.length === 1) {
      blobUrl = producedBlobUrls[0];
    } else {
      const manifestName = `export-${job.id}-manifest.json`;
      const manifestStream = new PassThrough();
      const manifestPromise = uploadStreamToAzure(
        manifestStream as any,
        manifestName,
        'application/json'
      );
      manifestStream.write(
        JSON.stringify(
          { files: producedBlobUrls, created_at: new Date().toISOString() },
          null,
          2
        )
      );
      manifestStream.end();
      blobUrl = await manifestPromise;
    }

    return { blobUrl, outFiles: [] };
  } finally {
    // No temp files created in streaming paths, kept for compatibility
  }
}
