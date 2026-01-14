import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/app/lib/db';
import getSession from '@/app/lib/session';

export async function GET(request: NextRequest) {
  return handlePublish(request);
}

export async function POST(request: NextRequest) {
  return handlePublish(request);
}

async function handlePublish(request: NextRequest) {
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

    // Get parameters from query string or body
    const searchParams = request.nextUrl.searchParams;
    let id: string | null = null;
    let status: string | null = null;

    if (request.method === 'GET') {
      id = searchParams.get('id');
      status = searchParams.get('status');
    } else {
      const body = await request.json().catch(() => ({}));
      id = body.id;
      status = body.status;
    }

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Pinboard ID is required.' },
        { status: 400 }
      );
    }

    if (!status) {
      return NextResponse.json(
        { success: false, message: 'Status is required.' },
        { status: 400 }
      );
    }

    const pinboardId = parseInt(id);
    const newStatus = parseInt(status);

    if (isNaN(pinboardId) || isNaN(newStatus)) {
      return NextResponse.json(
        { success: false, message: 'Invalid ID or status.' },
        { status: 400 }
      );
    }

    // Verify user has access to publish the pinboard
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
      [pinboardId, uuid, rights]
    );

    if (accessCheck.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'You do not have permission to publish this pinboard.' },
        { status: 403 }
      );
    }

    // Update the pinboard status
    const updateResult = await query(
      'general',
      `
      UPDATE pinboards
      SET status = $1
      WHERE id = $2
      RETURNING id, status
      `,
      [newStatus, pinboardId]
    );

    if (updateResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Failed to update pinboard status.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: newStatus >= 3 ? 'Pinboard published successfully.' : 'Pinboard unpublished successfully.',
      status: 200,
      data: updateResult.rows[0],
    });
  } catch (error) {
    console.error('Error publishing/unpublishing pinboard:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'An error occurred while updating the pinboard status.',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
