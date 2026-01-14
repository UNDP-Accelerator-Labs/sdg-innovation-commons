import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const user = session?.user;

    if (!user || !user.uuid) {
      return NextResponse.json(
        {
          status: 401,
          success: false,
          message: 'Unauthorized access. Please log in.',
        },
        { status: 401 }
      );
    }

    return NextResponse.json({
      status: 200,
      success: true,
      message: 'Session is valid.',
      session: user,
    });
  } catch (error) {
    console.error('Error validating session:', error);
    return NextResponse.json(
      {
        status: 500,
        success: false,
        message: 'An error occurred while validating the session.',
      },
      { status: 500 }
    );
  }
}
