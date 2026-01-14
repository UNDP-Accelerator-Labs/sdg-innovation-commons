'use server';

import { LOCAL_BASE_URL, escapeHtml } from '@/app/lib/helpers/utils';
import { sendEmail } from '@/app/lib/helpers';
import { query as dbQuery } from '@/app/lib/db';
import { getContributorInfo } from '@/app/lib/data/contributors';

const { ADMIN_EMAILS, SMTP_USER, SMTP_HOST, SMTP_SERVICE, NODE_ENV } = process.env;

/**
 * Persist an admin-facing notification into the notifications table.
 * level: 'info' | 'action_required'
 * payload: arbitrary JSONB describing the event
 */
export async function createNotification(opts: {
  type: string;
  level?: 'info' | 'action_required';
  payload: any;
  related_uuids?: string[];
  metadata?: any;
  expires_at?: string | null;
  actor_uuid?: string | null;
}) {
  const {
    type,
    level = 'info',
    payload,
    related_uuids = [],
    metadata = null,
    expires_at = null,
    actor_uuid = null,
  } = opts;

  const sql = `INSERT INTO notifications (type, level, payload, related_uuids, metadata, expires_at, actor_uuid) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`;
  const vals = [type, level, payload, related_uuids, metadata, expires_at, actor_uuid];
  const res = await dbQuery('general' as any, sql, vals);
  const created = res.rows?.[0] || null;

  // If this notification requires action, send a one-line alert to configured admin emails
  if (created && level === 'action_required') {
    try {
      const adminListRaw = ADMIN_EMAILS || process.env.ADMIN_EMAILS || '';
      const adminEmails = adminListRaw.split(/[;,\s]+/).map((e: string) => e.trim()).filter(Boolean);
      if (adminEmails.length > 0) {

        const ADMIN_UI_BASE = NODE_ENV === 'production' ? 'https://sdg-innovation-commons.org' : (LOCAL_BASE_URL || 'http://localhost:3000');
        const notifUrl = `${ADMIN_UI_BASE}/admin/notifications?id=${encodeURIComponent(created.id)}`;
        const subject = `Action required: ${created.type}`;

        // Build plain-text fallback and HTML body with payload expansion
        const createdAt = created.created_at ? new Date(created.created_at).toLocaleString() : 'Unknown time';

        // Expand payload fields into lines for text and rows for HTML
        const payloadObj = created.payload && typeof created.payload === 'object' ? created.payload : { message: String(created.payload || '') };
        const payloadEntries = Object.keys(payloadObj).map((k) => ({ key: k, value: payloadObj[k] }));

        const textLines = [];
        textLines.push(`Notification type: ${created.type}`);
        textLines.push(`Created at: ${createdAt}`);
        if (payloadEntries.length > 0) {
          textLines.push('');
          textLines.push('Details:');
          payloadEntries.forEach((e) => {
            let v = e.value;
            if (typeof v === 'object') v = JSON.stringify(v);
            textLines.push(`${e.key}: ${v}`);
          });
        }
        textLines.push('');
        textLines.push(`Open the notification in the admin UI: ${notifUrl}`);

        // Simple inlined HTML template (responsive enough for common email clients)
        const htmlRows = await Promise.all(payloadEntries.map(async (e) => {
          const v = (typeof e.value === 'object') ? 
            `<pre style="white-space:pre-wrap;margin:0">${await escapeHtml(JSON.stringify(e.value, null, 2))}</pre>` : 
            await escapeHtml(String(e.value));
          return `
            <tr>
              <td style="padding:8px 12px;border-top:1px solid #e6e6e6;font-weight:600;color:#374151">${await escapeHtml(e.key)}</td>
              <td style="padding:8px 12px;border-top:1px solid #e6e6e6;color:#374151">${v}</td>
            </tr>`;
        }));
        const htmlRowsJoined = htmlRows.join('\n');

        const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${await escapeHtml(subject)}</title>
  </head>
  <body style="font-family:system-ui,-apple-system,Segoe UI,Roboto,'Helvetica Neue',Arial;line-height:1.4;margin:0;background:#f7fafc;color:#111827;">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td align="center" style="padding:24px 12px;">
          <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e5e7eb;">
            <tr>
              <td style="padding:20px 24px;background:#0f766e;color:#ffffff;">
                <h1 style="margin:0;font-size:18px;">SDG Commons — Admin alert</h1>
              </td>
            </tr>

            <tr>
              <td style="padding:20px 24px;">
                <p style="margin:0 0 12px 0;color:#374151">A notification requiring action was created.</p>
                <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;margin-top:8px;">
                  <tr>
                    <td style="padding:8px 12px;font-weight:600;color:#374151;border-top:1px solid #e6e6e6;">Type</td>
                    <td style="padding:8px 12px;border-top:1px solid #e6e6e6;color:#374151">${await escapeHtml(created.type)}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px 12px;font-weight:600;color:#374151;border-top:1px solid #e6e6e6;">Created</td>
                    <td style="padding:8px 12px;border-top:1px solid #e6e6e6;color:#374151">${await escapeHtml(createdAt)}</td>
                  </tr>
                  ${htmlRowsJoined}
                </table>

                <p style="margin:18px 0 0 0">
                  <a href="${await escapeHtml(notifUrl)}" style="display:inline-block;padding:10px 16px;background:#059669;color:#ffffff;border-radius:6px;text-decoration:none;font-weight:600">Open in admin UI</a>
                </p>

                <p style="margin:18px 0 0 0;color:#6b7280;font-size:12px">This is an automated admin alert from SDG Commons.</p>
              </td>
            </tr>

            <tr>
              <td style="padding:12px 16px;background:#f9fafb;color:#9ca3af;font-size:12px;text-align:center">SDG Commons</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

        await sendEmail(adminEmails.join(','), undefined, subject, html);
      } else {
        // No admin emails or SMTP not configured - log for debugging
        console.log('Admin notification not sent: missing ADMIN_EMAILS or SMTP config', { ADMIN_EMAILS, SMTP_HOST, SMTP_SERVICE });
      }
    } catch (e) {
      console.error('Failed to send admin alert email for notification', created?.id, e);
    }

    // --- New: optionally send notification emails to user recipients and record correspondence ---
    try {
      const ADMIN_UI_BASE = NODE_ENV === 'production' ? 'https://sdg-innovation-commons.org' : (LOCAL_BASE_URL || 'http://localhost:3000');

      // Build a list of user recipient emails from payload or related_uuids
      const userRecipients: string[] = [];
      const pl = created.payload || {};
      if (pl) {
        if (typeof pl.toEmail === 'string' && pl.toEmail) userRecipients.push(pl.toEmail);
        if (Array.isArray(pl.toEmails)) userRecipients.push(...pl.toEmails.filter(Boolean));
        if (typeof pl.email === 'string' && pl.email) userRecipients.push(pl.email);
        if (Array.isArray(pl.recipients)) userRecipients.push(...pl.recipients.filter(Boolean));
      }

      // If no explicit emails, try resolving related_uuids to contributor emails
      if (userRecipients.length === 0 && Array.isArray(created.related_uuids) && created.related_uuids.length) {
        for (const uuid of created.related_uuids) {
          try {
            const c = await getContributorInfo(String(uuid));
            if (c && c.email) userRecipients.push(c.email);
          } catch (err) {
            // ignore resolution failures
          }
        }
      }

      // Deduplicate and normalize
      const recipients = Array.from(new Set((userRecipients || []).map((r: string) => (r || '').trim()).filter(Boolean)));

      // If we have recipients, send them a user-facing email and record results
      const emailHistory: any[] = [];
      if (recipients.length > 0) {

        const userSubject = (pl && pl.email_subject) ? String(pl.email_subject) : `Action required: ${created.type}`;
        const userTextLines: string[] = [];
        userTextLines.push(`Dear user,`);
        if (pl && pl.message) userTextLines.push('', String(pl.message));
        userTextLines.push('');
        userTextLines.push(`Please review the notification in the SDG Commons admin UI: ${ADMIN_UI_BASE}/admin/notifications?id=${encodeURIComponent(created.id)}`);
        
        // Create HTML content with inline escaping instead of async escapeHtml function
        const message = pl && pl.message ? String(pl.message) : 'You have an important notification that requires action.';
        const notifUrl = `${ADMIN_UI_BASE}/admin/notifications?id=${encodeURIComponent(created.id)}`;
        const escapedMessage = message.replace(/[&"'<>]/g, function (c) {
          return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' } as any)[c];
        });
        const escapedUrl = notifUrl.replace(/[&"'<>]/g, function (c) {
          return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' } as any)[c];
        });
        const userHtml = `<p>Dear user,</p><p>${escapedMessage}</p><p><a href="${escapedUrl}">Open notification in admin UI</a></p>`;

        for (const toAddr of recipients) {
          const mail = {
            from: `SDG Commons <${SMTP_USER}>`,
            to: toAddr,
            subject: userSubject,
            text: userTextLines.join('\n'),
            html: userHtml,
          };

          try {
            await sendEmail(toAddr, undefined, userSubject, userHtml);
            emailHistory.push({ to: toAddr, subject: userSubject, status: 'sent', sent_at: new Date().toISOString(), preview: (pl && pl.message) ? String(pl.message).slice(0, 500) : '' });
          } catch (sendErr) {
            console.error('Failed to send user notification email to', toAddr, String(sendErr));
            emailHistory.push({ to: toAddr, subject: userSubject, status: 'failed', error: String(sendErr), attempted_at: new Date().toISOString() });
          }
        }
      }

      // Persist email history into notification metadata so admins can see correspondence
      try {
        const existingMeta = created.metadata || {};
        const existingHistory = Array.isArray(existingMeta.email_history) ? existingMeta.email_history : [];
        const newMeta = Object.assign({}, existingMeta, { email_history: existingHistory.concat(emailHistory) });
        await dbQuery('general' as any, `UPDATE notifications SET metadata = $1, updated_at = now() WHERE id = $2`, [newMeta, created.id]);
      } catch (metaErr) {
        console.error('Failed to persist notification email history', created?.id, metaErr);
      }
    } catch (e) {
      console.error('Unexpected error while handling user notification emails for', created?.id, e);
    }

  }

  return created;
}

