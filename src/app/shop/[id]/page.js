import ProductDetailClient from './ProductDetailClient';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import SiteContent from '@/models/SiteContent';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
  await dbConnect();
  const resolvedParams = await params;
  let product = null;

  if (resolvedParams.id.startsWith('lookbook-bundle-') || resolvedParams.id.startsWith('featured-bundle-')) {
    // Keep bundle pseudo products if any external links somehow still point to them
    const content = await SiteContent.findOne({ identifier: 'global_content' }).lean();
    if (content) {
      if (resolvedParams.id === 'lookbook-bundle-1') product = { title: `${content.lookbook?.shopHeading || 'The Autumn Edit'} Bundle`, description: content.lookbook?.shopDescription || 'Discover the perfect balance of comfort and sophistication.', images: content.lookbook?.images?.length ? content.lookbook.images : ['/lookbook_portrait.png', '/product_card_1.png', '/product_card_2.png', '/product_card_1.png'] };
      if (resolvedParams.id === 'featured-bundle-1') product = { title: `${content.featuredLook?.heading ? content.featuredLook.heading.replace(/\n/g, ' ') : 'Urban Nomad'} Bundle`, description: 'A complete exclusive bundle.', images: [content.featuredLook?.image || '/lookbook_portrait.png', content.featuredLook?.item1Image || '/product_card_1.png', content.featuredLook?.item2Image || '/product_card_2.png', content.featuredLook?.item3Image || '/product_card_1.png'] };
    }
  } else {
    try {
      product = await Product.findById(resolvedParams.id).lean();
    } catch (e) {
      // CastError for invalid ObjectIds
    }
  }
  
  if (!product) return { title: 'Product Not Found' };
  
  return {
    title: `${product.title} | Aura`,
    description: product.description,
    openGraph: {
      images: product.images && product.images.length > 0 ? [product.images[0]] : [],
    },
  };
}

export default async function ProductDetailPage({ params }) {
  await dbConnect();
  const resolvedParams = await params;
  
  let productDoc = null;

  if (resolvedParams.id.startsWith('lookbook-bundle-') || resolvedParams.id.startsWith('featured-bundle-')) {
    const content = await SiteContent.findOne({ identifier: 'global_content' }).lean();
    if (content) {
      if (resolvedParams.id === 'lookbook-bundle-1') {
        productDoc = { _id: resolvedParams.id, title: `${content.lookbook?.shopHeading || 'The Autumn Edit'} Bundle`, price: content.lookbook?.bundlePrice || 33700, description: content.lookbook?.shopDescription || 'Discover the perfect balance of comfort and sophistication. This curated look combines oversized tailoring with effortless drape.', images: content.lookbook?.images?.length ? content.lookbook.images : ['/lookbook_portrait.png', '/product_card_1.png', '/product_card_2.png', '/product_card_1.png'], sizes: ['S', 'M', 'L'] };
      }
      if (resolvedParams.id === 'featured-bundle-1') {
        productDoc = { _id: resolvedParams.id, title: `${content.featuredLook?.heading ? content.featuredLook.heading.replace(/\n/g, ' ') : 'Urban Nomad'} Bundle`, price: content.featuredLook?.bundlePrice || 45000, description: content.featuredLook?.description || 'A complete exclusive bundle.', images: [content.featuredLook?.image || '/lookbook_portrait.png'], sizes: ['S', 'M', 'L'] };
      }
    }
  } else {
    try {
      productDoc = await Product.findById(resolvedParams.id).lean();
    } catch (e) {
      return notFound();
    }
  }

  if (!productDoc) return notFound();
  
  const serializedDoc = JSON.parse(JSON.stringify(productDoc));
  const product = { 
    ...serializedDoc, 
    _id: serializedDoc._id, 
    id: serializedDoc._id 
  };

  return <ProductDetailClient product={product} />;
}
