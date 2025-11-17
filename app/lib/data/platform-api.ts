'use server';
import blogsApi from './blogs-api';
import {
  commonsPlatform,
  extractSDGNumbers,
  polishTags,
  LOCAL_BASE_URL,
  baseHost,
  base_url as hostUrl,
} from '@/app/lib/utils';
import get from './get';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import db, { query as dbQuery } from '@/app/lib/db';

//Environment variables
const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, ADMIN_EMAILS, SMTP_SERVICE, NODE_ENV } = process.env;

export interface Props {
  space?: string;
  page?: number;
  limit?: number;
  search?: string;
  status?: any;
  contributors?: any;
  countries?: any;
  regions?: any;
  teams?: any;
  pads?: any;
  templates?: any;
  mobilizations?: any;
  pinboard?: any;
  section?: any;
  methods?: any;
  nodes?: any;
  orderby?: string;
  include_tags?: boolean;
  include_imgs?: boolean;
  include_data?: boolean;
  include_locations?: boolean;
  include_metafields?: boolean;
  include_source?: boolean;
  include_engagement?: boolean;
  include_comments?: boolean;
  anonymize_comments?: boolean;
  platform?: string;
  pseudonymize?: boolean;
  render?: boolean;
  action?: string;
  include_pinboards?: string;
  email?: string;
  output?: string;
}

export default async function platformApi(
  _kwargs: Props,
  platform: string,
  object: string,
  urlOnly: boolean = false,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body: Record<string, any> = {}
) {
  let {
    space,
    pinboard,
    include_tags,
    include_locations,
    include_engagement,
    include_comments,
    include_pinboards,
    action,
    render,
    output,
  } = _kwargs;
  if (!platform) platform = 'solution';
  if (!object) object = 'pads';
  if (!action) action = 'fetch';
  if (!space) _kwargs.space = 'published';
  if (pinboard) _kwargs.space = 'pinned';
  if (object === 'pads' && !include_tags) _kwargs.include_tags = true;
  if (object === 'pads' && !include_locations) _kwargs.include_locations = true;
  if (object === 'pads' && !include_comments) {
    _kwargs.include_comments = true;
    _kwargs.anonymize_comments = false;
  }
  if (object === 'pads' && !include_engagement)
    _kwargs.include_engagement = true;
  if (object === 'pads' && !include_pinboards)
    _kwargs.include_pinboards = 'all';

  if (!['solution', 'experiment', 'action plan'].includes(platform)) return await blogsApi(_kwargs);

  const params = new URLSearchParams();
  if (render) params.set('output', 'csv');
  if (output) params.set('output', output);
  else params.set('output', 'json');
  params.set('include_data', 'true');

  for (let k in _kwargs) {
    const argV = _kwargs[k as keyof typeof _kwargs];
    if (Array.isArray(argV)) {
      argV.forEach((v: any) => {
        params.append(k, v);
      });
    } else {
      params.set(k, argV);
    }
  }

  const base_url: string | undefined = commonsPlatform.find(
    (p) => p.key === platform
  )?.url;

  const url = `${base_url}/apis/${action}/${object}?${params.toString()}`; 
  // console.log('check url ', url);

  if (urlOnly) return url;

  const data = await get({
    url,
    method,
    body,
  });

  // set urls for pads
  if (object === 'pads' && Array.isArray(data)) {
    data?.forEach((d: any) => {
      d.url = `${base_url}/en/view/pad?id=${d.pad_id}`;
      d.base = platform;
      const date = new Date(d.created_at);
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      d.date = `${day < 10 ? '0' : ''}${day}.${month < 10 ? '0' : ''}${month}.${year}`;
    });
    return polishTags(data);
  } else return data;
}

export async function engageApi(
  platform: string,
  type: string,
  action: string,
  id: number
) {
  const base_url: string | undefined = commonsPlatform.find(
    (p) => p.key === platform
  )?.url;

  const url = `${base_url}/engage`;
  const body = {
    action,
    id,
    object: 'pad',
    type,
  };

  const data = await get({
    url,
    method: 'POST',
    body,
  });
  return data;
}

export async function pin(
  platform: string,
  action: string,
  board_id: number,
  object_id: number | number[],
  board_title?: string
) {
  let source = platform;
  if (['news', 'blog', 'publications', 'press release'].includes(platform))
    source = 'solution';

  const base_url: string | undefined = commonsPlatform.find(
    (p) => p.key === source
  )?.url;

  const url = `${base_url}/pin`;
  const body = {
    action,
    board_id,
    object_id,
    object: 'pad',
    board_title,
    source: platform,
  };

  const data = await get({
    url,
    method: 'POST',
    body,
  });
  return data;
}

