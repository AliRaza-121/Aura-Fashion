import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    await dbConnect();

    // Support both 24-character ObjectIds and 6-character short codes
    let order;

    if (id.length === 24 && /^[0-9a-fA-F]{24}$/.test(id)) {
      order = await Order.findById(id).select('status orderItems totalPrice shippingPrice itemsPrice createdAt expectedDeliveryDate shippingAddress.city');
    } else if (id.length >= 6) {
      // Search by the end of the ObjectId string
      const matchingOrders = await Order.aggregate([
        { $addFields: { stringId: { $toString: '$_id' } } },
        { $match: { stringId: { $regex: new RegExp(`${id}$`, 'i') } } },
        { $limit: 1 }
      ]);
      
      if (matchingOrders.length > 0) {
        order = matchingOrders[0];
      }
    } else {
      return NextResponse.json({ error: 'Order ID must be at least 6 characters' }, { status: 400 });
    }

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    console.error('Order tracking fetch error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
