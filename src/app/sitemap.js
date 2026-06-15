import dbConnect from '@/lib/db';
import Product from '@/models/Product';

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  // Get all products from DB for dynamic routes
  try {
    await dbConnect();
    const products = await Product.find({}, '_id updatedAt');
    
    const productUrls = products.map((product) => ({
      url: `${baseUrl}/shop/${product._id}`,
      lastModified: product.updatedAt || new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0,
      },
      {
        url: `${baseUrl}/shop`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
      ...productUrls,
    ];
  } catch (error) {
    console.error("Sitemap generation error:", error);
    // Return static URLs if DB fails
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0,
      },
      {
        url: `${baseUrl}/shop`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      }
    ];
  }
}
