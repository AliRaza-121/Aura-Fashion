import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import rateLimit from '@/lib/rateLimit';

export async function GET(request) {
  try {
    const rateLimitResult = rateLimit(request, 100, 60000); // 100 requests per minute
    if (!rateLimitResult.success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    await dbConnect();
    const { searchParams } = new URL(request.url);
    const filter = {};
    
    if (searchParams.has('isFeatured')) {
      filter.isFeatured = searchParams.get('isFeatured') === 'true';
    }
    if (searchParams.has('isBestSeller')) {
      filter.isBestSeller = searchParams.get('isBestSeller') === 'true';
    }
    if (searchParams.has('category')) {
      filter.category = searchParams.get('category');
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const rateLimitResult = rateLimit(request, 20, 60000); // 20 requests per minute for POST
    if (!rateLimitResult.success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const data = await request.json();
    
    // Server-side validation
    if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
      return NextResponse.json({ error: 'Valid title is required' }, { status: 400 });
    }
    if (typeof data.price !== 'number' || data.price < 0) {
      return NextResponse.json({ error: 'Valid positive price is required' }, { status: 400 });
    }
    if (!Array.isArray(data.images) || data.images.length === 0) {
      return NextResponse.json({ error: 'At least one image is required' }, { status: 400 });
    }

    await dbConnect();
    
    const newProduct = await Product.create(data);
    
    revalidatePath('/');
    revalidatePath('/shop');

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
