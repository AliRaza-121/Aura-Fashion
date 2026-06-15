import dbConnect from '@/lib/db';
import SiteContent from '@/models/SiteContent';
import Product from '@/models/Product';
import dynamic from 'next/dynamic';

import TopBar from '@/components/TopBar';
import Header from '@/components/Header';
import NavBar from '@/components/NavBar';
import Hero from '@/components/Hero';
import ProductSection from '@/components/ProductSection';
import Footer from '@/components/Footer';

// Lazy-load client components to code-split their JavaScript
const BestSellersSection = dynamic(() => import('@/components/BestSellersSection'));
const Lookbook = dynamic(() => import('@/components/Lookbook'));
const ParallaxCampaign = dynamic(() => import('@/components/ParallaxCampaign'));
const FeaturedLook = dynamic(() => import('@/components/FeaturedLook'));

// Cache the page for 60 seconds — admin changes appear within a minute
export const revalidate = 60;

export default async function Home() {
  await dbConnect();
  // Run all DB queries in parallel instead of sequentially
  const [content, newArrivals, bestSellers] = await Promise.all([
    SiteContent.findOne({ identifier: 'global_content' })
      .populate('parallaxCampaign.productId')
      .populate('featuredLook.item1ProductId')
      .populate('featuredLook.item2ProductId')
      .populate('featuredLook.item3ProductId')
      .populate('lookbook.item1ProductId')
      .populate('lookbook.item2ProductId')
      .populate('lookbook.item3ProductId')
      .lean(),
    Product.find({ isFeatured: true }).lean(),
    Product.find({ isBestSeller: true }).lean(),
  ]);

  const defaultContent = {
    visibility: {
      hero: true, newArrivals: true, bestSellers: true, lookbook: true, parallaxCampaign: true, featuredLook: true
    },
    hero: { heading: "NEW POCKET LONG SLEEVE SHIRT", subheading: "AURA MENS", buttonText: "SHOP MENS", buttonLink: "/shop?category=mens", image: "/hero_fashion_bg.png" },
    parallaxCampaign: { heading: "The Winter\nCollection", subheading: "Embrace the cold with our most premium fabrics.", buttonText: "PRE-ORDER NOW", buttonLink: "/shop", image: "/parallax_campaign.png" },
    featuredLook: { heading: "Urban\nNomad", description: "A masterclass in transitional dressing.", bundlePrice: 45000, buttonText: "ADD BUNDLE TO CART", image: "/lookbook_portrait.png" },
    lookbook: { 
      heading: "SHOP THE LOOK", 
      subheading: "Editorial Style", 
      shopHeading: "The Autumn Edit",
      shopDescription: "Discover the perfect balance of comfort and sophistication. This curated look combines oversized tailoring with effortless drape, designed for the modern wardrobe.",
      buttonText: "ADD ENTIRE LOOK TO CART",
      images: ["/lookbook_portrait.png", "/product_card_1.png", "/product_card_2.png", "/product_card_1.png"],
      item1Top: "20%", item1Left: "30%",
      item2Top: "60%", item2Left: "45%",
      item3Top: "45%", item3Left: "70%"
    }
  };
  
  // Merge database content with defaults to handle missing fields in older documents
  const heroContent = content ? {
    visibility: { ...defaultContent.visibility, ...(content.visibility || {}) },
    hero: { ...defaultContent.hero, ...(content.hero || {}) },
    parallaxCampaign: { ...defaultContent.parallaxCampaign, ...(content.parallaxCampaign || {}) },
    featuredLook: { ...defaultContent.featuredLook, ...(content.featuredLook || {}) },
    lookbook: { ...defaultContent.lookbook, ...(content.lookbook || {}) }
  } : defaultContent;

  // Serialize content to strip Mongoose ObjectIds
  const serializedContent = JSON.parse(JSON.stringify(heroContent));
  const visibility = serializedContent.visibility;

  // Convert ObjectIds to strings to avoid Next.js serialization warnings
  const serializedNewArrivals = JSON.parse(JSON.stringify(newArrivals)).map(p => ({ ...p, id: p._id }));
  const serializedBestSellers = JSON.parse(JSON.stringify(bestSellers)).map(p => ({ ...p, id: p._id }));

  return (
    <main className="min-h-screen bg-white">
      <TopBar />
      <Header />
      <NavBar />
      {visibility.hero && <Hero data={serializedContent.hero} />}
      {visibility.newArrivals && <ProductSection products={serializedNewArrivals} />}
      {visibility.bestSellers && <BestSellersSection products={serializedBestSellers} />}
      {visibility.lookbook && <Lookbook data={serializedContent.lookbook} />}
      {visibility.parallaxCampaign && <ParallaxCampaign data={serializedContent.parallaxCampaign} />}
      {visibility.featuredLook && <FeaturedLook data={serializedContent.featuredLook} />}
      <Footer />
    </main>
  );
}
