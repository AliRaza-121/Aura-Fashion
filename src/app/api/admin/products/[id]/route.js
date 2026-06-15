import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function PUT(request, { params }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const data = await request.json();
    await dbConnect();
    
    const updatedProduct = await Product.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    
    if (!updatedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    
    revalidatePath('/');
    revalidatePath('/shop');
    revalidatePath(`/shop/${id}`);
    revalidatePath('/shop/[id]', 'page');
    
    return NextResponse.json(updatedProduct);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    await dbConnect();
    
    const deletedProduct = await Product.findByIdAndDelete(id);
    
    if (!deletedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    
    revalidatePath('/');
    revalidatePath('/shop');
    revalidatePath(`/shop/${id}`);
    revalidatePath('/shop/[id]', 'page');
    
    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
