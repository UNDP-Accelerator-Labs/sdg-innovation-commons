'use server';

import jwt from 'jsonwebtoken';
import { LOCAL_BASE_URL, baseHost } from '@/app/lib/helpers/utils';
import { sendEmail } from '@/app/lib/helpers';
import db from '@/app/lib/db';
import get from '@/app/lib/data/get';
import { createNotification } from '@/app/lib/data/notifications';

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, ADMIN_EMAILS, SMTP_SERVICE, NODE_ENV } = process.env;

export async function confirmEmailAccountBeforeRegistration(forms: Record<string, any>) {
  // Anti-bot protection: Check honeypot field
  if (forms.website && forms.website !== '') {
    console.warn('Bot detected: honeypot field filled');
    return {
      status: 400,
      message: 'Registration failed. Please try again.',
    };
  }

  // Anti-bot protection: Time-based validation (minimum 5 seconds for registration)
  if (forms.formLoadTime) {
    const loadTime = parseInt(forms.formLoadTime, 10);
    const currentTime = Date.now();
    const timeDiff = currentTime - loadTime;
    if (timeDiff < 5000) {
      console.warn('Bot detected: form submitted too quickly');
      return {
        status: 400,
        message: 'Registration failed. Please try again.',
      };
    }
  }
  const safeForms = { ...forms };

  if (!process.env.APP_SECRET) {
    throw new Error('APP_SECRET not configured');
  }

  const token = jwt.sign(
    { forms: safeForms },
    process.env.APP_SECRET as string,
    {
      audience: 'sdgcommons:known',
      issuer: baseHost?.slice(1) || undefined,
      expiresIn: '24h', // link validity aligned with UI
    }
  );

  //send email to user with confirmation link
  if (!SMTP_HOST && !SMTP_SERVICE) {
    throw new Error('SMTP_HOST or SMTP_SERVICE must be defined.');
  }
  if (!SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    throw new Error('SMTP_PORT / SMTP_USER / SMTP_PASS are not defined.');
  }

  const confirmationLink = `${process.env.NEXTAUTH_URL || LOCAL_BASE_URL}/confirm-email/${token}?new_user=true`;

  const emailSubject = 'Please confirm your email for SDG Commons registration';
  const emailHtml = `
      <p>Dear ${forms.new_name || 'User'},</p>
      <p>Thank you for registering as a contributor on the SDG Commons platform. Please confirm your email address by clicking the link below. The link is valid for 24 hours.</p>
      <p><a href="${confirmationLink}">${confirmationLink}</a></p>
      <p>Best regards,<br/>SDG Commons Platform</p>
    `;

  try {
    await sendEmail(forms.email, undefined, emailSubject, emailHtml);
  } catch (error) {
    console.error('Error sending email to user:', error);
  }
  return {
    status: 200,
    message: 'A confirmation email has been sent to your email address. Please check your inbox.',
  };
}