/**
 * Simple paginated list for admin UI
 */
export async function listNotifications({ limit = 20, offset = 0, filters = {} } : { limit?: number; offset?: number; filters?: any }){
  const where: string[] = [];
  const vals: any[] = [];
  let idx = 1;
  if (filters.status) { where.push(`status = $${idx++}`); vals.push(filters.status); }
  if (filters.type) { where.push(`type = $${idx++}`); vals.push(filters.type); }
  if (filters.level) { where.push(`level = $${idx++}`); vals.push(filters.level); }
  if (filters.query) { where.push(`(payload->> 'subject' ILIKE $${idx} OR payload->> 'message' ILIKE $${idx})`); vals.push(`%${filters.query}%`); idx++; }
  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const sql = `SELECT * FROM notifications ${whereSql} ORDER BY created_at DESC LIMIT $${idx++} OFFSET $${idx++}`;
  vals.push(limit, offset);
  const res = await dbQuery('general' as any, sql, vals);
  return res.rows || [];
}

/**
 * Get single notification
 */
export async function getNotification(id: string){
  const res = await dbQuery('general' as any, `SELECT * FROM notifications WHERE id = $1`, [id]);
  return res.rows?.[0] || null;
}

/**
 * Patch notification: allow action_taken_by, action_notes, status, expires_at
 */
