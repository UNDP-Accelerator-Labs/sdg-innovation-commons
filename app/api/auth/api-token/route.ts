import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import jwt from 'jsonwebtoken';

const { APP_SECRET } = process.env;

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.uuid) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { uuid, email, name, rights } = session.user;

    // Generate JWT token for API access
    const token = jwt.sign(
      {
        uuid,
        email,
        name,
        rights: rights || 1,
        type: 'api_access',
      },
      APP_SECRET || 'fallback-secret-key',
      { expiresIn: '365d' } // 365 days expiration
    );

    return NextResponse.json({
      token,
      expiresIn: '365 days',
      user: {
        uuid,
        email,
        name,
        rights: rights || 1,
      },
    });
  } catch (error) {
    console.error('Error generating API token:', error);
    return NextResponse.json(
      { error: 'Failed to generate API token' },
      { status: 500 }
    );
  }
}
