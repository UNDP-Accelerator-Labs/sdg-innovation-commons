import nodemailer from 'nodemailer';
//Environment variables
const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, ADMIN_EMAILS, SMTP_SERVICE, NODE_ENV } = process.env;

//Email function
export async function sendEmail(to: string, cc: string | null | undefined, subject: string, html: string) {
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    console.warn('SMTP configuration is missing. Email not sent.');
    return;
  }

  const transportOptions: any = SMTP_SERVICE
    ? { service: SMTP_SERVICE, auth: { user: SMTP_USER, pass: SMTP_PASS } }
    : { host: SMTP_HOST, port: Number(SMTP_PORT), auth: { user: SMTP_USER, pass: SMTP_PASS } };

  const transporter = nodemailer.createTransport(transportOptions);

  let mailOptions: nodemailer.SendMailOptions = {
    from: `"SDG Innovation Commons" <${SMTP_USER}>`,
    to,
    subject,
    html,
  };

  if (cc) {
    mailOptions = { ...mailOptions, cc };
  }
  
  try {
    if (NODE_ENV === 'production') {    
    await transporter.sendMail(mailOptions);
    } else {
        console.log('Email content (not sent in non-production environment):', mailOptions);
    }
    console.log(`Email sent to ${to} with subject "${subject}"`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}