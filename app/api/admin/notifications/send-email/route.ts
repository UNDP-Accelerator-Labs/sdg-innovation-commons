import { NextRequest, NextResponse } from 'next/server';
import getSession from '@/app/lib/session';
import { getNotification } from '@/app/lib/data/platform-api';
import db, { query as dbQuery } from '@/app/lib/db';

function escapeHtml(s: any) {
  if (s === null || typeof s === 'undefined') return '';
  return String(s).replace(/[&"'<>]/g, function (c) {
    return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' } as any)[c];
  });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  const rights = session?.rights || 0;
  if (!session || rights < 4) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const body = await req.json();
  const { id, to, subject, message } = body || {};
  if (!id || !to) return NextResponse.json({ error: 'id and to are required' }, { status: 400 });

  const notif = await getNotification(String(id));
  if (!notif) return NextResponse.json({ error: 'notification not found' }, { status: 404 });

  // capture actor info from session to record who sent the email
  const actor_uuid = session?.uuid || null;
  const actor_name = session?.username || session?.name || null;

  // Build transport options
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SERVICE, NODE_ENV, ADMIN_EMAILS, LOCAL_BASE_URL } = process.env as any;
  if (!(SMTP_HOST || SMTP_SERVICE) || !SMTP_USER || !SMTP_PASS) {
    return NextResponse.json({ error: 'SMTP not configured on server' }, { status: 500 });
  }

  const transportOptions: any = SMTP_SERVICE
    ? { service: SMTP_SERVICE, auth: { user: SMTP_USER, pass: SMTP_PASS } }
    : { host: SMTP_HOST, port: Number(SMTP_PORT), auth: { user: SMTP_USER, pass: SMTP_PASS } };

  // dynamic import nodemailer (server-only)
  const nodemailerMod = await import('nodemailer');
  const nodemailerLib: any = (nodemailerMod && (nodemailerMod as any).default) ? (nodemailerMod as any).default : nodemailerMod;
  const transporter = nodemailerLib.createTransport(transportOptions);

  // Build email payload for user — do NOT include admin UI link. Preserve line breaks using white-space:pre-wrap and escape HTML.
  const mail = {
    from: `SDG Commons <${SMTP_USER}>`,
    to: String(to),
    subject: String(subject || `Notification: ${notif.type}`),
    text: (message ? String(message) + '\n' : ''),
    html: `<div style="white-space:pre-wrap;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial;line-height:1.4;color:#111">${escapeHtml(message || '')}</div>`,
  };

  const historyEntry: any = { to: String(to), subject: mail.subject, actor_uuid, actor_name };
  try {
    const info = await transporter.sendMail(mail);
    historyEntry.status = 'sent';
    historyEntry.sent_at = new Date().toISOString();
    historyEntry.preview = (message || '').slice(0, 500);
  } catch (err: any) {
    historyEntry.status = 'failed';
    historyEntry.attempted_at = new Date().toISOString();
    historyEntry.error = String(err || 'unknown');
  }

  // persist into notification.metadata.email_history
  try {
    const existingMeta = notif.metadata || {};
    const existingHistory = Array.isArray(existingMeta.email_history) ? existingMeta.email_history : [];
    const newMeta = Object.assign({}, existingMeta, { email_history: existingHistory.concat([historyEntry]) });
    const upd = await dbQuery('general' as any, `UPDATE notifications SET metadata = $1, updated_at = now() WHERE id = $2 RETURNING *`, [newMeta, notif.id]);
    const updatedRow = upd.rows?.[0] || null;
    return NextResponse.json({ success: true, email_history: [historyEntry], notification: updatedRow });
  } catch (e) {
    console.error('Failed to persist email history', e);
    return NextResponse.json({ success: false, email_history: [historyEntry], error: String(e) }, { status: 500 });
  }
}
