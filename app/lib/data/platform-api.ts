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

export async function registerContributor(forms: Record<string, any>) {
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
    
    // If form submitted in less than 5 seconds, likely a bot
    if (timeDiff < 5000) {
      console.warn('Bot detected: form submitted too quickly');
      return {
        status: 400,
        message: 'Registration failed. Please try again.',
      };
    }
  }

  const base_url: string | undefined = commonsPlatform.find(
    (p) => p.key === 'login'
  )?.url;

  if (!base_url) {
    throw new Error("Platform base URL not found.");
  }

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !ADMIN_EMAILS || !SMTP_SERVICE) {
    throw new Error('SMTP or email environment variables are not defined.');
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
      const to = adminEmails[0];
      const cc = adminEmails.length > 1 ? adminEmails.slice(1).join(';') : '';

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
        to,
        cc,
        subject: `FYI: New Contributor Self-Registration – ${forms.new_name || 'N/A'}`,
        text: `
          Dear Admin(s),

          This is an automated notification for your information only. A new user has registered themselves as a contributor on the SDG Commons platform. The registrant is likely external to your organization.

          Registration details:
          Name: ${forms.new_name || 'N/A'}
          Email: ${forms.email || 'N/A'}
          Organization: ${forms.organization || 'N/A'}
          Role: ${forms.role || 'N/A'}
          Country: ${forms.country || 'N/A'}
          Position: ${forms.position || 'N/A'}

          No action is required on your part at this time.

          Best regards,
          SDG Commons Platform
        `,
      };

      // Send email to admin
      try {
        // if (NODE_ENV === 'production') {
          await transporter.sendMail(mailOptions);
        // }
      } catch (emailError) {
        console.error('Error sending email to admin:', emailError);
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
  const base_url: string | undefined = commonsPlatform.find(
    (p) => p.key === 'login'
  )?.url;

  if (!base_url) {
    throw new Error("Platform base URL not found.");
  }

  const url = `${base_url}/en/view/contributor?is_api_call=true&id=${uuid}`;

  const resp = await get({
    url,
    method: 'GET',
  });

  const { data, status } = resp || {};
  if (status === 200 && data?.data) {
    return {
      status,
      ...data.data,
    };
  } else {
    return {
      status: status || 500,
      message: data?.message || 'Failed to fetch contributor info',
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