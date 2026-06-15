import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Subscriber from '@/models/Subscriber';
import { sendEmail } from '@/lib/sendEmail';

export async function POST(req) {
  try {
    await dbConnect();
    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required.' }, { status: 400 });
    }

    const existingSubscriber = await Subscriber.findOne({ email: email.toLowerCase() });

    if (existingSubscriber) {
      return NextResponse.json({ error: 'You are already subscribed!' }, { status: 400 });
    }

    // Generate a unique 6-character discount code
    const uniqueCode = 'AURA-' + Math.random().toString(36).substring(2, 8).toUpperCase();

    await Subscriber.create({ 
      email: email.toLowerCase(),
      discountCode: uniqueCode 
    });

    // Send the Professional Welcome Email
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #ffffff;">
        <h1 style="font-size: 32px; font-weight: 900; letter-spacing: -1px; color: #000; text-align: center; margin-bottom: 30px; text-transform: uppercase;">
          AURA
        </h1>
        <div style="background-color: #f8f8f8; padding: 40px; text-align: center; border: 1px solid #eeeeee;">
          <h2 style="margin-top: 0; font-size: 24px; color: #000; text-transform: uppercase; letter-spacing: 1px;">Welcome to the Inner Circle</h2>
          <p style="color: #666; font-size: 14px; line-height: 1.6; margin-bottom: 30px;">
            Thank you for subscribing. You are now on the exclusive list to receive early access to new collections, secret sales, and editorial stories before anyone else.
          </p>
          <div style="background-color: #000; color: #fff; padding: 15px 30px; display: inline-block; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; font-size: 12px;">
            USE CODE: ${uniqueCode}
          </div>
          <p style="color: #999; font-size: 11px; margin-top: 20px;">For 10% off your first order.</p>
        </div>
        <div style="text-align: center; margin-top: 40px;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://www.aurafashion.store'}/shop" style="color: #000; text-decoration: none; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #000; padding-bottom: 2px;">
            Shop Now
          </a>
        </div>
      </div>
    `;

    // We don't await this so it doesn't block the UI response
    sendEmail({ 
      to: email, 
      subject: 'Welcome to the Aura Inner Circle', 
      html 
    }).catch(err => console.error("Failed to send welcome email:", err));

    return NextResponse.json({ message: 'Subscribed successfully!' }, { status: 201 });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
