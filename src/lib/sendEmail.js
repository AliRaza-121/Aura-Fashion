import nodemailer from 'nodemailer';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export const sendEmail = async ({ to, subject, html }) => {
  if (resend) {
    try {
      const { data, error } = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'Acme <onboarding@resend.dev>',
        to: [to],
        subject,
        html,
      });

      if (error) {
        console.error("Error sending email via Resend:", error);
        return false;
      }
      
      console.log("Message sent via Resend:", data.id);
      return true;
    } catch (error) {
      console.error("Exception sending email via Resend:", error);
      return false;
    }
  }

  // Fallback to Nodemailer
  if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
    console.warn("Neither RESEND_API_KEY nor SMTP_EMAIL/PASSWORD are configured.");
    return false;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `"Aura Store" <${process.env.SMTP_EMAIL}>`,
      to,
      subject,
      html,
    });
    console.log("Message sent: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};
