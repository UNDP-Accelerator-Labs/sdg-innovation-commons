import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/app/lib/db';
import getSession from '@/app/lib/session';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    const uuid = session?.uuid;
    const rights = session?.rights || 0;

    if (!uuid || !rights) {
      return NextResponse.json(
        { message: 'Unauthorized access.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    let { pinboard } = body;

    if (!pinboard) {
      return NextResponse.json(
        { message: 'Please provide a valid pinboard ID.' },
        { status: 400 }
      );
    }

    // Ensure pinboard is an array
    if (!Array.isArray(pinboard)) {
      pinboard = [pinboard];
    }

    // Delete contributions where the user is involved
    await query(
      'general',
      `
      DELETE FROM pinboard_contributions
      WHERE pinboard = ANY($1)
        AND pinboard IN (
          SELECT p.id
          FROM pinboards p
          LEFT JOIN pinboard_contributors pc ON pc.pinboard = p.id
          WHERE (p.owner = $2 
                 OR EXISTS (
                   SELECT 1 
                   FROM pinboard_contributors pc_sub 
                   WHERE pc_sub.pinboard = p.id 
                     AND pc_sub.participant = $2
                 )
                 OR $3 > 2)
            AND p.id = ANY($1)
        )
      `,
      [pinboard, uuid, rights]
    );

    // Delete pinboards where the user is involved
    await query(
      'general',
      `
      DELETE FROM pinboards
      WHERE id = ANY($1)
        AND (owner = $2 
             OR EXISTS (
               SELECT 1 
               FROM pinboard_contributors pc 
               WHERE pc.pinboard = id 
                 AND pc.participant = $2
             )
             OR $3 > 2)
      `,
      [pinboard, uuid, rights]
    );

    return NextResponse.json({
      success: true,
      message: 'Pinboard and related contributions deleted successfully.',
    });
  } catch (error) {
    console.error('Error deleting pinboard:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'An error occurred while deleting the pinboard.',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  return POST(request);
}
