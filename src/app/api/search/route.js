import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json([]);
    }

    // Search by title, category, or description using regex (case-insensitive)
    const regex = new RegExp(query, 'i');
    
    const products = await Product.find({
      $or: [
        { title: { $regex: regex } },
        { name: { $regex: regex } },
        { category: { $regex: regex } },
        { description: { $regex: regex } }
      ]
    }).lean();

    return NextResponse.json(products);
  } catch (error) {
    console.error('Search API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
