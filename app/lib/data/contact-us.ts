'use server';
import { z } from 'zod';
import nodemailer from 'nodemailer';
import { redirect } from 'next/navigation';

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
  message: z.string().min(1, 'Please provide your message.'),
  date: z.string().optional(), // Optional as it is automatically generated
});

export type ContactState = {
  errors?: {
    name?: string[];
    surname?: string[];
    email?: string[];
    org?: string[];
    message?: string[];
  };
  message?: string | null;
};

const CreateContact = ContactSchema.omit({ date: true });

export async function createContact(prevState: ContactState, formData: FormData) {
  // Validate form using Zod
  const validatedFields = CreateContact.safeParse({
    name: formData.get('name'),
    surname: formData.get('surname'),
    email: formData.get('email'),
    org: formData.get('org'),
    message: formData.get('message'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing or invalid fields. Failed to submit message.',
    };
  }

  // Prepare email data
  const { name, surname, email, org, message } = validatedFields.data;
  const date = getCurrentDate();

  const mailOptions = {
    from: email,
    to: ADMIN_EMAILS,
    subject: `Contact form submission from ${name} ${surname}`,
    text: `
      Name: ${name} ${surname}
      Email: ${email}
      Organization: ${org}
      Message: ${message}
      Date: ${date}
    `,
  };

  // Send contact form data to admin email
  try {
    await transporter.sendMail(mailOptions);
    redirect('/');
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      message: 'Error: Failed to send message.',
    };
  }
}
