/**
 * Email service for sending notifications and transactional emails
 * @module lib/services/email
 */

import nodemailer from 'nodemailer';
import { EMAIL_CONFIG } from '../config';

/**
 * Email options interface
 */
export interface EmailOptions {
  to: string;
  cc?: string | null;
  bcc?: string | null;
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
}

/**
 * Create email transporter based on configuration
 * 
 * @returns Nodemailer transporter
 */
function createTransporter(): nodemailer.Transporter {
  const transportOptions: any = EMAIL_CONFIG.service
    ? {
        service: EMAIL_CONFIG.service,
        auth: {
          user: EMAIL_CONFIG.user,
          pass: EMAIL_CONFIG.pass,
        },
      }
    : {
        host: EMAIL_CONFIG.host,
        port: EMAIL_CONFIG.port,
        auth: {
          user: EMAIL_CONFIG.user,
          pass: EMAIL_CONFIG.pass,
        },
      };

  return nodemailer.createTransport(transportOptions);
}

/**
 * Send an email
 * 
 * @param options - Email options
 * @returns Promise resolving to email info or null if config missing
 * 
 * @example
 * ```typescript
 * await sendEmail({
 *   to: 'user@example.com',
 *   subject: 'Welcome',
 *   html: '<h1>Welcome to SDG Commons!</h1>',
 * });
 * ```
 */
export async function sendEmail(options: EmailOptions): Promise<any | null> {
  if (!EMAIL_CONFIG.isConfigured()) {
    console.warn('[Email] SMTP configuration is missing. Email not sent.');
    return null;
  }

  const transporter = createTransporter();

  const mailOptions: nodemailer.SendMailOptions = {
    from: options.from || `"SDG Innovation Commons" <${EMAIL_CONFIG.user}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
  };

  if (options.cc) {
    mailOptions.cc = options.cc;
  }

  if (options.bcc) {
    mailOptions.bcc = options.bcc;
  }

  if (options.replyTo) {
    mailOptions.replyTo = options.replyTo;
  }

  try {
    if (process.env.NODE_ENV === 'production') {
      const info = await transporter.sendMail(mailOptions);
      console.log('[Email] Email sent:', info.messageId);
      return info;
    } else {
      console.log('[Email] Development mode - Email not sent');
      console.log('[Email] Would send to:', options.to);
      console.log('[Email] Subject:', options.subject);
      return { messageId: 'dev-mode-no-send' };
    }
  } catch (error) {
    console.error('[Email] Error sending email:', error);
    throw error;
  }
}

/**
 * Send welcome email to new user
 * 
 * @param email - User email
 * @param name - User name
 */
export async function sendWelcomeEmail(email: string, name: string): Promise<void> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #0468b1;">Welcome to SDG Innovation Commons!</h1>
      <p>Hi ${name},</p>
      <p>Thank you for joining the SDG Innovation Commons platform.</p>
      <p>You can now:</p>
      <ul>
        <li>Explore innovative solutions and experiments</li>
        <li>Create and share your own learning plans</li>
        <li>Collaborate with innovators worldwide</li>
      </ul>
      <p>
        <a href="${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://sdg-innovation-commons.org'}" 
           style="background-color: #0468b1; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Get Started
        </a>
      </p>
      <p>Best regards,<br>SDG Innovation Commons Team</p>
    </div>
  `;

  await sendEmail({
    to: email,
    subject: 'Welcome to SDG Innovation Commons',
    html,
  });
}

/**
 * Send password reset email
 * 
 * @param email - User email
 * @param resetToken - Password reset token
 * @param name - User name
 */
export async function sendPasswordResetEmail(
  email: string,
  resetToken: string,
  name: string
): Promise<void> {
  const resetUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://sdg-innovation-commons.org'}/reset/${resetToken}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #0468b1;">Password Reset Request</h1>
      <p>Hi ${name},</p>
      <p>We received a request to reset your password for SDG Innovation Commons.</p>
      <p>Click the button below to reset your password:</p>
      <p>
        <a href="${resetUrl}" 
           style="background-color: #0468b1; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Reset Password
        </a>
      </p>
      <p>If you didn't request this, you can safely ignore this email.</p>
      <p>This link will expire in 24 hours.</p>
      <p>Best regards,<br>SDG Innovation Commons Team</p>
    </div>
  `;

  await sendEmail({
    to: email,
    subject: 'Password Reset - SDG Innovation Commons',
    html,
  });
}

/**
 * Send email confirmation link
 * 
 * @param email - User email
 * @param confirmToken - Email confirmation token
 * @param name - User name
 */
export async function sendEmailConfirmation(
  email: string,
  confirmToken: string,
  name: string
): Promise<void> {
  const confirmUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://sdg-innovation-commons.org'}/confirm-email/${confirmToken}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #0468b1;">Confirm Your Email</h1>
      <p>Hi ${name},</p>
      <p>Please confirm your email address by clicking the button below:</p>
      <p>
        <a href="${confirmUrl}" 
           style="background-color: #0468b1; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Confirm Email
        </a>
      </p>
      <p>This link will expire in 24 hours.</p>
      <p>Best regards,<br>SDG Innovation Commons Team</p>
    </div>
  `;

  await sendEmail({
    to: email,
    subject: 'Confirm Your Email - SDG Innovation Commons',
    html,
  });
}

/**
 * Send admin notification email
 * 
 * @param subject - Email subject
 * @param message - Email message
 */
export async function sendAdminNotification(subject: string, message: string): Promise<void> {
  if (!EMAIL_CONFIG.adminEmails) {
    console.warn('[Email] No admin emails configured');
    return;
  }

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #0468b1;">Admin Notification</h1>
      <p>${message}</p>
      <hr>
      <p style="color: #666; font-size: 12px;">
        This is an automated notification from SDG Innovation Commons
      </p>
    </div>
  `;

  await sendEmail({
    to: EMAIL_CONFIG.adminEmails,
    subject: `[Admin] ${subject}`,
    html,
  });
}
