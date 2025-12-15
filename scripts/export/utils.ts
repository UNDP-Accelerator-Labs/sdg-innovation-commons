// Utility functions for export processing

import { Stream } from 'stream';

export async function sleep(ms: number): Promise<void> {
  return new Promise(res => setTimeout(res, ms));
}

export function waitStreamFinish(stream: Stream & { on: any }): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    stream.on('finish', () => resolve());
    stream.on('end', () => resolve());
    stream.on('error', (err: any) => reject(err));
  });
}

/**
 * Scrub PII from free text when excludePii is enabled.
 * Removes email addresses, phone numbers, and ID sequences.
 * 
 * Enhanced patterns for comprehensive PII removal:
 * - Email addresses (various formats)
 * - Phone numbers (international, local, with/without separators)
 * - National IDs and long digit sequences
 * - Common PII patterns in text
 * 
 * @param val - Value to scrub
 * @param excludePii - Whether to scrub PII
 * @param recordId - Optional record ID (pad_id, blog id, etc.) for logging redactions
 */
export function scrubPII(val: any, excludePii: boolean, recordId?: string | number): any {
  if (!excludePii) return val;
  if (val === null || typeof val === 'undefined') return val;
  
  let s = typeof val === 'string' ? val : JSON.stringify(val);
  const originalLength = s.length;
  let hadRedactions = false;
  
  // Remove email addresses (comprehensive pattern)
  const emailBefore = s;
  s = s.replace(/[A-Za-z0-9]([A-Za-z0-9._%+-]*[A-Za-z0-9])?@[A-Za-z0-9]([A-Za-z0-9.-]*[A-Za-z0-9])?\.[A-Za-z]{2,}/gi, '[REDACTED_EMAIL]');
  if (s !== emailBefore) hadRedactions = true;
  
  // Remove phone numbers with various formats:
  // - International format: +1234567890, +1 234 567 890, +1-234-567-890
  // - Local format: (123) 456-7890, 123-456-7890, 123.456.7890
  // - Plain digits: 1234567890 (8+ digits)
  const phoneBefore = s;
  s = s.replace(/(\+\d{1,3}[-.\s]?)?(\(?\d{2,4}\)?[-.\s]?)(\d{2,4}[-.\s]?){2,}\d{2,4}/g, '[REDACTED_PHONE]');
  if (s !== phoneBefore) hadRedactions = true;
  
  // Remove standalone phone numbers (sequences of 8+ digits with optional separators)
  const phone2Before = s;
  s = s.replace(/\b\d{3,}[-.\s]?\d{3,}[-.\s]?\d{3,}\b/g, '[REDACTED_PHONE]');
  if (s !== phone2Before) hadRedactions = true;
  
  // Remove sequences that look like national IDs (6+ consecutive digits)
  const idBefore = s;
  s = s.replace(/\b\d{6,}\b/g, '[REDACTED_ID]');
  if (s !== idBefore) hadRedactions = true;
  
  // Remove email-like patterns that might have been missed
  const email2Before = s;
  s = s.replace(/[A-Za-z0-9._%+-]+\s*@\s*[A-Za-z0-9.-]+\s*\.\s*[A-Za-z]{2,}/gi, '[REDACTED_EMAIL]');
  if (s !== email2Before) hadRedactions = true;
  
  // Remove "mailto:" links
  const mailtoBefore = s;
  s = s.replace(/mailto:\s*[^\s<>]+/gi, 'mailto:[REDACTED_EMAIL]');
  if (s !== mailtoBefore) hadRedactions = true;
  
  // Log if any PII was redacted (testing purpose only)
  if (hadRedactions && recordId) {
    console.log(`[PII_REDACTION] Record ID: ${recordId} - Redacted PII (original length: ${originalLength}, new length: ${s.length})`);
  }
  
  return s;
}

export function mapCategoryForDb(key: string): string {
  // categories: what we see (solutions), what we test (experiment, learningplan), what we learn (blogs)
  if (key === 'solutions') return 'what-we-see';
  if (['experiment', 'learningplan'].includes(key)) return 'what-we-test';
  if (key === 'blogs') return 'what-we-learn';
  return 'other';
}

export function mapDataType(key: string, row: any): string {
  if (key === 'blogs') return (row?.article_type === 'publications') ? 'publication' : 'blog';
  if (key === 'solutions') return 'solution';
  if (key === 'experiment') return 'experiment';
  if (key === 'learningplan') return 'learningplan';
  return key;
}
