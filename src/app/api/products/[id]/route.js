import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    const product = await Product.findById(resolvedParams.id).lean();
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    return NextResponse.json(product);
  } catch (error) {
    console.error('Fetch Product Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
