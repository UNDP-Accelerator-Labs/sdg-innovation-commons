import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const { APP_SECRET } = process.env;

if (!APP_SECRET) {
  throw new Error('APP_SECRET environment variable is required');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { status: 400, message: 'Token is required.' },
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

    return NextResponse.json({
      status: 200,
      message: 'Token is valid.',
      data: { email },
    });
  } catch (error) {
    console.error('Error validating token:', error);
    return NextResponse.json(
      {
        status: 500,
        message: 'An error occurred while validating token.',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
