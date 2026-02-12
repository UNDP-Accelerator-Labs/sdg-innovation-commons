import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSession } from '@/app/lib/session';
import db from '@/app/lib/db';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session?.uuid) {
      return NextResponse.json(
        { status: 401, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Delete session from database using user UUID
    try {
      await db.query(
        'general',
        `DELETE FROM session WHERE sess::jsonb->>'user_uuid' = $1`,
        [session.uuid]
      );
      console.log(`Deleted all sessions for user ${session.uuid}`);
    } catch (error) {
      console.error('Error deleting session from database:', error);
    }

    // Delete NextAuth cookies
    const cookieStore = await cookies();
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
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('Error during logout:', error);
    return NextResponse.json(
      { status: 500, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
