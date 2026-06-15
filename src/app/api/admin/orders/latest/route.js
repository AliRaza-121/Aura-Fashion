import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';

export async function GET() {
  try {
    await dbConnect();

    // Find the single most recent order based on createdAt
    const latestOrder = await Order.findOne()
      .sort({ createdAt: -1 })
      .select('createdAt shippingAddress totalPrice _id')
      .lean();

    if (!latestOrder) {
      return NextResponse.json({ timestamp: null });
    }

    return NextResponse.json({
      timestamp: latestOrder.createdAt,
      orderId: latestOrder._id,
      customerName: latestOrder.shippingAddress?.fullName || 'A Customer',
      amount: latestOrder.totalPrice
    });
  } catch (error) {
    console.error('Error fetching latest order:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