export async function patchNotification(id: string, patch: any, actorUuid?: string) {
  const fields: string[] = [];
  const vals: any[] = [];
  let idx = 1;
  if (patch.status) { fields.push(`status = $${idx++}`); vals.push(patch.status); }
  if (typeof patch.action_notes !== 'undefined') { fields.push(`action_notes = $${idx++}`); vals.push(patch.action_notes); }
  if (patch.action_taken_at) { fields.push(`action_taken_at = $${idx++}`); vals.push(patch.action_taken_at); }
  if (patch.action_taken_by) { fields.push(`action_taken_by = $${idx++}`); vals.push(patch.action_taken_by); }
  if (patch.expires_at) { fields.push(`expires_at = $${idx++}`); vals.push(patch.expires_at); }

  // If the server provided an actorUuid and the client didn't explicitly set action_taken_by,
  // record the server-side actor and timestamp so actions are auditable.
  if (actorUuid && !patch.action_taken_by) {
    fields.push(`action_taken_by = $${idx++}`);
    vals.push(actorUuid);
    // Only set action_taken_at if not already in patch
    if (!patch.action_taken_at) {
      fields.push(`action_taken_at = $${idx++}`);
      vals.push(new Date().toISOString());
    }
  }

  if (fields.length === 0) return getNotification(id);
  // always set updated_at
  const sql = `UPDATE notifications SET ${fields.join(', ')}, updated_at = now() WHERE id = $${idx} RETURNING *`;
  vals.push(id);
  const res = await dbQuery('general' as any, sql, vals);
  return res.rows?.[0] || null;
}
