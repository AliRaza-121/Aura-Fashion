import mongoose from 'mongoose';

const SiteContentSchema = new mongoose.Schema(
  {
    identifier: {
      type: String,
      required: true,
      unique: true,
      default: 'global_content'
    },
    visibility: {
      hero: { type: Boolean, default: true },
      newArrivals: { type: Boolean, default: true },
      bestSellers: { type: Boolean, default: true },
      lookbook: { type: Boolean, default: true },
      parallaxCampaign: { type: Boolean, default: true },
      featuredLook: { type: Boolean, default: true }
    },
    hero: {
      heading: { type: String, default: "NEW POCKET LONG SLEEVE SHIRT" },
      subheading: { type: String, default: "AURA MENS" },
      buttonText: { type: String, default: "SHOP MENS" },
      buttonLink: { type: String, default: "/shop?category=mens" },
      image: { type: String, default: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?q=80&w=1920&auto=format&fit=crop" }
    },
    parallaxCampaign: {
      heading: { type: String, default: "The Winter\nCollection" },
      subheading: { type: String, default: "Embrace the cold with our most premium fabrics. Exclusively crafted for the bold." },
      buttonText: { type: String, default: "PRE-ORDER NOW" },
      buttonLink: { type: String, default: "/shop" },
      image: { type: String, default: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1920&auto=format&fit=crop" },
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }
    },
    featuredLook: {
      heading: { type: String, default: "Urban\nNomad" },
      description: { type: String, default: "A masterclass in transitional dressing. Combine functional outerwear with soft, breathable layers for a look that thrives in unpredictable city climates." },
      bundlePrice: { type: Number, default: 45000 },
      buttonText: { type: String, default: "ADD BUNDLE TO CART" },
      image: { type: String, default: "/lookbook_portrait.png" },
      item1ProductId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      item2ProductId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      item3ProductId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }
    },
    lookbook: {
      heading: { type: String, default: "SHOP THE LOOK" },
      subheading: { type: String, default: "Editorial Style" },
      shopHeading: { type: String, default: "The Autumn Edit" },
      shopDescription: { type: String, default: "Discover the perfect balance of comfort and sophistication. This curated look combines oversized tailoring with effortless drape, designed for the modern wardrobe." },
      buttonText: { type: String, default: "ADD ENTIRE LOOK TO CART" },
      images: { type: [String], default: ["https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop", "https://images.unsplash.com/photo-1520975954732-57dd22299614?q=80&w=800&auto=format&fit=crop", "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=800&auto=format&fit=crop", "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop"] },
      item1ProductId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      item1Top: { type: String, default: "20%" },
      item1Left: { type: String, default: "30%" },
      item2ProductId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      item2Top: { type: String, default: "60%" },
      item2Left: { type: String, default: "45%" },
      item3ProductId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      item3Top: { type: String, default: "45%" },
      item3Left: { type: String, default: "70%" }
    }
  },
  { timestamps: true }
);

// Force Next.js hot reload to pick up schema changes
if (mongoose.models.SiteContent) {
  delete mongoose.models.SiteContent;
}
export default mongoose.model('SiteContent', SiteContentSchema);
