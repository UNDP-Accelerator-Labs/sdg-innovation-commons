import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

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
