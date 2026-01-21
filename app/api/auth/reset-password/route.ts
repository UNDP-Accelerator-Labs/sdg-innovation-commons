import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import db from '@/app/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { isPasswordSecure } from '@/app/lib/helpers/utils';

export async function POST(request: NextRequest) {
  const { APP_SECRET } = process.env;
  
  if (!APP_SECRET) {
    return NextResponse.json(
      { status: 500, message: 'Server configuration error: APP_SECRET not configured' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { password, confirmPassword, token } = body;

    if (!password || !confirmPassword || !token) {
      return NextResponse.json(
        { status: 400, message: 'Password, confirm password, and token are required.' },
        { status: 400 }
      );
    }

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

    const { email, action } = decoded;
    if (!email || action !== 'password-reset') {
      return NextResponse.json(
        { status: 401, message: 'Invalid token.' },
        { status: 401 }
      );
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return NextResponse.json(
        { status: 400, message: 'Password and confirm password do not match.' },
        { status: 400 }
      );
    }

    // Validate password security
    const passwordErrors = isPasswordSecure(password);
    if (passwordErrors.length > 0) {
      return NextResponse.json(
        { status: 400, message: passwordErrors.join('\n') },
        { status: 400 }
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password in database
    const client = await db.getClient('general');
    try {
      await client.query('BEGIN');

      await client.query(
        `UPDATE users 
         SET password = $1,
             confirmed_at = COALESCE(confirmed_at, NOW()),
             confirmed = TRUE
         WHERE email = $2`,
        [hashedPassword, email]
      );

      // Delete all sessions for this user from the database
      await client.query(
        `DELETE FROM session WHERE sess::jsonb->>'user_email' = $1`,
        [email]
      );

      await client.query('COMMIT');

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
        message: 'Password has been successfully updated. Please log in with your new password.',
      });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error resetting password:', error);
    return NextResponse.json(
      {
        status: 500,
        message: 'An error occurred while resetting password.',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
