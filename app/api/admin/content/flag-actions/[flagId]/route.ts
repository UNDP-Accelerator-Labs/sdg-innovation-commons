import { NextRequest, NextResponse } from 'next/server';
import getSession from '@/app/lib/session';
import { query } from '@/app/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ flagId: string }> }
) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check if user is admin (using rights level)
    if ((session.rights ?? 0) < 4) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { flagId } = await params;

    if (!flagId || isNaN(Number(flagId))) {
      return NextResponse.json(
        { error: 'Valid flag ID is required' },
        { status: 400 }
      );
    }

    // Verify the flag exists
    const flagCheckQuery = `
      SELECT id FROM content_flags WHERE id = $1
    `;
    const flagCheck = await query('general', flagCheckQuery, [flagId]);
    
    if (flagCheck.rows.length === 0) {
      return NextResponse.json(
        { error: 'Flag not found' },
        { status: 404 }
      );
    }

    // Fetch all actions for this flag
    const actionsQuery = `
      SELECT 
        cfa.id,
        cfa.action_type,
        cfa.admin_response,
        cfa.previous_status,
        cfa.new_status,
        cfa.created_at,
        u.name as admin_name,
        u.email as admin_email
      FROM content_flag_actions cfa
      LEFT JOIN users u ON cfa.admin_uuid = u.uuid
      WHERE cfa.flag_id = $1
      ORDER BY cfa.created_at ASC
    `;

    const actionsResult = await query('general', actionsQuery, [flagId]);
    
    return NextResponse.json({
      success: true,
      actions: actionsResult.rows,
      total: actionsResult.rows.length
    });

  } catch (error) {
    console.error('Failed to fetch flag actions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
