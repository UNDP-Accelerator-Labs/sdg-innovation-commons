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
    const email = session?.email;

    if (!uuid) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized access.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { pinboard_id } = body;

    // Validate required fields
    if (!pinboard_id) {
      return NextResponse.json(
        { success: false, message: 'Board id is required.' },
        { status: 400 }
      );
    }

    // Super users don't need to request collaboration
    if (rights > 2) {
      return NextResponse.json({
        success: true,
        message: 'You are already a collaborator or owner of this board.',
      });
    }

    // Check if the user is already a collaborator or owner
    const existingCollaboration = await query(
      'general',
      `
      SELECT 1
      FROM pinboards p
      LEFT JOIN pinboard_contributors pc ON pc.pinboard = p.id
      WHERE p.id = $1
        AND (p.owner = $2 OR pc.participant = $2)
      `,
      [pinboard_id, uuid]
    );

    if (existingCollaboration.rows.length > 0) {
      return NextResponse.json({
        success: true,
        message: 'You are already a collaborator or owner of this board.',
      });
    }

    // Get board data
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
    const ownerEmail = await getUserEmail(boardData.owner);
    
    if (!ownerEmail) {
      return NextResponse.json(
        { success: false, message: 'Board owner not found.' },
        { status: 404 }
      );
    }

    // Get contributor emails
    const contributorEmails: string[] = [];
    if (boardData.contributors && boardData.contributors.length > 0) {
      for (const contributorUuid of boardData.contributors) {
        if (contributorUuid) {
          const contributorEmail = await getUserEmail(contributorUuid);
          if (contributorEmail) {
            contributorEmails.push(contributorEmail);
          }
        }
      }
    }

    const boardLink = `https://sdg-innovation-commons.org/boards/all/${pinboard_id}?share=${email}`;
    const boardTitle = boardData.title;

    // Send email to the board owner and contributors
    await sendEmail(
      ownerEmail,
      contributorEmails.length > 0 ? contributorEmails.join(', ') : null,
      `[SDG Commons] - Collaboration Request for the "${boardTitle}" board`,
      `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <p>Dear Contributor,</p>
          <p>You have received a new collaboration request for the board <strong>"${boardTitle}"</strong> from ${username}.</p>
          <p>Please review the request and consider adding ${username} as a new contributor.</p>
          <p>To review and manage this, click <a href="${boardLink}">here</a> to visit the board.</p>
          <p>If you wish to grant ${username} access, you can share the board directly from the interface.</p>
          <p>Best regards,</p>
          <p>SDG Commons Team</p>
        </div>
      `
    );

    // Send a notification to the requester
    if (email) {
      await sendEmail(
        email,
        null,
        `[SDG Commons] - Your request to contribute to the "${boardTitle}" board`,
        `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <p>Dear ${username},</p>
            <p>Your request to contribute to the board <strong>"${boardTitle}"</strong> has been sent to the owner and contributors for review.</p>
            <p>You will be notified once a decision is made.</p>
            <p>Best regards,</p>
            <p>UNDP Accelerator Labs Team</p>
          </div>
        `
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Collaboration request sent successfully.',
    });
  } catch (error) {
    console.error('Error processing collaboration request:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'An error occurred while sending the collaboration request.',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
