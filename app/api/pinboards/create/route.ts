import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/app/lib/db';
import getSession from '@/app/lib/session';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    const uuid = session?.uuid;

    if (!uuid) {
      return NextResponse.json(
        { message: 'Unauthorized access.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      mobilization,
      status = 1,
      display_filters = false,
      display_map = false,
      display_fullscreen = false,
      slideshow = false,
    } = body;

    // Validate required fields
    if (!title || title.trim().length === 0) {
      return NextResponse.json(
        { message: 'Title is required.' },
        { status: 400 }
      );
    }

    // Insert new pinboard or get existing one
    const pinboardResult = await query(
      'general',
      `
      INSERT INTO pinboards (title, owner, description, status, display_filters, display_map, display_fullscreen, slideshow, mobilization)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT ON CONSTRAINT unique_pinboard_owner
        DO NOTHING
      RETURNING id, title, description, date
      `,
      [title, uuid, description, status, display_filters, display_map, display_fullscreen, slideshow, mobilization]
    );

    let pinboard;
    if (pinboardResult.rows.length > 0) {
      pinboard = pinboardResult.rows[0];
    } else {
      // Get existing pinboard
      const existingResult = await query(
        'general',
        `
        SELECT id, title, description, date
        FROM pinboards
        WHERE title = $1 AND owner = $2
        `,
        [title, uuid]
      );
      pinboard = existingResult.rows[0];
    }

    if (!pinboard) {
      return NextResponse.json(
        { message: 'Failed to create or retrieve pinboard.' },
        { status: 500 }
      );
    }

    // Add the owner as a contributor
    await query(
      'general',
      `
      INSERT INTO pinboard_contributors (pinboard, participant)
      VALUES ($1, $2)
      ON CONFLICT DO NOTHING
      `,
      [pinboard.id, uuid]
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Board created successfully.',
        pinboard,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating pinboard:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'An error occurred while creating the board.',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
