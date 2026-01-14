// Email notification service for exports

import { sendEmail } from '../../app/lib/helpers';

/**
 * Send email notification with export download link
 * @param toEmail - Primary recipient email
 * @param blobUrl - URL to download the export
 * @param ccEmail - Optional CC recipient
 */
export async function sendExportNotification(
  toEmail: string,
  blobUrl: string,
  ccEmail?: string
): Promise<void> {
  const subject = 'Your data export is ready — SDG Innovation Commons';
  const htmlBody = `
    <div style="font-family: Arial, Helvetica, sans-serif; color: #111;">
      <p>Hello,</p>
      <p>Your requested data export is ready for download.</p>
      <p><a href="${blobUrl}" style="color: #0a66c2; text-decoration: none; font-weight: 600;">Download export</a></p>
      <p style="font-size:12px; color:#666;">This link will be available for 24 hours. If it expires or is no longer available, request a new export from the Admin Exports panel.</p>
      <p>Regards,<br/><strong>SDG Innovation Commons — Data Exports</strong></p>
    </div>
  `;

  try {
    await sendEmail(toEmail, ccEmail || undefined, subject, htmlBody);
    console.log('Sent export notification to', toEmail, ccEmail ? `(cc: ${ccEmail})` : '', 'for', blobUrl);
  } catch (e) {
    console.error('Failed to send export email', e);
  }
}
