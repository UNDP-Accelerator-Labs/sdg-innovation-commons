import { NextRequest, NextResponse } from 'next/server';
import { getApiAuth } from '@/app/lib/helpers/api-auth';
import { query as dbQuery } from '@/app/lib/db';
import { sendEmail } from '@/app/lib/helpers';
import { LOCAL_BASE_URL, commonsPlatform } from '@/app/lib/helpers/utils';

const { ADMIN_EMAILS } = process.env;

export async function POST(request: NextRequest) {
  try {
    const authResult = await getApiAuth(request);
    
    if (!authResult.isAuthenticated || !authResult.uuid) {
      return NextResponse.json(
        { status: 400, message: 'You need to be logged in to engage with content.' },
        { status: 400 }
      );
    }

    const { uuid } = authResult;
    const body = await request.json();
    const { object, id, message, source, action = 'add', comment_id } = body;

    // Handle delete action
    if (action === 'delete') {
      if (!comment_id) {
        return NextResponse.json(
          { status: 400, message: 'Comment ID is required for deletion.' },
          { status: 400 }
        );
      }

      try {
        // Recursively delete all child comments first, then the parent
        // Using a recursive CTE to find all descendants
        await dbQuery(
          'general',
          `WITH RECURSIVE comment_tree AS (
            -- Base case: the comment to delete
            SELECT id FROM comments WHERE id = $1 AND contributor = $2
            UNION ALL
            -- Recursive case: all children of comments in the tree
            SELECT c.id FROM comments c
            INNER JOIN comment_tree ct ON c.source = ct.id
          )
          DELETE FROM comments WHERE id IN (SELECT id FROM comment_tree)`,
          [comment_id, uuid]
        );

        return NextResponse.json({ 
          status: 200, 
          message: 'Comment deleted successfully.' 
        });
      } catch (err) {
        console.error('Error deleting comment:', err);
        return NextResponse.json(
          { status: 500, message: 'An unexpected error occurred.' },
          { status: 500 }
        );
      }
    }

    // Handle add action
    if (!object || !id || !message) {
      return NextResponse.json(
        { status: 400, message: 'Missing required fields: object, id, and message are required.' },
        { status: 400 }
      );
    }

    try {
      // Insert comment and get the owner information
      const result = await dbQuery(
        'general',
        `WITH inserted_comment AS (
          INSERT INTO comments (contributor, doctype, docid, message, source)
          VALUES ($1, $2, $3::INT, $4, $5)
          RETURNING doctype, docid, contributor, source
        )
        SELECT 
          COALESCE(
            (SELECT c.contributor FROM comments c WHERE c.id = ic.source),
            p.owner
          ) AS owner
        FROM inserted_comment ic
        LEFT JOIN pads p ON ic.doctype = 'pad' AND p.id = ic.docid`,
        [uuid, object, id, message, source || null]
      );

      if (!result?.rows || result.rows.length === 0) {
        return NextResponse.json(
          { status: 404, message: 'No data returned from the query.' },
          { status: 404 }
        );
      }

      const ownerId = result.rows[0]?.owner;

      // Don't send email if user is commenting on their own content
      if (uuid === ownerId) {
        return NextResponse.json({ 
          status: 200, 
          message: 'Comment added successfully.' 
        });
      }

      // Get owner information for email notification
      const ownerInfo = await dbQuery(
        'general',
        `SELECT name, email FROM users WHERE uuid = $1`,
        [ownerId]
      );

      if (ownerInfo?.rows && ownerInfo.rows.length > 0 && ownerInfo.rows[0].email) {
        const owner = ownerInfo.rows[0];
        
        // Determine the platform base URL for the link
        const platformKey = object === 'pad' ? 'solution' : object;
        const platformInfo = commonsPlatform.find(p => p.key === platformKey || p.shortkey === platformKey);
        
        // Create link to the content with comments section
        let link = `${LOCAL_BASE_URL}/pads/${platformKey}/${id}#comments`;
        
        // If platform has external URL, use it
        if (platformInfo?.url && !platformInfo.url.includes('localhost')) {
          link = `${platformInfo.url}/en/view/pad?id=${id}`;
        }

        // Send email notification
        try {
          await sendEmail(
            owner.email,
            ADMIN_EMAILS || null,
            '[SDG Commons] - New Comment on Your Content',
            `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
              <p>Dear ${owner.name || 'User'},</p>
              <p>You have received a new comment on your content:</p>
              <p><strong>Comment:</strong> "${message}"</p>
              <p>You can view the comment and reply to it by clicking the link below:</p>
              <p><a href="${link}" style="color: #1a73e8;">View Comment</a></p>
              <br/>
              <p>Best regards,</p>
              <p>UNDP Accelerator Labs Team</p>
            </div>
            `
          );
        } catch (emailError) {
          console.error('Error sending email notification:', emailError);
          // Don't fail the request if email fails
        }
      }

      return NextResponse.json({ 
        status: 200, 
        message: 'Comment added successfully.' 
      });

    } catch (err) {
      console.error('Error adding comment:', err);
      return NextResponse.json(
        { status: 500, message: 'An unexpected error occurred.' },
        { status: 500 }
      );
    }

  } catch (err) {
    console.error('Error in comment endpoint:', err);
    return NextResponse.json(
      { status: 500, message: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
