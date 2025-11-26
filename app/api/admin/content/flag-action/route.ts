import { NextRequest, NextResponse } from 'next/server';
import getSession from '@/app/lib/session';
import { query } from '@/app/lib/db';
import { sendEmail } from '@/app/lib/helper';
import { removeFromNLPIndex, updateContentRelevance } from '@/app/lib/data/nlp-api';

// Helper function to determine content table name based on platform and content type
function getContentTableName(platform: string, contentType: string): string | null {
  // Map platform and content type to database table names
  // For blogs and publications, use 'articles' table
  if (platform.includes('blog') || platform.includes('publication')) {
    return 'articles';
  }
  
  // For solutions, experiments, and learning plans, use 'pads' table
  if (platform.includes('solutions') || platform.includes('experiment') || platform.includes('learningplan')) {
    return 'pads';
  }
  
  // Fallback for any other platforms
  return null;
}

export async function POST(request: NextRequest) {
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

    const { flagId, action, adminResponse } = await request.json();

    if (!flagId || !action) {
      return NextResponse.json(
        { error: 'Flag ID and action are required' },
        { status: 400 }
      );
    }

    if (!['dismiss', 'resolve', 'respond', 'remove', 'reopen'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be dismiss, resolve, respond, remove, or reopen' },
        { status: 400 }
      );
    }

    if ((action === 'respond' || action === 'remove') && !adminResponse?.trim()) {
      return NextResponse.json(
        { error: `Admin response is required for ${action} action` },
        { status: 400 }
      );
    }

    // Get the original flag details including reporter information
    const flagQuery = `
      SELECT cf.*, u.name as reporter_name, u.email as reporter_email
      FROM content_flags cf
      JOIN users u ON cf.reporter_uuid = u.uuid
      WHERE cf.id = $1 AND cf.action_type = 'flag'
    `;
    const flagResult = await query('general', flagQuery, [flagId]);
    
    if (flagResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Original flag not found' },
        { status: 404 }
      );
    }

    const originalFlag = flagResult.rows[0];

    // Determine the new status based on action
    let newStatus: string;
    switch (action) {
      case 'dismiss':
        newStatus = 'dismissed';
        break;
      case 'resolve':
        newStatus = 'resolved';
        break;
      case 'respond':
        newStatus = 'reviewed';
        break;
      case 'remove':
        newStatus = 'resolved'; // Content removed - flag resolved
        break;
      case 'reopen':
        newStatus = 'pending'; // Reopen for review
        break;
      default:
        newStatus = 'reviewed';
    }

    // Get current status for audit trail
    const currentStatus = originalFlag.status;

    // Update the original flag status
    const updateQuery = `
      UPDATE content_flags
      SET 
        status = $1,
        admin_uuid = $2,
        reviewed_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *
    `;
    
    const updateResult = await query('general', updateQuery, [
      newStatus,
      session.uuid,
      flagId
    ]);

    const updatedFlag = updateResult.rows[0];

    // Create admin action record
    const actionQuery = `
      INSERT INTO content_flags (
        content_id, platform, content_type, content_title, content_url,
        action_type, status, admin_response, admin_uuid, admin_name,
        parent_flag_id, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *
    `;
    
    const actionResult = await query('general', actionQuery, [
      originalFlag.content_id,
      originalFlag.platform,
      originalFlag.content_type,
      originalFlag.content_title,
      originalFlag.content_url,
      action,
      newStatus,
      adminResponse?.trim() || null,
      session.uuid,
      session.name || null,
      flagId
    ]);

    const actionRecord = actionResult.rows[0];

    // Handle content removal if action is 'remove'
    if (action === 'remove') {
      let contentRemovalResults = {
        dbUpdate: false,
        nlpRemoval: false,
        relevanceUpdate: false,
        errors: [] as string[]
      };

      try {
        // Update content status to 0 (hidden) in database
        const contentTable = getContentTableName(originalFlag.platform, originalFlag.content_type);
        if (contentTable) {
          // Update database status
          const updateContentQuery = `
            UPDATE ${contentTable}
            SET status = 0, updated_at = CURRENT_TIMESTAMP
            WHERE id = $1
          `;
          await query('general', updateContentQuery, [originalFlag.content_id]);
          contentRemovalResults.dbUpdate = true;
          console.log(`Database status updated: ${originalFlag.platform}/${originalFlag.content_id}`);

          // Set relevance to 1 for blogs and publications
          if (originalFlag.platform.includes('blog') || originalFlag.platform.includes('publication')) {
            try {
              const updateRelevanceQuery = `
                UPDATE ${contentTable}
                SET relevance = 1, updated_at = CURRENT_TIMESTAMP
                WHERE id = $1
              `;
              // Use blogs database for blog/publication content
              await query('blogs', updateRelevanceQuery, [originalFlag.content_id]);
              contentRemovalResults.relevanceUpdate = true;
              console.log(`Database relevance updated to 1 in blogs DB: ${originalFlag.platform}/${originalFlag.content_id}`);
            } catch (relevanceError) {
              console.error('Failed to update relevance in blogs database:', relevanceError);
              contentRemovalResults.errors.push(`Blogs database relevance update failed: ${relevanceError instanceof Error ? relevanceError.message : 'Unknown error'}`);
            }
          }

          // Remove from NLP indexes
          try {
            const nlpResult = await removeFromNLPIndex({
              platform: originalFlag.platform,
              contentId: originalFlag.content_id.toString()
            });
            
            contentRemovalResults.nlpRemoval = nlpResult.success;
            if (nlpResult.error) {
              contentRemovalResults.errors.push(nlpResult.error);
            }
            console.log(`NLP removal result:`, nlpResult);

            // Update relevance in NLP for applicable content types
            if (originalFlag.platform.includes('blog') || originalFlag.platform.includes('publication')) {
              try {
                const relevanceResult = await updateContentRelevance({
                  platform: originalFlag.platform,
                  contentId: originalFlag.content_id.toString()
                });
                
                if (relevanceResult.error) {
                  contentRemovalResults.errors.push(relevanceResult.error);
                }
                console.log(`NLP relevance update result:`, relevanceResult);
              } catch (nlpRelevanceError) {
                console.error('Failed to update NLP relevance:', nlpRelevanceError);
                contentRemovalResults.errors.push(`NLP relevance update failed: ${nlpRelevanceError instanceof Error ? nlpRelevanceError.message : 'Unknown error'}`);
              }
            }

          } catch (nlpError) {
            console.error('Failed to remove from NLP index:', nlpError);
            contentRemovalResults.errors.push(`NLP removal failed: ${nlpError instanceof Error ? nlpError.message : 'Unknown error'}`);
          }

          // Log summary of content removal
          console.log(`Content removal summary for ${originalFlag.platform}/${originalFlag.content_id}:`, {
            dbUpdate: contentRemovalResults.dbUpdate,
            nlpRemoval: contentRemovalResults.nlpRemoval,
            relevanceUpdate: contentRemovalResults.relevanceUpdate,
            errorCount: contentRemovalResults.errors.length,
            errors: contentRemovalResults.errors
          });
        }
      } catch (contentError) {
        console.error('Failed to remove content:', contentError);
        contentRemovalResults.errors.push(`Content removal failed: ${contentError instanceof Error ? contentError.message : 'Unknown error'}`);
        // Don't fail the entire operation if content removal fails
        // The flag status is still updated
      }
    }

    // Send email notification to reporter if there's a response, resolution, or removal
    if ((action === 'respond' || action === 'remove' || (action === 'resolve' && adminResponse?.trim())) && originalFlag.reporter_email) {
      try {
        const subject = action === 'respond' 
          ? 'Response to Your Content Report'
          : action === 'remove'
          ? 'Content Removed Following Your Report'
          : 'Content Report Resolved';

        const htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Update on Your Content Report</h2>
            
            <p>Hello ${originalFlag.reporter_name || 'there'},</p>
            
            <p>Thank you for reporting content on the SDG Innovation Commons. We wanted to update you on your report:</p>
            
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p><strong>Content:</strong> ${originalFlag.content_title || `${originalFlag.content_type} #${originalFlag.content_id}`}</p>
              <p><strong>Platform:</strong> ${originalFlag.platform}</p>
              <p><strong>Your Report:</strong> ${originalFlag.reason.replace(/_/g, ' ')}</p>
              ${originalFlag.description ? `<p><strong>Description:</strong> ${originalFlag.description}</p>` : ''}
            </div>
            
            <h3 style="color: #333;">${action === 'remove' ? 'Content Removal Notice:' : 'Administrator Response:'}</h3>
            <div style="background-color: ${action === 'remove' ? '#fee2e2' : '#e3f2fd'}; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p>${adminResponse}</p>
            </div>
            
            ${action === 'remove' ? `
              <div style="background-color: #fef3cd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #f59e0b;">
                <p><strong>Action Taken:</strong> The reported content has been removed from public display and will no longer appear in search results.</p>
              </div>
            ` : action === 'resolve' ? `
              <p>This report has been marked as resolved. If you have any additional concerns, please don't hesitate to contact us.</p>
            ` : `
              <p>If you have any questions or concerns about this response, please feel free to reach out to our support team.</p>
            `}
            
            <p>Thank you for helping us maintain a safe and productive community.</p>
            
            <p>Best regards,<br>The SDG Innovation Commons Team</p>
          </div>
        `;

        await sendEmail(
          originalFlag.reporter_email,
          undefined,
          subject,
          htmlContent
        );
      } catch (emailError) {
        console.error('Failed to send notification email:', emailError);
        // Don't fail the entire operation if email fails
      }
    }

    return NextResponse.json({
      success: true,
      flag: updatedFlag,
      message: `Flag ${action}${action.endsWith('e') ? 'd' : 'ed'} successfully`
    });

  } catch (error) {
    console.error('Flag action error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
