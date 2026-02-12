import { NextResponse } from 'next/server';
import { query } from '@/app/lib/db';
import getSession from '@/app/lib/session';
import { sendEmail } from '@/app/lib/helpers'

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session || (session?.rights ?? 0) < 4) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

    // return draft collections, awaiting review, and rejected collections for admin review
    const res = await query('general', `SELECT slug, title, description, main_image, sections, highlights, boards, id, creator_name, created_at, updated_at FROM collections WHERE (boards IS NULL OR array_length(boards,1) = 0) OR (highlights->> 'published' = 'false') OR (highlights->> 'status' = 'awaiting_review') OR (highlights->> 'status' = 'rejected') ORDER BY updated_at DESC`)
    return NextResponse.json(res.rows || [])
  } catch (e) {
    console.error('GET /api/admin/collections error', e)
    return NextResponse.json({ error: 'server error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || (session?.rights ?? 0) < 4) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

    const body = await req.json()
    const { slug, action, comment } = body || {}
    if (!slug || !action) return NextResponse.json({ error: 'missing fields' }, { status: 400 })
    
    // load existing collection
    const res = await query('general', 'SELECT * FROM collections WHERE slug = $1 LIMIT 1', [slug])
    const row = res.rows?.[0]
    if (!row) return NextResponse.json({ error: 'not found' }, { status: 404 })

    // update highlights: add comments array and status flags
    const highlights = row.highlights || {}
    const comments = Array.isArray(highlights.comments) ? highlights.comments : []
    if (comment?.trim()?.length > 0) comments.push({ by: session.name || session.uuid || 'admin', comment, at: new Date().toISOString() })

    if (action === 'approve') {
      highlights.published = true
      highlights.status = 'published'
      highlights.published_at = new Date().toISOString()
      // Clear awaiting_review when approved
      delete highlights.awaiting_review
    } else if (action === 'reject') {
      highlights.published = false
      highlights.status = 'rejected'
      highlights.rejected_at = new Date().toISOString()
      // Clear awaiting_review when rejected
      delete highlights.awaiting_review
    }
    if (comment?.trim()?.length > 0) highlights.comments = comments

    // update row
    await query('general', 'UPDATE collections SET highlights = $1, updated_at = NOW() WHERE slug = $2', [JSON.stringify(highlights), slug])

    // notify creator via email of action
    if(highlights?.creator_uuid) {
        try {
            const ures = await query('general', 'SELECT email FROM users WHERE uuid = $1 LIMIT 1', [highlights.creator_uuid]);
            const userEmail = ures?.rows?.[0]?.email;
            if(userEmail) {
               // Use correct English tense for different actions
               const actionPastTense = action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : action + 'd';
               const subject = `Your collection "${row.title}" has been ${actionPastTense}`;
               const statusText = action === 'approve' ? 'approved and published' : action === 'reject' ? 'rejected' : actionPastTense;
               const html = `
                <p>Hello,</p>
                <p>Your collection "${row.title}" has been ${statusText} by an admin.</p>
                ${comment?.trim() ? `<p><strong>Admin comments:</strong> ${comment}</p>` : '<p>No additional comments were provided.</p>'}
                ${action === 'approve' ? '<p>Your collection is now live and visible to all users.</p>' : ''}
                ${action === 'reject' ? '<p>You can make revisions and resubmit your collection for review.</p>' : ''}
                <p>Best regards,</p>
                <p>SDG Innovation Commons Team</p>
                `;
               sendEmail(userEmail, undefined, subject, html);
            }
        } catch(e) {
            console.warn('Failed to send notification email to collection creator', e);
        }
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('POST /api/admin/collections error', e)
    return NextResponse.json({ error: 'server error' }, { status: 500 })
  }
}