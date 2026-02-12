import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import db from '@/app/lib/db';
import jwt from 'jsonwebtoken';
import { sendEmail } from '@/app/lib/helpers';

function verifyTokenFields(decoded: any): boolean {
  const { email, action, uuid, name } = decoded;
  return !!(email && uuid && name && action === 'confirm-email');
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { APP_SECRET } = process.env;
  
  if (!APP_SECRET) {
    return NextResponse.json(
      { status: 500, message: 'Server configuration error: APP_SECRET not configured' },
      { status: 500 }
    );
  }

  try {
    const { token } = await params;

    // Verify token
    let decoded: any;
    try {
      decoded = jwt.verify(token, APP_SECRET as string);
    } catch (error) {
      return NextResponse.json(
        { status: 401, message: 'Invalid or expired token.' },
        { status: 401 }
      );
    }

    if (!verifyTokenFields(decoded)) {
      return NextResponse.json(
        { status: 401, message: 'Invalid token fields.' },
        { status: 401 }
      );
    }

    const { email, uuid, name, old_email } = decoded;

    const client = await db.getClient('general');
    try {
      await client.query('BEGIN');

      // Update user email
      await client.query(
        `UPDATE users SET email = $1 WHERE uuid = $2`,
        [email, uuid]
      );

      // Delete all sessions for this user
      await client.query(
        `DELETE FROM session WHERE sess->>'uuid' = $1`,
        [uuid]
      );

      await client.query('COMMIT');

      // Send notification to old email
      const emailSubject = 'Email Address Update Notification - SDG Commons';
      const emailHtml = `
        <div>
          <p>Dear ${name},</p>
          <br/>
          <p>We are writing to inform you that your email address has been updated for the SDG Commons platform.</p>
          <p>If you made this change, please disregard this notification.</p>
          <p>However, if you did not authorize this change, please contact our support team immediately.</p>
          <br/>
          <p>Best regards,</p>
          <p>SDG Commons Team</p>
        </div>
      `;
      await sendEmail(old_email, undefined, emailSubject, emailHtml);

      // Delete all sessions for this user from the database
      await client.query(
        `DELETE FROM session WHERE sess::jsonb->>'user_uuid' = $1`,
        [decoded.uuid]
      );

      // Force logout by deleting NextAuth session cookies
      const cookieStore = await cookies();
      
      // Delete all possible NextAuth cookie variants
      const cookieNames = [
        'next-auth.session-token',
        '__Secure-next-auth.session-token',
        'authjs.session-token',
        '__Secure-authjs.session-token',
      ];
      
      for (const name of cookieNames) {
        cookieStore.delete(name);
      }

      return NextResponse.json({
        status: 200,
        success: true,
        message: 'Email changed successfully. Please log in again with your new email address.',
      });

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Error confirming email:', error);
    return NextResponse.json(
      {
        status: 500,
        message: 'Error updating email address. Please try again later.',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