export async function updatePinboard(
  id: number,
  title: string,
  description: string
) {
  const base_url: string | undefined = commonsPlatform.find(
    (p) => p.key === 'experiment'
  )?.url;

  const url = `${base_url}/save/pinboard`;
  const body = {
    id,
    title,
    description,
  };

  const data = await get({
    url,
    method: 'POST',
    body,
  });
  return data;
}


export async function getRegion(region: string | string[]) {
  const base_url: string | undefined = commonsPlatform.find(
    (p) => p.key === 'experiment'
  )?.url;

  let _region = Array.isArray(region) ? region : [region];

  const regions = Array.isArray(region) ? region.map(r => `regions=${r}`).join('&') : `regions=${region}`;
  const url = `${base_url}/apis/fetch/countries?${regions}`;
  let data = await get({
    url,
    method: 'GET',
  });

  data = data.filter((d: any) => _region.includes(d?.undp_region))

  return data;
}



export async function addComment(
  platform: string,
  message: string,
  id: number,
  source: number|string|undefined,
  action: string = 'add'
) {
  if(!message || !platform) return;

  const base_url: string | undefined = commonsPlatform.find(
    (p) => p.key === platform
  )?.url;

  const url = `${base_url}/comment`;
  const body = {
    object: 'pad',
    id,
    message,
    source,
    action,
  };

  const data = await get({
    url,
    method: 'POST',
    body,
  });
  return data;
}

export async function deleteComment(
  platform: string,
  id: number,
) {
  if(!platform) return;

  const base_url: string | undefined = commonsPlatform.find(
    (p) => p.key === platform
  )?.url;

  const url = `${base_url}/comment`;
  const body = {
    comment_id: id,
    action: 'delete',
  };

  const data = await get({
    url,
    method: 'POST',
    body,
  });
  return data;
}

export async function loginUser(email: string, password: string, originalUrl: string) {
  const base_url: string | undefined = commonsPlatform.find(
    (p) => p.key === 'login'
  )?.url;

  if (!base_url) {
    throw new Error("Platform base URL not found.");
  }

  const url = `${base_url}/login`;
  const body = {
    username: email,
    password,
    originalUrl,
    is_api_call: true
  };

  const data = await get({
    url,
    method: 'POST',
    body,
  });
  return data;
}

export async function resetPassword(email: string) {
  const base_url: string | undefined = commonsPlatform.find(
    (p) => p.key === 'login'
  )?.url;

  if (!base_url) {
    throw new Error("Platform base URL not found.");
  }

  const url = `${base_url}/forget-password`;
  const body = {
    email,
    fromBase: true,
  };

  const data = await get({
    url,
    method: 'POST',
    body,
  });

  return data;
}

export async function updatePassword(newPassword: string, confirmPassword: string, token: string) {
  const base_url: string | undefined = commonsPlatform.find(
    (p) => p.key === 'login'
  )?.url;

  if (!base_url) {
    throw new Error("Platform base URL not found.");
  }

  const url = `${base_url}/reset-password`;
  const body = {
    password: newPassword,
    confirmPassword,
    token, 
    is_api_call: true,
  };

  const data = await get({
    url,
    method: 'POST',
    body,
  });

  return data;
}

export async function validateToken(token: string) {
  const base_url: string | undefined = commonsPlatform.find(
    (p) => p.key === "login"
  )?.url;

  if (!base_url) {
    throw new Error("Platform base URL not found.");
  }

  const url = `${base_url}/reset/${token}?originalUrl=${baseHost}`;
  const data = await get({
    url,
    method: "GET",
  });
  return data;
}

