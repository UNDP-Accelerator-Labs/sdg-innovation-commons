'use server';
import { z } from 'zod';
import nodemailer from 'nodemailer';
import { createNotification } from '@/app/lib/data/platform-api';

// Utility function to get the current date
const getCurrentDate = () => new Date().toISOString().split('T')[0];

// Validate environment variables
const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, ADMIN_EMAILS, SMTP_SERVICE } = process.env;
if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !ADMIN_EMAILS || !SMTP_SERVICE) {
  throw new Error('SMTP or email environment variables are not defined.');
}

// Create reusable nodemailer transporter
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  service: SMTP_SERVICE,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

// Zod schema for validation
const ContactSchema = z.object({
  name: z.string().min(1, 'Please provide your name'),
  surname: z.string().min(1, 'Please provide your surname.'),
  email: z.string().email('Please provide a valid email.'),
  org: z.string().min(1, 'Please provide your organization.'),
  reason: z.string().min(1, 'Please select your reason for contact.'),
  message: z.string().min(1, 'Please provide your message.'),
  date: z.string().optional(), // Optional as it is automatically generated
  // Honeypot field - should be empty for legitimate users
  website: z.string().optional(),
  // Timestamp for time-based validation
  formLoadTime: z.string().optional(),
});

export type ContactState = {
  isSubmited?: boolean;
  errors?: {
    name?: string[];
    surname?: string[];
    email?: string[];
    org?: string[];
    reason?: string[];
    message?: string[];
  };  
  success?: boolean;
  message?: string | null;
};

const CreateContact = ContactSchema.omit({ date: true, website: true, formLoadTime: true });

export async function createContact(prevState: ContactState, formData: FormData): Promise<ContactState> {

  let newState: ContactState = { ...prevState, isSubmited: false };

  // Anti-bot protection: Check honeypot field
  const honeypot = formData.get('website');
  if (honeypot && honeypot !== '') {
    console.warn('Bot detected: honeypot field filled');
    return {
      ...newState,
      isSubmited: false,
      success: false,
      message: 'Error: Failed to submit message.',
    };
  }

  // Anti-bot protection: Time-based validation (minimum 3 seconds)
  const formLoadTime = formData.get('formLoadTime');
  if (formLoadTime) {
    const loadTime = parseInt(formLoadTime as string, 10);
    const currentTime = Date.now();
    const timeDiff = currentTime - loadTime;
    
    // If form submitted in less than 3 seconds, likely a bot
    if (timeDiff < 3000) {
      console.warn('Bot detected: form submitted too quickly');
      return {
        ...newState,
        isSubmited: false,
        success: false,
        message: 'Error: Failed to submit message.',
      };
    }
  }

  // Validate form using Zod
  const validatedFields = CreateContact.safeParse({
    name: formData.get('name'),
    surname: formData.get('surname'),
    email: formData.get('email'),
    org: formData.get('org'),
    reason: formData.get('reason'),
    message: formData.get('message'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      ...newState,
      isSubmited: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing or invalid fields. Failed to submit message.',
    };
  }

  // Prepare email data
  const { name, surname, email, org, reason, message } = validatedFields.data;
  const date = getCurrentDate();

  const adminEmails = ADMIN_EMAILS
    ? ADMIN_EMAILS.split(';').map(email => email.trim()).filter(email => email)
    : [];

  if (adminEmails.length === 0) {
    throw new Error('No admin emails provided.');
  }

  // Persist admin-facing notification instead of sending admin emails
  try {
    const ADMIN_UI_BASE = process.env.NODE_ENV === 'production' ? 'https://sdg-innovation-commons.org' : (process.env.LOCAL_BASE_URL || 'http://localhost:3000');
    const adminUrl = `${ADMIN_UI_BASE}/admin/notifications`;
    const notif = await createNotification({
      type: 'contact_us',
      level: 'action_required',
      payload: {
        subject: `Contact Us from ${name} ${surname}`,
        message,
        from: { name, email, org },
        reason,
        date,
      },
      metadata: { adminUrl },
      related_uuids: [],
    });
    // Optionally log created notification id for debugging
    console.log('Created contact-us notification', notif?.id);
  } catch (notifyErr) {
    console.error('Failed to create admin notification for contact-us', notifyErr);
  }

  const mailOptions2 = {
    from: `SDG Commons <${SMTP_USER}>`,
    to: email,
    subject: `Your comment on the SDG Commons, powered by the UNDP Accelerator Labs`,
    text: `
        Dear contributor,

        Thank you for your message. It is well received and is being reviewed by team members of the UNDP Accelerator Labs who will get back to you shortly.
        
        Stay tuned.
            `,
    };

  // Send contact form data to admin email
  try {
    // Admin email suppressed; keep sender acknowledgement (in production only)
    if (process.env.NODE_ENV === 'production') {
      await transporter.sendMail(mailOptions2);
    } else {
      console.log('Dev mode - acknowledgement suppressed or logged', { mailOptions2 });
    }

    return {
      ...newState,
      isSubmited: true,
      success: true,
      message: 'Thank you for your message. Our focal point will contact you soon.',
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      ...newState,
      isSubmited: false,
      success: false,
      message: 'Error: Failed to send message.',
    };
  }
}
