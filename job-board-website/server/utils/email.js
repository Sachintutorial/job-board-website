import nodemailer from 'nodemailer';
export async function sendApplicationEmail(to, jobTitle) {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS || !to) {
    console.log(`Email skipped (SMTP not configured). Application received for: ${jobTitle}`); return;
  }
  const transporter = nodemailer.createTransport({ host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT || 587), secure: Number(process.env.SMTP_PORT) === 465, auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } });
  await transporter.sendMail({ from: process.env.EMAIL_FROM || process.env.SMTP_USER, to, subject: `Application received: ${jobTitle}`, text: `Your application for ${jobTitle} has been received. Thank you for applying!` });
}
