import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/app/lib/db';
import getSession from '@/app/lib/session';
import { sendEmail } from '@/app/lib/helpers';

// Helper function to get user email by UUID
async function getUserEmail(uuid: string): Promise<string | null> {
  const result = await query('general', 'SELECT email FROM users WHERE uuid = $1', [uuid]);
  return result.rows[0]?.email || null;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    const uuid = session?.uuid;
    const rights = session?.rights || 0;
    const username = session?.name || 'User';

    if (!uuid) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized access.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { pinboard_id, decision, requestor_email } = body;

    // Validate required fields
    if (!pinboard_id) {
      return NextResponse.json(
        { success: false, message: 'Board ID is required.' },
        { status: 400 }
      );
    }

    if (!decision || !['approve', 'deny'].includes(decision)) {
      return NextResponse.json(
        { success: false, message: 'Invalid or missing decision.' },
        { status: 400 }
      );
    }

    if (!requestor_email) {
      return NextResponse.json(
        { success: false, message: 'Requestor email is required.' },
        { status: 400 }
      );
    }

    // Check if the user is the owner or an existing contributor of the board
    const boardDataResult = await query(
      'general',
      `
      SELECT p.owner, p.title, array_agg(pc.participant) AS contributors
      FROM pinboards p
      LEFT JOIN pinboard_contributors pc ON pc.pinboard = p.id
      WHERE p.id = $1
      GROUP BY p.owner, p.title
      `,
      [pinboard_id]
    );

    if (boardDataResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Board not found.' },
        { status: 404 }
      );
    }

    const boardData = boardDataResult.rows[0];
    const isAuthorized =
      boardData.owner === uuid || (boardData.contributors || []).includes(uuid) || rights > 2;

    if (!isAuthorized) {
      return NextResponse.json(
        { success: false, message: 'You are not authorized to make decisions on this board.' },
        { status: 403 }
      );
    }

    const boardTitle = boardData.title;

    if (decision === 'approve') {
      // Get the UUID of the requestor using their email
      const requestorResult = await query(
        'general',
        'SELECT uuid FROM users WHERE email = $1',
        [requestor_email]
      );

      if (requestorResult.rows.length === 0) {
        return NextResponse.json(
          { success: false, message: 'Requestor is not a valid user.' },
          { status: 404 }
        );
      }

      const requestorUuid = requestorResult.rows[0].uuid;

      // Check if the user is already a collaborator
      const isAlreadyContributor = await query(
        'general',
        `
        SELECT 1
        FROM pinboard_contributors
        WHERE pinboard = $1 AND participant = $2
        `,
        [pinboard_id, requestorUuid]
      );

      if (isAlreadyContributor.rows.length > 0) {
        return NextResponse.json({
          success: true,
          message: `The user (${requestor_email}) is already a collaborator on this board.`,
        });
      }

      // Add requestor as a collaborator
      await query(
        'general',
        `
        INSERT INTO pinboard_contributors (pinboard, participant)
        VALUES ($1, $2)
        `,
        [pinboard_id, requestorUuid]
      );

      // Send email to the requester
      await sendEmail(
        requestor_email,
        null,
        `[SDG Commons] - Collaboration Approved for "${boardTitle}"`,
        `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <p>Dear User,</p>
            <p>Your request to contribute to the board <strong>"${boardTitle}"</strong> has been approved by ${username}.</p>
            <p>You now have full collaborator access to the board.</p>
            <p>Best regards,</p>
            <p>SDG Commons Team</p>
          </div>
        `
      );

      return NextResponse.json({
        success: true,
        message: `The user (${requestor_email}) has been granted collaborator access to the board.`,
      });
    } else if (decision === 'deny') {
      // Send email to the requester
      await sendEmail(
        requestor_email,
        null,
        `[SDG Commons] - Collaboration Denied for "${boardTitle}"`,
        `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <p>Dear User,</p>
            <p>Your request to contribute to the board <strong>"${boardTitle}"</strong> has been denied.</p>
            <p>If you have any questions, please contact the board owner or existing contributors for clarification.</p>
            <p>Best regards,</p>
            <p>SDG Commons Team</p>
          </div>
        `
      );

      return NextResponse.json({
        success: true,
        message: `The collaboration request from (${requestor_email}) has been denied.`,
      });
    }

    return NextResponse.json(
      { success: false, message: 'Invalid decision state.' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error processing decision:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'An error occurred while processing the decision.',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
