import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import rateLimit from '@/lib/rateLimit';

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  otp: z.string().length(6, "OTP must be 6 digits"),
  profilePicture: z.string().optional(),
});

export async function POST(req) {
  try {
    const rateLimitResult = rateLimit(req, 5, 60000); // 5 requests per minute
    if (!rateLimitResult.success) {
      return NextResponse.json({ error: 'Too many registration attempts. Please try again later.' }, { status: 429 });
    }

    await dbConnect();
    const rawBody = await req.json();

    const parseResult = registerSchema.safeParse(rawBody);
    if (!parseResult.success) {
      return NextResponse.json({ error: 'Invalid input data', details: parseResult.error.format() }, { status: 400 });
    }

    const { name, email, password, otp, profilePicture } = parseResult.data;

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: 'No verification requested for this email' }, { status: 400 });
    }

    if (user.isVerified) {
      return NextResponse.json({ error: 'Email is already verified and registered' }, { status: 400 });
    }

    if (user.otp !== otp) {
      return NextResponse.json({ error: 'Invalid verification code' }, { status: 400 });
    }

    if (new Date() > user.otpExpiry) {
      return NextResponse.json({ error: 'Verification code has expired. Please request a new one.' }, { status: 400 });
    }

    // Code is valid. Finalize registration
    const hashedPassword = await bcrypt.hash(password, 10);
    user.name = name;
    user.password = hashedPassword;
    user.isVerified = true;
    if (profilePicture) user.profilePicture = profilePicture;
    user.otp = undefined;
    user.otpExpiry = undefined;
    
    await user.save();

    return NextResponse.json({ message: 'Registration successful' });
  } catch (error) {
    console.error('Registration Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