export async function registerContributor(token:string) {
  if (!token) {
    return {
      status: 400,
      message: 'Invalid or missing token.',
    };
  }

  let decoded: any;
  try {
    if (!process.env.APP_SECRET) {
      throw new Error('APP_SECRET not configured');
    }
    decoded = jwt.verify(token, process.env.APP_SECRET as string, {
      audience: 'sdgcommons:known',
      issuer: baseHost?.slice(1) || undefined,
    }) as any;
  } catch (error) {
    console.error('Error verifying token:', error);
    return {
      status: 400,
      message: 'Invalid or expired token.',
    };
  }

  if (!decoded || typeof decoded !== 'object' || !decoded.forms) {
    return {
      status: 400,
      message: 'Invalid token payload.',
    };
  }
  const forms = decoded.forms;

  if (!SMTP_USER || !SMTP_PASS || !ADMIN_EMAILS) {
    throw new Error('SMTP_USER / SMTP_PASS / ADMIN_EMAILS are required.');
  }

  const adminEmails = ADMIN_EMAILS
    ? ADMIN_EMAILS.split(';').map(email => email.trim()).filter(email => email)
    : [];

  if (adminEmails.length === 0) {
    throw new Error('No admin emails provided.');
  }

  const url = `${LOCAL_BASE_URL}/api/contributors/save`;
  const body = {
    ...forms,
    fromBaseHost: true,
  };

  try {
    const data = await get({
      url,
      method: 'POST',
      body,
    });

    if (data?.status === 200) {
      // Persist admin-facing notification for new user registration instead of emailing admins
      try {
        const ADMIN_UI_BASE = process.env.NEXTAUTH_URL || process.env.LOCAL_BASE_URL || 'http://localhost:3000';
        await createNotification({
          type: 'new_user_registration',
          level: 'info',
          payload: {
            subject: `New user registered: ${forms.new_name || 'N/A'}`,
            name: forms.new_name || null,
            email: forms.email || null,
            organization: forms.organization || null,
            role: forms.role || null,
            country: forms.country || null,
            position: forms.position || null,
          },
          metadata: { adminUrl: `${ADMIN_UI_BASE}/admin/notifications`, userManagementUrl: `${ADMIN_UI_BASE}/admin/users` },
          related_uuids: [],
        });
      } catch (notifyErr) {
        console.error('Failed to create admin notification for new contributor', notifyErr);
      }
    }

    return data;
  } catch (error) {
    console.error('Error registering contributor:', error);
    throw error;
  }
}

export async function getContributorInfo(uuid: string) {
  if (!uuid) {
    return { status: 400, message: 'UUID is required' };
  }

  try {
    // Query general DB for contributor with country name from countries table
    const q = `
      SELECT 
        u.id, 
        u.name, 
        u.email, 
        u.position, 
        u.created_at, 
        u.invited_at, 
        u.confirmed_at, 
        u.uuid, 
        u.rights, 
        u.language, 
        u.secondary_languages, 
        u.reviewer, 
        u.iso3,
        u.created_from_sso, 
        u.last_login,
        CASE 
          WHEN u.iso3 IS NULL OR u.iso3 = 'NUL' THEN 'Global'
          ELSE COALESCE(cn.name, u.iso3)
        END as country_name
      FROM users u
      LEFT JOIN countries c ON u.iso3 = c.iso3
      LEFT JOIN country_names cn ON cn.iso3 = c.iso3 AND cn.language = 'en'
      WHERE u.uuid = $1 
      LIMIT 1
    `;
    const res = await db.query('general', q, [uuid]);
    // console.log('Contributor query result:', res);
    if (res && res.rowCount === 1) {
      const row: any = res.rows[0];
      return {
        status: 200,
        id: row.id,
        fullName: row.name || '',
        email: row.email || '',
        country: row.country_name || 'Global',
        position: row.position || '',
        joinDate: row.created_at || row.invited_at || null,
        created_at: row.created_at || row.invited_at || null,
        avatar: row.avatar || '',
        bio: row.bio || '',
        uuid: row.uuid,
        rights: row.rights || 1,
        language: row.language || '',
        secondary_languages: row.secondary_languages || [],
        reviewer: row.reviewer || false,
        iso3: row.iso3 || '',
        name: row.name || '',
        last_login: row.last_login || null,
        confirmed: row.confirmed || false,
        invited_at: row.invited_at || null,
      };
    }

    return {
      status: 404,
      message: 'Contributor not found',
    };
  } catch (error) {
    console.error('Error fetching contributor from DB:', error);
    return {
      status: 500,
      message: 'Error querying contributor information',
      error,
    };
  }
}