export async function initiateSSO(originalUrl: string) {
  try {
    const base_url: string | undefined = commonsPlatform.find(
      (p) => p.key === "login"
    )?.url;
  
    if (!base_url) {
      throw new Error("Platform base URL not found.");
    }

    const url = `${base_url}/sso-inits?is_api_call=true&host_redirect_url=${encodeURIComponent(originalUrl)}&host_redirect_failed_auth_url=${encodeURIComponent(hostUrl)}/login`;
    const data = await get({
      url,
      method: 'GET',
    });

    return data;
  } catch (error) {
    console.error('Error initiating SSO:', error);
    throw error;
  }
}

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

  const transportOptions: any = SMTP_SERVICE
    ? { service: SMTP_SERVICE, auth: { user: SMTP_USER, pass: SMTP_PASS } }
    : { host: SMTP_HOST, port: Number(SMTP_PORT), auth: { user: SMTP_USER, pass: SMTP_PASS } };

  const transporter = nodemailer.createTransport(transportOptions);

  const confirmationLink = process.env.NODE_ENV === 'production'
    ? `https://sdg-innovation-commons.org/confirm-email/${token}?new_user=true`
    : `${LOCAL_BASE_URL}/confirm-email/${token}?new_user=true`;

  const mailOptions = {
    from: `SDG Commons <${SMTP_USER}>`,
    to: forms.email,
    subject: 'Please confirm your email for SDG Commons registration',
    text: `
      Dear ${forms.new_name || 'User'},

      Thank you for registering as a contributor on the SDG Commons platform. Please confirm your email address by clicking the link below. The link is valid for 24 hours.

      ${confirmationLink}

      Best regards,
      SDG Commons Platform
    `,
  };

  try {
    if (NODE_ENV === 'production') {
      await transporter.sendMail(mailOptions);
    } else {
      // Avoid sending in dev — log link so QA/dev can click it
      console.log('Dev mode - confirm link:', confirmationLink);
    }
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

  const base_url: string | undefined = commonsPlatform.find(
    (p) => p.key === 'login'
  )?.url;

  if (!base_url) {
    throw new Error("Platform base URL not found.");
  }

  if (!SMTP_USER || !SMTP_PASS || !ADMIN_EMAILS) {
    throw new Error('SMTP_USER / SMTP_PASS / ADMIN_EMAILS are required.');
  }

  const adminEmails = ADMIN_EMAILS
    ? ADMIN_EMAILS.split(';').map(email => email.trim()).filter(email => email)
    : [];

  if (adminEmails.length === 0) {
    throw new Error('No admin emails provided.');
  }

  const url = `${base_url}/save/contributor`;
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
        const ADMIN_UI_BASE = process.env.NODE_ENV === 'production' ? 'https://sdg-innovation-commons.org' : (process.env.LOCAL_BASE_URL || 'http://localhost:3000');
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

export async function logoutCurrentSession() {
  const base_url: string | undefined = commonsPlatform.find(
    (p) => p.key === 'login'
  )?.url;

  if (!base_url) {
    throw new Error("Platform base URL not found.");
  }

  const url = `${base_url}/logout/current`;

  const data = await get({
    url,
    method: 'POST',
    body: {
      fromHostBase: true
    },
  });

  return data;
}

export async function getContributorInfo(uuid: string) {
  if (!uuid) {
    return { status: 400, message: 'UUID is required' };
  }

  try {
    // Query general DB for contributor. Use only existing columns from users schema.
    const q = `SELECT id, name, email, position, created_at, invited_at, confirmed_at, uuid, rights, language, secondary_languages, reviewer, iso3, created_from_sso, last_login
               FROM users WHERE uuid = $1 LIMIT 1`;
    const res = await db.query('general', q, [uuid]);
    // console.log('Contributor query result:', res);
    if (res && res.rowCount === 1) {
      const row: any = res.rows[0];
      return {
        status: 200,
        id: row.id,
        fullName: row.name || '',
        email: row.email || '',
        // `country` isn't present in schema; expose iso3 as country when available
        country: row.iso3 || '',
        position: row.position || '',
        joinDate: row.created_at || row.invited_at || null,
        // avatar and bio are not part of this users schema; return empty string if absent
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
  const base_url: string | undefined = commonsPlatform.find(
    (p) => p.key === 'login'
  )?.url;

  if (!base_url) {
    throw new Error("Platform base URL not found.");
  }

  if (!forms?.id)  throw new Error("UUID and ID are required for updating profile.");

  //Check if current password. If new password is provided, current password is required
  // Check if cuurent password is correct
  const {new_password, currentPassword } = forms;
  if (new_password && !currentPassword) {
    return {
      status: 400,
      message: 'Current password is required to update profile.',
    };
  }
  if ((new_password && currentPassword) || currentPassword) {
    const checkCurrentPassword = await get({
      url: `${base_url}/check/password`,
      method: 'POST',
      body: {
        password: currentPassword,
        id: forms.id, 
      },
    });

    // If the status is not 200, it means the current password is incorrect or not provided
    if (checkCurrentPassword?.status !== 200) {
      return {
        status: 400,
        message: 'Current password is required to update profile.',
      };
    }
  }

  const url = `${base_url}/save/contributor`;

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
    console.error('Error registering contributor:', error);
    throw error;
  }
}


export async function confirmEmail(token: string) {
  const base_url: string | undefined = commonsPlatform.find(
    (p) => p.key === 'login'
  )?.url;

  if (!base_url) {
    throw new Error("Platform base URL not found.");
  }
  const url = `${base_url}/confirm-email/${token}?is_api_call=true`;

  const resp = await get({
    url,
    method: 'GET',
  });
  return resp;
}

export async function deleteAccount(uuid: string, password: string, email: string) {
  const base_url: string | undefined = commonsPlatform.find(
    (p) => p.key === 'login'
  )?.url;

  if (!base_url) {
    throw new Error("Platform base URL not found.");
  }

  // Validate the user's password
  const validatePasswordResponse = await get({
    url: `${base_url}/check/password`,
    method: 'POST',
    body: {
      password,
      id: uuid,
    },
  });

  if (validatePasswordResponse?.status !== 200) {
    return {
      status: 400,
      message: 'Incorrect password. Please try again.',
    };
  }

  // Execute the delete API call
  const url = `${base_url}/delete/contributors?id=${uuid}&is_api_call=true&anonymize=true`;

  const deleteResponse = await get({
    url,
    method: 'GET',
  });

  if (deleteResponse?.status === 200) {
    if (email) {
      await notifyAccountDeletion(email);
    }
  }

  return deleteResponse;
}

export async function notifyAccountDeletion(email: string) {
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !ADMIN_EMAILS || !SMTP_SERVICE) {
    throw new Error('SMTP environment variables are not defined.');
  }

  const adminEmails = ADMIN_EMAILS
    ? ADMIN_EMAILS.split(';').map(email => email.trim()).filter(email => email)
    : [];

  if (adminEmails.length === 0) {
    throw new Error('No admin emails provided.');
  }

  const adminContact = adminEmails[0];

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    service: SMTP_SERVICE,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  const mailOptions = {
    from: `SDG Commons <${SMTP_USER}>`,
    to: email,
    subject: 'Account Deletion Notification',
    text: `
      Dear User,

      Your account has been successfully deleted from the SDG Commons platform. Your contributions may remain in anonymized form unless you explicitly request their removal. If you wish to remove your contributions, please contact the administrator at ${adminContact}.

      Best regards,
      SDG Commons Platform
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
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
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !SMTP_SERVICE) {
    throw new Error('SMTP environment variables are not defined.');
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    service: SMTP_SERVICE,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  const mailOptions = {
    from: `SDG Commons <${SMTP_USER}>`,
    to: contributorEmail,
    subject: `Message from ${senderName}`,
    text: `
      Dear Contributor,

      You have received a message from ${senderName} (${senderEmail}). Below is the message:

      "${message}"

      Please feel free to respond directly to the sender.

      Best regards,
      SDG Commons Platform
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
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
      if (adminEmails.length > 0 && (SMTP_HOST || SMTP_SERVICE) && SMTP_USER && SMTP_PASS) {
        const transportOptions: any = SMTP_SERVICE
          ? { service: SMTP_SERVICE, auth: { user: SMTP_USER, pass: SMTP_PASS } }
          : { host: SMTP_HOST, port: Number(SMTP_PORT), auth: { user: SMTP_USER, pass: SMTP_PASS } };
        const transporter = nodemailer.createTransport(transportOptions);

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
        const htmlRows = payloadEntries.map((e) => {
          const v = (typeof e.value === 'object') ? `<pre style="white-space:pre-wrap;margin:0">${escapeHtml(JSON.stringify(e.value, null, 2))}</pre>` : escapeHtml(String(e.value));
          return `
            <tr>
              <td style="padding:8px 12px;border-top:1px solid #e6e6e6;font-weight:600;color:#374151">${escapeHtml(e.key)}</td>
              <td style="padding:8px 12px;border-top:1px solid #e6e6e6;color:#374151">${v}</td>
            </tr>`;
        }).join('\n');

        const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(subject)}</title>
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
                    <td style="padding:8px 12px;border-top:1px solid #e6e6e6;color:#374151">${escapeHtml(created.type)}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px 12px;font-weight:600;color:#374151;border-top:1px solid #e6e6e6;">Created</td>
                    <td style="padding:8px 12px;border-top:1px solid #e6e6e6;color:#374151">${escapeHtml(createdAt)}</td>
                  </tr>
                  ${htmlRows}
                </table>

                <p style="margin:18px 0 0 0">
                  <a href="${escapeHtml(notifUrl)}" style="display:inline-block;padding:10px 16px;background:#059669;color:#ffffff;border-radius:6px;text-decoration:none;font-weight:600">Open in admin UI</a>
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

        // Helper to escape HTML inserted into template
        function escapeHtml(s: any){
          if (s === null || typeof s === 'undefined') return '';
          return String(s).replace(/[&"'<>]/g, function (c) {
            return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' } as any)[c];
          });
        }

        const mailOptions = {
          from: `SDG Commons <${SMTP_USER}>`,
          to: adminEmails.join(','),
          subject,
          text: textLines.join('\n'),
          html,
        };

        if (NODE_ENV === 'production') {
          await transporter.sendMail(mailOptions);
        } else {
          // In non-production, log instead of sending
          console.log('Admin notification (dev) - would send:', { mailOptions });
        }
      } else {
        // No admin emails or SMTP not configured - log for debugging
        console.log('Admin notification not sent: missing ADMIN_EMAILS or SMTP config', { ADMIN_EMAILS, SMTP_HOST, SMTP_SERVICE });
      }
    } catch (e) {
      console.error('Failed to send admin alert email for notification', created?.id, e);
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