import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/app/lib/db';
import getSession from '@/app/lib/session';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    const uuid = session?.uuid;
    const rights = session?.rights || 0;

    if (!uuid) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized access.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { id, title, description } = body;

    // Validate required fields
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Pinboard ID is required.' },
        { status: 400 }
      );
    }

    if (!title || title.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: 'Title is required.' },
        { status: 400 }
      );
    }

    // Verify user has access to update the pinboard (owner, contributor, or rights >= 3)
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
      [id, uuid, rights]
    );

    if (accessCheck.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'You do not have access to update this pinboard.' },
        { status: 403 }
      );
    }

    // Update the pinboard
    const updateResult = await query(
      'general',
      `
      UPDATE pinboards
      SET title = $1, description = $2
      WHERE id = $3
      RETURNING id, title, description, date
      `,
      [title.trim(), description?.trim() || '', id]
    );

    if (updateResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Failed to update pinboard.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Pinboard updated successfully.',
      pinboard: updateResult.rows[0],
    });
  } catch (error) {
    console.error('Error updating pinboard:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'An error occurred while updating the pinboard.',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  return POST(request);
}
