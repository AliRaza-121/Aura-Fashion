import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import ShopClient from './ShopClient';

export const revalidate = 60; // Cache for 60 seconds

export default async function ShopPage() {
  await dbConnect();
  
  // Fetch all products from the database for the shop
  // We use .lean() for faster execution and smaller memory footprint
  const products = await Product.find({}).lean();
  
  // Serialize the data to stringify MongoDB ObjectIds for client components
  const serializedProducts = JSON.parse(JSON.stringify(products)).map(p => ({
    ...p,
    id: p._id
  }));

  return <ShopClient initialProducts={serializedProducts} />;
}