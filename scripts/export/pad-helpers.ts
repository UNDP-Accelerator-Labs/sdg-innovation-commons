/**
 * Pad-related helper functions for export processing
 */

import { query as dbQuery } from '../../app/lib/db';

/**
 * Fetch tag, template, and source pad title maps from general DB
 * Used to enrich pad exports without requiring cross-database joins
 */
export async function fetchPadRelatedMaps(): Promise<{
  tagMap: Record<string, string>;
  templateMap: Record<string, { title?: string; full_text?: string }>;
  sourcePadMap: Record<string, string>;
}> {
  const tagMap: Record<string, string> = {};
  const templateMap: Record<string, { title?: string; full_text?: string }> = {};
  const sourcePadMap: Record<string, string> = {};

  try {
    // Fetch tags
    try {
      const tRes = await dbQuery('general' as any, `SELECT id, name FROM tags`);
      (tRes.rows || []).forEach((r: any) => {
        if (r.id) tagMap[String(r.id)] = r.name || '';
      });
    } catch (e) {
      // Tags table may not exist in some installations
      // console.warn('Could not load tags map', e);
    }

    // Fetch templates
    try {
      const tplRes = await dbQuery('general' as any, `SELECT id, title, full_text FROM templates`);
      (tplRes.rows || []).forEach((r: any) => {
        if (r.id) templateMap[String(r.id)] = { title: r.title || '', full_text: r.full_text || '' };
      });
    } catch (e) {
      // Ignore if templates table is missing
    }

    // Fetch source pads (best-effort: this table may or may not exist in general DB)
    try {
      const spRes = await dbQuery('general' as any, `SELECT id, title FROM pads`);
      (spRes.rows || []).forEach((r: any) => {
        if (r.id) sourcePadMap[String(r.id)] = r.title || '';
      });
    } catch (e) {
      // Ignore if pads table is missing in general DB
    }
  } catch (e) {
    console.warn('fetchPadRelatedMaps encountered an error', String((e as any)?.message || e));
  }

  return { tagMap, templateMap, sourcePadMap };
}
