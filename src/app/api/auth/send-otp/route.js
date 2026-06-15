import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { sendEmail } from '@/lib/sendEmail';

export async function POST(req) {
  try {
    await dbConnect();
    const { email, type } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins from now

    let user = await User.findOne({ email });

    if (type === 'register') {
      if (user && user.isVerified) {
        return NextResponse.json({ error: 'Email is already registered and verified.' }, { status: 400 });
      }
      if (!user) {
        // Create an unverified dummy user just to hold the OTP
        user = new User({ email, name: 'Pending User', isVerified: false, password: 'pending_password_will_be_overwritten' });
      }
    } else if (type === 'forgot_password') {
      if (!user || !user.isVerified) {
        return NextResponse.json({ error: 'No verified account found with this email.' }, { status: 400 });
      }
    }

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // Send the email
    const subject = type === 'register' ? 'Your Aura Verification Code' : 'Reset Your Aura Password';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #000; text-align: center;">Aura Fashion</h2>
        <p>Your one-time verification code is:</p>
        <h1 style="font-size: 40px; letter-spacing: 5px; color: #000; text-align: center; background: #f4f4f5; padding: 20px; border-radius: 10px;">${otp}</h1>
        <p style="color: #666; font-size: 12px; text-align: center;">This code will expire in 10 minutes. Do not share this with anyone.</p>
      </div>
    `;

    const emailSent = await sendEmail({ to: email, subject, html });

    if (!emailSent) {
      return NextResponse.json({ error: 'Failed to send email. Please check SMTP configuration.' }, { status: 500 });
    }

    return NextResponse.json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Send OTP Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
