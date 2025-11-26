#!/usr/bin/env ts-node
// Script to migrate tempData collection files into the 'collections' table.
// Usage: pnpm dlx ts-node scripts/migrate_temp_collections.ts

import path from 'path';
import fs from 'fs';
import { query } from '../app/lib/db';

async function main() {
  try {
    const tempDataPath = path.resolve(process.cwd(), 'app/lib/data/collection/tempData');
    // require the index which aggregates all temp collections
    const jsIndexPath = path.join(tempDataPath, 'index.js');
    const tsIndexPath = path.join(tempDataPath, 'index.ts');

    let tempIndex: any = null;
    if (fs.existsSync(jsIndexPath)) {
      tempIndex = require(jsIndexPath);
    } else if (fs.existsSync(tsIndexPath)) {
      tempIndex = require(tsIndexPath);
    } else {
      throw new Error(`Cannot find tempData index at ${jsIndexPath} or ${tsIndexPath}`);
    }

    const collections = tempIndex.collection || [];

    console.log(`Found ${collections.length} temp collections to migrate`);

    for (const c of collections) {
      const slug = c.id;
      const title = c.title || null;
      const description = c.description || null;
      const content = c.content || null;
      const creator_name = c.creatorName || null;
      const main_image = c.mainImage || null;
      const sections = c.sections || null;

      // ensure migrated collections are marked as published and associate creator_uuid when possible
      const rawHighlights = c.highlights || null;
      let finalHighlights: any = null;
      if (rawHighlights && typeof rawHighlights === 'object') {
        finalHighlights = { ...rawHighlights };
      } else {
        finalHighlights = {};
      }

      // mark as published for migrated tempData
      finalHighlights.published = true;

      // try to resolve creator_name -> user uuid
      let creator_uuid: string | null = null;
      if (creator_name) {
        try {
          const ures = await query('general', 'SELECT uuid FROM users WHERE name = $1 LIMIT 1', [creator_name]);
          if (ures?.rows?.length) {
            creator_uuid = ures.rows[0].uuid;
            finalHighlights.creator_uuid = creator_uuid;
          }
        } catch (ue) {
          const umsg = (ue as any)?.message ? (ue as any).message : String(ue);
          console.warn('Failed to lookup user for creator_name', creator_name, umsg);
        }
      }

      const boards = c.boards || null;

      const sql = `INSERT INTO collections (slug, title, description, content, creator_name, main_image, sections, highlights, boards, created_at, updated_at)
                   VALUES ($1,$2,$3,$4,$5,$6,$7::jsonb,$8::jsonb,$9, NOW(), NOW())
                   ON CONFLICT (slug) DO UPDATE SET
                     title = EXCLUDED.title,
                     description = EXCLUDED.description,
                     content = EXCLUDED.content,
                     creator_name = EXCLUDED.creator_name,
                     main_image = EXCLUDED.main_image,
                     sections = EXCLUDED.sections,
                     highlights = EXCLUDED.highlights,
                     boards = EXCLUDED.boards,
                     updated_at = NOW()
                   RETURNING id, slug`;

      const params = [
        slug,
        title,
        description,
        content,
        creator_name,
        main_image,
        sections ? JSON.stringify(sections) : null,
        finalHighlights ? JSON.stringify(finalHighlights) : null,
        boards,
      ];

      try {
        const res = await query('general', sql, params as any[]);
        console.log(`Migrated: ${slug} -> id=${res.rows[0].id}`);
      } catch (e) {
        console.error(`Failed migrating ${slug}`, e);
      }
    }

    console.log('Migration complete');
  } catch (e) {
    console.error('Migration script failed', e);
    process.exit(1);
  }
}

main();
