import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    await dbConnect();
    const product = await Product.findById(id).select('reviews');
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    return NextResponse.json(product.reviews || [], { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req, { params }) {
  try {
    const { id } = await params;
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'You must be logged in to review a product.' }, { status: 401 });
    }

    const { rating, comment } = await req.json();

    if (!rating || !comment) {
      return NextResponse.json({ error: 'Rating and comment are required.' }, { status: 400 });
    }

    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    if (!product.reviews) {
      product.reviews = [];
    }

    // Check if user already reviewed
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === session.user.id.toString()
    );

    if (alreadyReviewed) {
      return NextResponse.json({ error: 'You have already reviewed this product.' }, { status: 400 });
    }

    const review = {
      user: session.user.id,
      userName: session.user.name || 'Anonymous',
      rating: Number(rating),
      comment,
    };

    product.reviews.push(review);
    product.reviewCount = product.reviews.length;
    product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save();

    return NextResponse.json({ message: 'Review added successfully', product }, { status: 201 });
  } catch (error) {
    console.error('Add review error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
