"use client";
import { useState, useEffect } from 'react';
import TopBar from '@/components/TopBar';
import Header from '@/components/Header';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { Plus, Minus, ArrowLeft, Star, Eye, Heart, GitCompare, Check, ChevronUp, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import useSWR from 'swr';
import StarRating from '@/components/StarRating';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function ProductDetailClient({ product: initialProduct }) {
  const router = useRouter();
  
  const isMockProduct = initialProduct._id?.startsWith('lookbook-item-') || initialProduct._id?.startsWith('lookbook-bundle-') || initialProduct._id?.startsWith('featured-item-') || initialProduct._id?.startsWith('featured-bundle-') || initialProduct._id?.startsWith('parallax-item-');

  const { data: realtimeProduct } = useSWR(isMockProduct ? null : `/api/products/${initialProduct._id}`, fetcher, {
    fallbackData: initialProduct,
    refreshInterval: 3000 // Poll every 3 seconds
  });
  
  // SWR might return an error object if the API fails, so ensure we fall back to initialProduct if it's missing _id
  const product = (realtimeProduct && realtimeProduct._id) ? realtimeProduct : initialProduct;

  const { data: reviews, mutate: mutateReviews } = useSWR(isMockProduct ? null : `/api/products/${initialProduct._id}/reviews`, fetcher);

  // Review Form State
  const [reviewRating, setReviewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewName, setReviewName] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (reviewRating === 0) {
      toast.error("Please select a star rating.");
      return;
    }
    if (!reviewName.trim() || !reviewComment.trim()) {
      toast.error("Please enter a name and comment.");
      return;
    }
    setIsSubmittingReview(true);
    try {
      const res = await fetch(`/api/products/${product._id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: reviewRating, userName: reviewName, comment: reviewComment })
      });
      if (res.ok) {
        toast.success('Review submitted successfully!');
        setReviewName('');
        setReviewComment('');
        setReviewRating(0);
        mutateReviews();
      } else {
        const err = await res.json();
        toast.error(err.error || 'Failed to submit review');
      }
    } catch (err) {
      toast.error('Error submitting review');
    }
    setIsSubmittingReview(false);
  };

  // Add organic fluctuation to live viewers to make it feel authentically "real-time"
  const [viewersJitter, setViewersJitter] = useState(0);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      // Fluctuates between -2 and +2
      setViewersJitter(Math.floor(Math.random() * 5) - 2);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const displayViewers = Math.max(1, (product.liveViewers || 23) + viewersJitter);

  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const isWishlisted = mounted ? isInWishlist(product._id) : false;
  
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '');
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(product.images?.[0] || '');
  const [activeTab, setActiveTab] = useState('description');
  
  // Calculate which gallery of images to show based on selected color
  const currentGalleryImages = (product.colorImages?.find(c => c.color === selectedColor)?.images?.length > 0) 
    ? product.colorImages.find(c => c.color === selectedColor).images 
    : product.images;

  // When selected color changes, update the active image to the first image of the new gallery
  useEffect(() => {
    if (currentGalleryImages && currentGalleryImages.length > 0 && !currentGalleryImages.includes(activeImage)) {
      setActiveImage(currentGalleryImages[0]);
    }
  }, [selectedColor, product.colorImages, product.images]);
  
  const COLOR_MAP = {
    'Black': '#333333',
    'White': '#ffffff',
    'Grey': '#888888',
    'Gray': '#888888',
    'Beige': '#d4bda5',
    'Navy': '#1a2942',
    'Brown': '#5d4037',
  };
  
  const { addToCart, openCart, setDirectCheckoutItem } = useCartStore();

  const handleAddToCart = () => {
    if (!selectedSize && product.sizes?.length > 0) {
      toast.error("Please select a size");
      return;
    }
    addToCart(product, quantity, selectedSize);
    openCart();
  };

  const handleBuyNow = () => {
    if (!selectedSize && product.sizes?.length > 0) {
      toast.error("Please select a size");
      return;
    }
    setDirectCheckoutItem(product, quantity, selectedSize);
    router.push('/checkout');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <TopBar />
      <Header />
      <NavBar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 w-full flex-grow">
        
        <button onClick={() => router.back()} className="inline-flex items-center text-xs font-bold tracking-widest uppercase text-gray-400 hover:text-black mb-8 transition-colors">
          <ArrowLeft size={14} className="mr-2" /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          
          {/* Images Gallery */}
          <div className="flex flex-col-reverse lg:flex-row gap-4">
            
            {/* Thumbnails (Horizontal on Mobile, Vertical on Desktop) */}
            <div className="flex flex-row lg:flex-col gap-4 overflow-x-auto lg:overflow-visible no-scrollbar w-full lg:w-24 flex-shrink-0">
              <button className="hidden lg:flex items-center justify-center w-full h-8 bg-gray-100 hover:bg-gray-200 transition-colors">
                <ChevronUp size={16} />
              </button>
              
              <div className="flex flex-row lg:flex-col gap-3 w-full pb-2 lg:pb-0">
                {currentGalleryImages?.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`relative w-20 h-24 lg:w-24 lg:h-32 flex-shrink-0 bg-[#f8f8f8] overflow-hidden border transition-all duration-200 ${activeImage === img ? 'opacity-100 border-black shadow-sm' : 'border-transparent lg:border-gray-200 opacity-60 hover:opacity-100'}`}
                  >
                    <Image src={img} alt={`Thumbnail ${idx + 1}`} fill sizes="100px" className="object-cover mix-blend-multiply" />
                  </button>
                ))}
              </div>

              <button className="hidden lg:flex items-center justify-center w-full h-8 bg-gray-100 hover:bg-gray-200 transition-colors mt-auto">
                <ChevronDown size={16} />
              </button>
            </div>
            
            {/* Main Image (Visible on all screens) */}
            <div className="w-full lg:flex-grow aspect-[3/4] bg-[#f8f8f8] overflow-hidden relative border border-gray-100">
              <Image 
                src={activeImage} 
                alt={product.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover mix-blend-multiply transition-opacity duration-300"
              />
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col justify-start pt-4">
            {/* Rating */}
            <div className="mb-4">
              <StarRating rating={product.rating} reviewCount={product.reviewCount} />
            </div>

            {/* Title & Price */}
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.title}</h1>
            <p className="text-xl font-bold text-gray-900 mb-6">Rs {product.price?.toLocaleString()}</p>



            <div className="border-b border-gray-100 w-full mb-6"></div>



            {/* Availability */}
            <div className="flex items-center text-sm text-gray-600 mb-6">
              <span className="mr-2">Availability :</span>
              {product.stockQuantity > 0 || product.inStock ? (
                <>
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 mr-2"></span>
                  <span className="text-gray-500">{product.stockQuantity || 10} in stock</span>
                </>
              ) : (
                <>
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 mr-2"></span>
                  <span className="text-gray-500">Out of stock</span>
                </>
              )}
            </div>

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <p className="text-sm text-gray-800 mb-2">Color</p>
                <div className="flex space-x-3">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className="w-6 h-6 rounded-full relative flex items-center justify-center border border-gray-300"
                      style={{ backgroundColor: COLOR_MAP[color] || color.toLowerCase() }}
                      aria-label={`Select color ${color}`}
                    >
                      {selectedColor === color && (
                        <Check size={12} className={color === 'White' || color === 'Beige' ? 'text-black' : 'text-white'} />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <p className="text-sm text-gray-800 mb-2">Size</p>
                <div className="flex space-x-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-1.5 text-sm font-medium transition-all border ${
                        selectedSize === size 
                          ? 'border-gray-900 text-gray-900 shadow-sm' 
                          : 'border-gray-200 text-gray-500 hover:border-gray-300'
                      }`}
                    >
                      {size === 'S' ? 'Small' : size === 'M' ? 'Medium' : size === 'L' ? 'Large' : size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Cart Container */}
            <div className="mb-6">
              <p className="text-sm text-gray-800 mb-2">Quantity</p>
              <div className="flex flex-row gap-3 mb-4 w-full">
                <div className="flex items-center border border-gray-300 h-12 w-28 sm:w-32 shrink-0">
                  <button 
                    className="flex-1 flex justify-center items-center text-gray-500 hover:text-black transition-colors h-full focus:outline-none"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-sm w-10 text-center font-medium">{quantity}</span>
                  <button 
                    className="flex-1 flex justify-center items-center text-gray-500 hover:text-black transition-colors h-full focus:outline-none"
                    onClick={() => setQuantity(Math.min(product.stockQuantity || 100, quantity + 1))}
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <button 
                  onClick={handleAddToCart}
                  disabled={product.stockQuantity === 0 || product.inStock === false}
                  className="flex-1 bg-black text-white h-12 text-[11px] sm:text-xs font-bold tracking-[0.15em] uppercase hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  ADD TO CART
                </button>
              </div>

              <button 
                onClick={handleBuyNow}
                disabled={product.stockQuantity === 0 || product.inStock === false}
                className="w-full bg-white border border-gray-900 text-gray-900 h-12 text-xs font-bold tracking-widest uppercase hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                BUY IT NOW
              </button>
            </div>

            {/* Actions */}
            <div className="flex space-x-6 text-xs text-gray-600 font-medium mt-6">
              <button 
                onClick={() => toggleWishlist(product)}
                className={`flex items-center transition-colors ${isWishlisted ? 'text-red-500' : 'hover:text-black'}`}
              >
                <Heart size={14} className={`mr-2 ${isWishlisted ? 'fill-red-500' : ''}`} /> 
                {isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </button>
            </div>

          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-24 w-full">
          <div className="flex justify-center border-b border-gray-200">
            <button 
              onClick={() => setActiveTab('description')}
              className={`px-8 py-4 text-sm font-bold transition-all ${activeTab === 'description' ? 'border-b-2 border-gray-900 text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Description
            </button>
            {product.shippingDetails && (
              <button 
                onClick={() => setActiveTab('shipping')}
                className={`px-8 py-4 text-sm font-bold transition-all ${activeTab === 'shipping' ? 'border-b-2 border-gray-900 text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Shipping Details
              </button>
            )}
            <button 
              onClick={() => setActiveTab('reviews')}
              className={`px-8 py-4 text-sm font-bold transition-all ${activeTab === 'reviews' ? 'border-b-2 border-gray-900 text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Reviews ({product.reviewCount || 0})
            </button>
          </div>

          <div className="py-12 max-w-4xl mx-auto">
            {activeTab === 'description' && (
              <div className="prose text-gray-600 max-w-none">
                <h3 className="text-xl font-bold text-gray-900 mb-6">About this item</h3>
                <p className="mb-4">
                  {product.description}
                </p>
                {product.features && (
                  <div className="mt-6">
                    <p className="whitespace-pre-line leading-relaxed">{product.features}</p>
                  </div>
                )}
                <div className="mt-8 pt-6 border-t border-gray-100 flex items-center text-sm font-medium text-gray-500">
                   <span className="mr-4 tracking-widest uppercase text-xs text-gray-400">SKU:</span> 
                   {product.sku || `AURA-${(product._id || '').slice(-6).toUpperCase()}`}
                </div>
              </div>
            )}
            {activeTab === 'shipping' && product.shippingDetails && (
              <div className="prose text-gray-600 max-w-none">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Shipping & Returns</h3>
                <div className="whitespace-pre-line leading-relaxed">
                  {product.shippingDetails}
                </div>
              </div>
            )}
            {activeTab === 'reviews' && (
              <div className="text-gray-600 max-w-none">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Customer Reviews</h3>
                
                {/* Review Form */}
                <form onSubmit={handleReviewSubmit} className="mb-12 p-6 bg-gray-50 border border-gray-100 rounded-sm">
                  <h4 className="text-md font-bold text-gray-900 mb-4">Write a Review</h4>
                  <div className="mb-4">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Rating</label>
                    <div 
                      className="flex space-x-1 cursor-pointer"
                      onMouseLeave={() => setHoverRating(0)}
                    >
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          onClick={() => setReviewRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          size={24} 
                          className={star <= (hoverRating || reviewRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} 
                        />
                      ))}
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Name</label>
                    <input 
                      type="text" 
                      required
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      placeholder="Enter your name" 
                      className="w-full bg-white border border-gray-300 rounded-none px-4 py-3 text-sm focus:ring-1 focus:ring-black focus:border-black outline-none transition-all shadow-sm"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Review</label>
                    <textarea 
                      required
                      rows={4}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Write your review here..." 
                      className="w-full bg-white border border-gray-300 rounded-none px-4 py-3 text-sm focus:ring-1 focus:ring-black focus:border-black outline-none transition-all shadow-sm"
                    ></textarea>
                  </div>
                  <button 
                    type="submit" 
                    disabled={isSubmittingReview}
                    className="bg-[#2C313D] text-white h-12 px-8 text-xs font-bold tracking-widest uppercase hover:bg-black transition-colors disabled:opacity-50"
                  >
                    {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>

                {/* Reviews List */}
                <div className="space-y-8">
                  {reviews && reviews.length > 0 ? (
                    reviews.map((review) => (
                      <div key={review._id} className="border-b border-gray-100 pb-8 last:border-0">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-gray-900">{review.userName}</span>
                          <span className="text-xs text-gray-400">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="mb-3">
                           <StarRating rating={review.rating} showCount={false} size={12} />
                        </div>
                        <p className="text-sm leading-relaxed">{review.comment}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 italic">No reviews yet. Be the first to review this product!</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
}
