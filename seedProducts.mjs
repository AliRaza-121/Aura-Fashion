import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

// Load .env.local manually
const envPath = path.resolve(process.cwd(), '.env.local');
const envFile = fs.readFileSync(envPath, 'utf8');
const mongoLine = envFile.split('\n').find(line => line.startsWith('MONGODB_URI='));
const mongoUri = mongoLine.split('=')[1].trim();

const ProductSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    price: Number,
    images: [String],
    category: {
      type: String,
      enum: ['Mens', 'Womens', 'Kids'],
    },
    sizes: [String],
    colors: [String],
    inStock: Boolean,
    isFeatured: Boolean,
    isBestSeller: Boolean,
  },
  { timestamps: true, strict: false }
);

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

const MENS_PRODUCTS = [
  {
    title: "Essential Oxford Shirt",
    description: "A tailored fit oxford shirt made from 100% premium cotton.",
    price: 6500,
    category: "Mens",
    isFeatured: true,
  },
  {
    title: "Minimalist Wool Trousers",
    description: "Sleek and versatile wool-blend trousers for any formal or smart-casual occasion.",
    price: 8500,
    category: "Mens",
    isBestSeller: true,
  },
  {
    title: "Heavyweight Boxy Hoodie",
    description: "An ultra-premium heavy cotton hoodie with a relaxed, boxy fit.",
    price: 9000,
    category: "Mens",
  },
  {
    title: "Cashmere Turtleneck Sweater",
    description: "Luxuriously soft pure cashmere turtleneck sweater.",
    price: 18000,
    category: "Mens",
    isFeatured: true,
  },
  {
    title: "Classic Leather Chelsea Boots",
    description: "Handcrafted genuine leather Chelsea boots with a slim profile.",
    price: 24000,
    category: "Mens",
    isBestSeller: true,
  }
];

const WOMENS_PRODUCTS = [
  {
    title: "Silk Slip Dress",
    description: "An elegant, minimalist 100% pure silk slip dress with a draped cowl neck.",
    price: 12000,
    category: "Womens",
    isBestSeller: true,
    isFeatured: true,
  },
  {
    title: "Oversized Cashmere Coat",
    description: "A stunning draped cashmere overcoat, perfect for layering.",
    price: 35000,
    category: "Womens",
    isFeatured: true,
  },
  {
    title: "High-Rise Tailored Wide Leg Pants",
    description: "Crisp and sophisticated wide-leg trousers that elongate the silhouette.",
    price: 8500,
    category: "Womens",
  },
  {
    title: "Ribbed Knit Halter Top",
    description: "A chic, fitted ribbed knit halter top.",
    price: 4500,
    category: "Womens",
  },
  {
    title: "Leather Crossbody Mini Bag",
    description: "Premium smooth leather mini bag with gold-tone hardware.",
    price: 14000,
    category: "Womens",
    isBestSeller: true,
  }
];

const KIDS_PRODUCTS = [
  {
    title: "Cotton Graphic Tee",
    description: "Soft, breathable 100% organic cotton tee with a fun playful print.",
    price: 2500,
    category: "Kids",
    isBestSeller: true,
  },
  {
    title: "Denim Overalls",
    description: "Durable and stylish light-wash denim overalls with adjustable straps.",
    price: 5500,
    category: "Kids",
    isFeatured: true,
  },
  {
    title: "Fleece Zip-Up Jacket",
    description: "Cozy and warm fleece jacket perfect for chilly playground days.",
    price: 4800,
    category: "Kids",
  },
  {
    title: "Classic Canvas Sneakers",
    description: "Comfortable slip-on canvas sneakers with rubber toe caps.",
    price: 3200,
    category: "Kids",
  },
  {
    title: "Knit Sweater Cardigan",
    description: "A chunky knit button-down cardigan for stylish layering.",
    price: 4500,
    category: "Kids",
    isBestSeller: true,
  }
];

async function seedProducts() {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    const allProducts = [...MENS_PRODUCTS, ...WOMENS_PRODUCTS, ...KIDS_PRODUCTS].map((p, index) => ({
      ...p,
      images: [index % 2 === 0 ? "/product_card_1.png" : "/product_card_2.png"],
      sizes: ["S", "M", "L", "XL"],
      colors: ["Black", "White", "Navy"],
      inStock: true,
      isFeatured: p.isFeatured || false,
      isBestSeller: p.isBestSeller || false,
    }));

    await Product.insertMany(allProducts);
    console.log('Successfully inserted 15 products!');
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seedProducts();
