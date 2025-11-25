import { NextRequest, NextResponse } from 'next/server';
import getSession from '@/app/lib/session';
import { query } from '@/app/lib/db';

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const flagId = searchParams.get('flagId');

    if (!flagId) {
      return NextResponse.json(
        { error: 'Flag ID is required' },
        { status: 400 }
      );
    }

    // Get all actions for this flag (original flag + admin actions)
    const actionsQuery = `
      SELECT 
        cf.*,
        u.name as admin_name,
        CASE 
          WHEN cf.action_type = 'flag' THEN ru.name
          ELSE u.name
        END as actor_name,
        CASE
          WHEN cf.action_type = 'flag' THEN 'reporter'
          ELSE 'admin'
        END as actor_type
      FROM content_flags cf
      LEFT JOIN users u ON cf.admin_uuid = u.uuid
      LEFT JOIN users ru ON cf.reporter_uuid = ru.uuid
      WHERE cf.id = $1 OR cf.parent_flag_id = $1
      ORDER BY cf.created_at ASC
    `;

    const actionsResult = await query('general', actionsQuery, [flagId]);
    const actions = actionsResult.rows || [];

    if (actions.length === 0) {
      return NextResponse.json(
        { error: 'Flag not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      actions
    });

  } catch (error) {
    console.error('Flag actions fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
