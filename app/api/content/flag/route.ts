import { NextRequest, NextResponse } from 'next/server';
import getSession from '@/app/lib/session';
import { createNotification } from '@/app/lib/data/notifications';
import { query } from '@/app/lib/db';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await req.json();
    const { contentId, platform, contentType = 'pad', reason, description, contentTitle, contentUrl } = body;

    if (!contentId || !platform || !reason) {
      return NextResponse.json(
        { error: 'Missing required fields: contentId, platform, reason' }, 
        { status: 400 }
      );
    }

    // Validate reason is from allowed list
    const allowedReasons = [
      'inappropriate_content',
      'spam',
      'harassment',
      'misinformation',
      'copyright_violation',
      'other'
    ];

    if (!allowedReasons.includes(reason)) {
      return NextResponse.json({ error: 'Invalid reason provided' }, { status: 400 });
    }

    // Check if user has already flagged this content
    const existingFlag = await query(
      'general',
      'SELECT id FROM content_flags WHERE content_id = $1 AND platform = $2 AND reporter_uuid = $3',
      [contentId, platform, session.uuid]
    );

    if (existingFlag.rows.length > 0) {
      return NextResponse.json(
        { error: 'You have already flagged this content' },
        { status: 409 }
      );
    }

    // Insert flag record
    const flagResult = await query(
      'general',
      `INSERT INTO content_flags 
       (content_id, platform, content_type, reporter_uuid, reporter_name, reason, description, content_title, content_url, status, created_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'pending', NOW()) 
       RETURNING *`,
      [
        contentId,
        platform,
        contentType,
        session.uuid,
        session.name || 'Anonymous',
        reason,
        description || null,
        contentTitle || null,
        contentUrl || null
      ]
    );

    const flag = flagResult.rows[0];

    // Create admin notification
    try {
      const reasonText = reason.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
      await createNotification({
        type: 'content_flagged',
        level: 'action_required',
        payload: {
          subject: `Content Flagged: ${reasonText}`,
          message: `A user has flagged content for review.`,
          contentId: contentId,
          platform: platform,
          contentType: contentType,
          reason: reasonText,
          description: description || '',
          reporterName: session.name || 'Anonymous',
          reporterEmail: session.email || '',
          contentTitle: contentTitle || `${contentType} #${contentId}`,
          contentUrl: contentUrl || `/${platform}/${contentId}`,
          flagId: flag.id
        },
        related_uuids: [session.uuid],
        metadata: {
          flagId: flag.id,
          contentId: contentId,
          platform: platform,
          adminUrl: `${process.env.NODE_ENV === 'production' ? 'https://sdg-innovation-commons.org' : 'http://localhost:3000'}/admin/notifications`
        }
      });
    } catch (notificationError) {
      console.error('Failed to create admin notification for content flag:', notificationError);
      // Don't fail the request if notification creation fails
    }

    return NextResponse.json({
      success: true,
      message: 'Content has been flagged for review. An administrator will review it shortly.',
      flagId: flag.id
    });

  } catch (error) {
    console.error('Error flagging content:', error);
    return NextResponse.json(
      { error: 'Failed to flag content. Please try again.' },
      { status: 500 }
    );
  }
}

// Get flags for admin review
export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || (session.rights ?? 0) < 4) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 401 });
    }

    const url = new URL(req.url);
    const status = url.searchParams.get('status');
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '50'), 100);
    const offset = parseInt(url.searchParams.get('offset') || '0');

    let whereClause = '';
    let params: any[] = [];

    if (status) {
      whereClause = 'WHERE cf.status = $1';
      params = [status, limit, offset];
    } else {
      params = [limit, offset];
    }

    const flags = await query(
      'general',
      `SELECT 
         cf.*,
         u.name as reporter_name,
         u.email as reporter_email,
         au.name as admin_name
       FROM content_flags cf
       LEFT JOIN users u ON cf.reporter_uuid = u.uuid
       LEFT JOIN users au ON cf.admin_uuid = au.uuid
       ${whereClause}
       ORDER BY cf.created_at DESC 
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );

    return NextResponse.json({ flags: flags.rows });

  } catch (error) {
    console.error('Error fetching content flags:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content flags' },
      { status: 500 }
    );
  }
}
