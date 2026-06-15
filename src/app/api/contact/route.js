import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/sendEmail';
import rateLimit from '@/lib/rateLimit';

export async function POST(req) {
  try {
    const rateLimitResult = rateLimit(req, 5, 60000); // 5 requests per minute
    if (!rateLimitResult.success) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const { name, email, subject, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required.' }, { status: 400 });
    }

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea;">
        <h2 style="color: #000; border-bottom: 2px solid #000; padding-bottom: 10px;">New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject || 'No Subject'}</p>
        <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #000; margin-top: 20px;">
          <p style="margin: 0; white-space: pre-wrap;">${message}</p>
        </div>
      </div>
    `;

    // Send the email to the admin/store owner (using the same email address configured in SMTP_EMAIL)
    const adminEmail = process.env.SMTP_EMAIL;
    
    if (!adminEmail) {
      return NextResponse.json({ error: 'Server email configuration is missing.' }, { status: 500 });
    }

    const emailSent = await sendEmail({
      to: adminEmail,
      subject: `Aura Contact: ${subject || 'New Message'} from ${name}`,
      html: htmlContent,
    });

    if (!emailSent) {
      return NextResponse.json({ error: 'Failed to send message. Please try again later.' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Contact Form Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
