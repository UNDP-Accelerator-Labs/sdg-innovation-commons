import { NextRequest, NextResponse } from 'next/server';
import db from '@/app/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password, id } = body;

    if (!password || !id) {
      return NextResponse.json(
        { status: 400, message: 'Password and user ID are required.' },
        { status: 400 }
      );
    }

    // Check if id is a UUID (contains hyphens) or integer
    const isUUID = typeof id === 'string' && id.includes('-');
    
    // Get user's hashed password
    const userQuery = isUUID 
      ? `SELECT password FROM users WHERE uuid = $1`
      : `SELECT password FROM users WHERE id = $1`;
    const userResult = await db.query('general', userQuery, [id]);

    if (!userResult || userResult.rowCount === 0) {
      return NextResponse.json(
        { status: 404, message: 'User not found.' },
        { status: 404 }
      );
    }

    const hashedPassword = userResult.rows[0].password;
    const passwordMatch = await bcrypt.compare(password, hashedPassword);

    if (!passwordMatch) {
      return NextResponse.json(
        { status: 401, message: 'Incorrect password.' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      status: 200,
      message: 'Password verified successfully.',
    });
  } catch (error) {
    console.error('Error checking password:', error);
    return NextResponse.json(
      {
        status: 500,
        message: 'An error occurred while checking password.',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
