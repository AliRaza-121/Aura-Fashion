import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import rateLimit from '@/lib/rateLimit';

export async function PUT(request) {
  try {
    const rateLimitResult = rateLimit(request, 10, 60000); // 10 requests per minute
    if (!rateLimitResult.success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    
    if (data.profilePicture !== undefined && typeof data.profilePicture !== 'string') {
      return NextResponse.json({ error: 'Invalid profile picture format' }, { status: 400 });
    }

    await dbConnect();

    // Currently only updating profilePicture, but could easily be expanded
    const updateData = {};
    if (data.profilePicture !== undefined) {
      updateData.profilePicture = data.profilePicture;
    }

    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      { $set: updateData },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      message: 'Profile updated',
      profilePicture: updatedUser.profilePicture
    });
  } catch (error) {
    console.error('Profile Update Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
