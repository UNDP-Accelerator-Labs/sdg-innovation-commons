import { NextRequest, NextResponse } from 'next/server';
import db from '@/app/lib/db';
import jwt from 'jsonwebtoken';
import { sendEmail } from '@/app/lib/helpers';

const { APP_SECRET, NODE_ENV } = process.env;
const LOCAL_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

if (!APP_SECRET) {
  throw new Error('APP_SECRET environment variable is required');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { status: 400, message: 'Email is required.' },
        { status: 400 }
      );
    }

    // Check if user exists
    const userQuery = `SELECT uuid, name, email FROM users WHERE email = $1`;
    const userResult = await db.query('general', userQuery, [email]);

    if (!userResult || userResult.rowCount === 0) {
      // For security, don't reveal if email exists or not
      return NextResponse.json({
        status: 200,
        message: 'If the user is found, a reset link will be sent to their email with instructions on how to reset their password.',
      });
    }

    const user = userResult.rows[0];

    // Generate JWT token for password reset
    const token = jwt.sign(
      { email, action: 'password-reset' },
      APP_SECRET as string,
      { expiresIn: '24h' }
    );

    const resetLink = NODE_ENV === 'production'
      ? `https://sdg-innovation-commons.org/reset/${token}`
      : `${LOCAL_BASE_URL}/reset/${token}`;

    const emailSubject = 'Password Reset Request - SDG Commons';
    const emailHtml = `
      <div>
        <p>Dear ${user.name || 'User'},</p>
        <br/>
        <p>We have received a request to reset your password for the SDG Commons platform.
        Please click the link below to reset your password:</p>
        <p><a href="${resetLink}">${resetLink}</a></p>
        <p>This link will expire in 24 hours.</p>
        <p>If you did not request a password reset, please ignore this email.</p>
        <br/>
        <p>Best regards,</p>
        <p>SDG Commons Team</p>
      </div>
    `;

    await sendEmail(email, undefined, emailSubject, emailHtml);

    return NextResponse.json({
      status: 200,
      message: 'Password reset link has been successfully sent to your email. Please check your inbox/spam folder.',
    });
  } catch (error) {
    console.error('Error in forgot password endpoint:', error);
    return NextResponse.json(
      {
        status: 500,
        message: 'An error occurred while processing the request.',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
