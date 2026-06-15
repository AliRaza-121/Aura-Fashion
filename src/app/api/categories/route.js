import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    
    // Aggregate unique subcategories per main category
    const pipeline = [
      {
        $group: {
          _id: "$category",
          subCategories: { $addToSet: "$subCategory" }
        }
      }
    ];
    
    const results = await Product.aggregate(pipeline);
    
    const formatted = {
      Mens: [],
      Womens: [],
      Kids: []
    };
    
    results.forEach(r => {
      if (formatted[r._id] !== undefined) {
        // Filter out empty strings/nulls and sort alphabetically
        formatted[r._id] = r.subCategories.filter(Boolean).sort();
      }
    });
    
    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
