import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

// Load .env.local manually
const envPath = path.resolve(process.cwd(), '.env.local');
const envFile = fs.readFileSync(envPath, 'utf8');
const mongoLine = envFile.split('\n').find(line => line.startsWith('MONGODB_URI='));
const mongoUri = mongoLine.split('=')[1].trim();

// Minimal Schema to match SiteContent
const SiteContentSchema = new mongoose.Schema({
  hero: {
    heading: String,
    subheading: String,
    buttonText: String,
    buttonLink: String,
    image: String,
  },
  parallaxCampaign: {
    heading: String,
    subheading: String,
    buttonText: String,
    buttonLink: String,
    image: String,
    productName: String,
    productPrice: Number,
    productImage: String,
  }
}, { strict: false });

const SiteContent = mongoose.models.SiteContent || mongoose.model('SiteContent', SiteContentSchema);

async function updateDb() {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    const content = await SiteContent.findOne();
    if (content) {
      // Update Hero
      content.hero.heading = "ELEVATE YOUR EVERYDAY";
      content.hero.subheading = "AURA EXCLUSIVES";
      content.hero.buttonText = "SHOP COLLECTION";
      content.hero.buttonLink = "/shop";
      content.hero.image = "/hero_fashion_bg.png";

      // Also ensure campaign uses local image just in case
      content.parallaxCampaign.image = "/parallax_campaign.png";
      content.parallaxCampaign.productImage = "/product_card_1.png";

      await content.save();
      console.log('SiteContent updated successfully!');
    } else {
      console.log('No SiteContent found in DB. Creating one...');
      await SiteContent.create({
        hero: {
          heading: "ELEVATE YOUR EVERYDAY",
          subheading: "AURA EXCLUSIVES",
          buttonText: "SHOP COLLECTION",
          buttonLink: "/shop",
          image: "/hero_fashion_bg.png",
        },
        parallaxCampaign: {
          heading: "The Winter\nCollection",
          subheading: "Embrace the cold with our most premium fabrics.",
          buttonText: "PRE-ORDER NOW",
          buttonLink: "/shop",
          image: "/parallax_campaign.png",
          productName: "Alpine Puffer Coat",
          productPrice: 35000,
          productImage: "/product_card_1.png",
        }
      });
      console.log('SiteContent created successfully!');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

updateDb();
