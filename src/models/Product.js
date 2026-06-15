import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a product title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price in PKR'],
    },
    images: {
      type: [String], // Array of URLs (Fallback/Default images)
      required: true,
    },
    colorImages: [
      {
        color: { type: String, required: true },
        images: { type: [String], required: true },
      }
    ],
    category: {
      type: String,
      required: true,
      enum: ['Mens', 'Womens', 'Kids'],
      index: true,
    },
    subCategory: {
      type: String,
      default: '',
    },
    sizes: {
      type: [String],
      default: ['S', 'M', 'L', 'XL'],
    },
    colors: {
      type: [String],
      default: ['Black', 'White'],
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    isBestSeller: {
      type: Boolean,
      default: false,
      index: true,
    },
    stockQuantity: {
      type: Number,
      default: 10,
    },
    rating: {
      type: Number,
      default: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    reviews: [ReviewSchema],
    features: {
      type: String,
      default: '',
    },
    shippingDetails: {
      type: String,
      default: '',
    },
    liveViewers: {
      type: Number,
      default: 23,
    },
    sku: {
      type: String,
      default: '',
    }
  },
  { timestamps: true }
);

// Prevent mongoose from compiling the model multiple times in Next.js development
export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
