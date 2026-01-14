import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/app/lib/db';
import getSession from '@/app/lib/session';
import { getExternDbIdForPlatform } from '@/app/lib/helpers';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    const uuid = session?.uuid;
    const rights = session?.rights || 0;

    if (!uuid) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized access.', status: 403 },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      action,
      board_id,
      object_id,
      board_title,
      source,
    } = body;

    // Validate required fields
    if (!action || !['insert', 'delete'].includes(action)) {
      return NextResponse.json(
        { success: false, message: 'Invalid or missing action. Use "insert" or "delete".', status: 400 },
        { status: 400 }
      );
    }

    if (!object_id || (Array.isArray(object_id) && object_id.length === 0)) {
      return NextResponse.json(
        { success: false, message: 'Object ID(s) are required.', status: 400 },
        { status: 400 }
      );
    }

    if (!source) {
      return NextResponse.json(
        { success: false, message: 'Source platform is required.', status: 400 },
        { status: 400 }
      );
    }

    // Normalize object_id to array
    const padIds = Array.isArray(object_id) ? object_id : [object_id];

    // Get the external_db id for the source platform using helper function
    const db_id = await getExternDbIdForPlatform(source);

    if (!db_id) {
      return NextResponse.json(
        { success: false, message: `Invalid source platform: ${source}`, status: 400 },
        { status: 400 }
      );
    }
    let pinboard_id = board_id;

    // If board_id is 0 or not provided and we're inserting, create a new pinboard
    if (action === 'insert' && (!board_id || board_id === 0)) {
      if (!board_title || board_title.trim().length === 0) {
        return NextResponse.json(
          { success: false, message: 'Board title is required to create a new board.', status: 400 },
          { status: 400 }
        );
      }

      // Create new pinboard
      const newPinboardResult = await query(
        'general',
        `
        INSERT INTO pinboards (title, owner, status)
        VALUES ($1, $2, 1)
        RETURNING id
        `,
        [board_title.trim(), uuid]
      );

      pinboard_id = newPinboardResult.rows[0].id;

      // Add owner as contributor
      await query(
        'general',
        `
        INSERT INTO pinboard_contributors (pinboard, participant)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING
        `,
        [pinboard_id, uuid]
      );
    }

    // Verify user has access to the pinboard
    const accessCheck = await query(
      'general',
      `
      SELECT 1
      FROM pinboards p
      WHERE p.id = $1
        AND (p.owner = $2 
             OR EXISTS (
               SELECT 1 
               FROM pinboard_contributors pc 
               WHERE pc.pinboard = p.id 
                 AND pc.participant = $2
             )
             OR $3 > 2)
      `,
      [pinboard_id, uuid, rights]
    );

    if (accessCheck.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'You do not have access to this pinboard.', status: 403 },
        { status: 403 }
      );
    }

    if (action === 'insert') {
      // Add pads to pinboard
      const values = padIds.map((pad_id) => `(${pinboard_id}, ${pad_id}, ${db_id}, true)`).join(',');
      
      await query(
        'general',
        `
        INSERT INTO pinboard_contributions (pinboard, pad, db, is_included)
        VALUES ${values}
        ON CONFLICT (pinboard, pad, db) 
        DO UPDATE SET is_included = true
        `
      );

      return NextResponse.json({
        success: true,
        status: 200,
        message: 'Pad(s) successfully added to pinboard.',
        board_id: pinboard_id,
      });
    } else if (action === 'delete') {
      // Remove pads from pinboard
      await query(
        'general',
        `
        DELETE FROM pinboard_contributions
        WHERE pinboard = $1 
          AND pad = ANY($2) 
          AND db = $3
        `,
        [pinboard_id, padIds, db_id]
      );

      return NextResponse.json({
        success: true,
        status: 200,
        message: 'Pad(s) successfully removed from pinboard.',
      });
    }

    return NextResponse.json(
      { success: false, message: 'Invalid action state.', status: 400 },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error managing pinboard pads:', error);
    return NextResponse.json(
      {
        success: false,
        status: 500,
        message: 'An error occurred while managing pinboard pads.',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
