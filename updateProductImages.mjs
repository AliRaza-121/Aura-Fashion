import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env.local');
const envFile = fs.readFileSync(envPath, 'utf8');
const mongoLine = envFile.split('\n').find(line => line.startsWith('MONGODB_URI='));
const mongoUri = mongoLine.split('=')[1].trim();

const ProductSchema = new mongoose.Schema({ title: String, images: [String] }, { strict: false });
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

const imageMap = {
  "Essential Oxford Shirt": "/mens_oxford_shirt.png",
  "Minimalist Wool Trousers": "/mens_wool_trousers.png",
  "Heavyweight Boxy Hoodie": "/mens_boxy_hoodie.png",
  "Cashmere Turtleneck Sweater": "/mens_cashmere_turtleneck.png",
  "Classic Leather Chelsea Boots": "/mens_chelsea_boots.png",
  "Silk Slip Dress": "/womens_slip_dress.png",
  "Oversized Cashmere Coat": "/womens_cashmere_coat.png",
  "High-Rise Tailored Wide Leg Pants": "/womens_wide_leg_pants.png",
  "Ribbed Knit Halter Top": "/womens_halter_top.png",
  "Leather Crossbody Mini Bag": "/womens_mini_bag.png",
  "Cotton Graphic Tee": "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=400&auto=format&fit=crop",
  "Denim Overalls": "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?q=80&w=400&auto=format&fit=crop",
  "Fleece Zip-Up Jacket": "https://images.unsplash.com/photo-1622290319146-7b63df48a635?q=80&w=400&auto=format&fit=crop",
  "Classic Canvas Sneakers": "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=400&auto=format&fit=crop",
  "Knit Sweater Cardigan": "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=400&auto=format&fit=crop"
};

async function updateProductImages() {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    const products = await Product.find();
    for (let product of products) {
      if (imageMap[product.title]) {
        product.images = [imageMap[product.title]];
        await product.save();
        console.log(`Updated images for: ${product.title}`);
      }
    }
    
  } catch (error) {
    console.error('Error updating DB:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

updateProductImages();
