'use server';
import { z } from 'zod';
import nodemailer from 'nodemailer';

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

const CreateContact = ContactSchema.omit({ date: true });

export async function createContact(prevState: ContactState, formData: FormData): Promise<ContactState> {

  let newState: ContactState = { ...prevState, isSubmited: false };

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

  const to = adminEmails[0]
  const cc = adminEmails.length > 1 ? adminEmails.slice(1).join(';') : '';

  const mailOptions = {
    from: `SDG Commons <${SMTP_USER}>`,
    to,
    cc,
    subject: `Contact Form Submission from ${name} ${surname}`,
    text: `
        Dear Admin,

        You have received a new contact form submission on the platform. Below are the details:

        Name: ${name} ${surname}  
        Email: ${email}  
        Organization: ${org || 'N/A'}  
        Reason for Contact: ${reason}  
        Message:  
        ${message}

        Submission Date: ${date}

        Please review the submission and take the necessary actions.

        Best regards,  
        SDG Commons Platform
            `,
    };

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
    process.env.NODE_ENV === 'production' ? await transporter.sendMail(mailOptions) : null;
    process.env.NODE_ENV === 'production' ? await transporter.sendMail(mailOptions2) : null;

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