export async function updatedProfile(forms: Record<string, any>) {
  if (!forms?.id) throw new Error("User ID is required for updating profile.");

  // Check if current password is provided when updating password
  const { new_password, currentPassword } = forms;
  if (new_password && !currentPassword) {
    return {
      status: 400,
      message: 'Current password is required to update password.',
    };
  }

  // Validate current password if provided
  if ((new_password && currentPassword) || currentPassword) {
    const checkCurrentPassword = await get({
      url: `${LOCAL_BASE_URL}/api/auth/check-password`,
      method: 'POST',
      body: {
        password: currentPassword,
        id: forms.id,
      },
    });

    if (checkCurrentPassword?.status !== 200) {
      return {
        status: 400,
        message: 'Current password is incorrect.',
      };
    }
  }

  // Call save contributor endpoint
  const url = `${LOCAL_BASE_URL}/api/contributors/save`;
  const body = {
    ...forms,
    fromBaseHost: true,
  };

  try {
    const data = await get({
      url,
      method: 'POST',
      body,
    });

    return data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
}

export async function createContributor(forms: Record<string, any>) {
  const url = `${LOCAL_BASE_URL}/api/contributors/save`;
  const body = {
    ...forms,
    fromBaseHost: true,
  };

  try {
    const data = await get({
      url,
      method: 'POST',
      body,
    });

    return data;
  } catch (error) {
    console.error('Error creating contributor:', error);
    throw error;
  }
}

export async function confirmEmail(token: string) {
  const url = `${LOCAL_BASE_URL}/api/contributors/confirm-email/${token}`;

  const resp = await get({
    url,
    method: 'GET',
  });
  return resp;
}

export async function deleteAccount(uuid: string, password: string, email: string) {
  // Use local API endpoint for account deletion with anonymization
  const url = `${LOCAL_BASE_URL}/api/contributors/delete`;

  const deleteResponse = await get({
    url,
    method: 'POST',
    body: {
      user_uuid: uuid,
      password,
      anonymize: true,
    },
  });

  if (deleteResponse?.status === 200) {
    if (email) {
      await notifyAccountDeletion(email);
    }
  }

  return deleteResponse;
}

export async function notifyAccountDeletion(email: string) {
  const adminEmails = ADMIN_EMAILS
    ? ADMIN_EMAILS.split(';').map((email: string) => email.trim()).filter((email: string) => email)
    : [];

  if (adminEmails.length === 0) {
    throw new Error('No admin emails provided.');
  }

  const adminContact = adminEmails[0];
  const emailSubject = 'Account Deletion Notification';
  const emailHtml = `
      <p>Dear User,</p>
      <p>Your account has been successfully deleted from the SDG Commons platform. Your contributions may remain in anonymized form unless you explicitly request their removal. If you wish to remove your contributions, please contact the administrator at ${adminContact}.</p>
      <p>Best regards,<br/>SDG Commons Platform</p>
    `;

  try {
    await sendEmail(email, undefined, emailSubject, emailHtml);
    return {
      status: 200,
      message: 'Notification email sent successfully.',
    };
  } catch (error) {
    console.error('Error sending account deletion notification email:', error);
    return {
      status: 500,
      message: 'Failed to send notification email.',
      error,
    };
  }
}

export async function sendContactContributorEmail(
  contributorEmail: string,
  senderEmail: string,
  senderName: string,
  message: string
) {
  const emailSubject = `Message from ${senderName}`;
  const emailHtml = `
      <p>Dear Contributor,</p>
      <p>You have received a message from ${senderName} (${senderEmail}). Below is the message:</p>
      <blockquote style="border-left: 4px solid #ccc; margin: 1em 0; padding-left: 1em; font-style: italic;">"${message}"</blockquote>
      <p>Please feel free to respond directly to the sender.</p>
      <p>Best regards,<br/>SDG Commons Platform</p>
    `;

  try {
    await sendEmail(contributorEmail, undefined, emailSubject, emailHtml);
    return {
      status: 200,
      message: 'Email sent successfully.',
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      status: 500,
      message: 'Failed to send email.',
      error,
    };
  }
}
