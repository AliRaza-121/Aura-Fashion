"use client";
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import StarRating from '@/components/StarRating';
import dynamic from 'next/dynamic';
const QuickViewModal = dynamic(() => import('@/components/QuickViewModal'), { ssr: false });
import { Heart } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ProductCard({ product, priority = false }) {
  const { addToCart, openCart } = useCartStore();
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const wishlistItems = useWishlistStore((state) => state.wishlistItems);
  const [mounted, setMounted] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const productId = product._id || product.id;
  const isWishlisted = mounted ? wishlistItems.some(item => item.product === productId) : false;
  
  // Handle secondary image swap on hover
  const mainImage = product.images && product.images.length > 0 ? product.images[0] : '/placeholder.png';
  const hoverImage = product.images && product.images.length > 1 ? product.images[1] : mainImage;

  // Handle color swatches (max 5 to prevent overflowing)
  const colors = product.colors || [];
  const displayColors = colors.slice(0, 5);
  const extraColors = colors.length > 5 ? colors.length - 5 : 0;

  const colorMap = {
    'Black': '#000000', 'White': '#FFFFFF', 'Blue': '#2563EB', 'Red': '#DC2626', 
    'Pink': '#FBCFE8', 'Grey': '#9CA3AF', 'Green': '#16A34A', 'Beige': '#F5F5DC',
    'Brown': '#8B4513', 'Navy': '#000080', 'Yellow': '#FACC15', 'Orange': '#F97316',
    'Purple': '#9333EA', 'Maroon': '#831843', 'Olive': '#4D7C0F', 'Teal': '#0D9488'
  };

  return (
    <div className="group cursor-pointer flex flex-col relative w-full h-full">
      <div className="relative aspect-[3/4] bg-[#f8f8f8] mb-4 overflow-hidden group/card">
        
        {/* Images */}
        <Link href={`/shop/${productId}`} className="absolute inset-0 z-0">
          <Image 
            src={mainImage} 
            alt={product.title || product.name || 'Product'}
            fill
            priority={priority}
            sizes="(max-width: 768px) 50vw, 33vw"
            className="object-cover transition-opacity duration-500 ease-in-out group-hover/card:opacity-0"
          />
          <Image 
            src={hoverImage} 
            alt={product.title || product.name || 'Product Alternate'}
            fill
            sizes="(max-width: 768px) 50vw, 33vw"
            className="object-cover opacity-0 transition-opacity duration-500 ease-in-out group-hover/card:opacity-100"
          />
        </Link>

        {/* Frosted Glass Overlay */}
        <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px] opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none z-10"></div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-20 pointer-events-none">
          {product.isFeatured && (
            <span className="bg-black text-white text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded shadow-sm">Featured</span>
          )}
          {product.isBestSeller && (
            <span className="bg-white/90 backdrop-blur text-black text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded shadow-sm">Best Seller</span>
          )}
          {(product.stockQuantity === 0 || product.inStock === false) && (
            <span className="bg-red-500 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded shadow-sm">Out of Stock</span>
          )}
        </div>

        {/* Wishlist Button */}
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className="absolute top-3 right-3 z-30 p-2 bg-white/80 backdrop-blur-md rounded-full shadow-sm hover:scale-110 hover:bg-white transition-all transform opacity-0 translate-x-2 group-hover/card:opacity-100 group-hover/card:translate-x-0 focus:opacity-100 focus:translate-x-0"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart size={16} className={`transition-colors duration-300 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-900'}`} />
        </button>

        {/* iOS Style Floating Glass Button */}
        <div className="absolute bottom-4 left-4 right-4 z-20 hidden lg:flex items-center justify-center opacity-0 group-hover/card:opacity-100 transform translate-y-4 group-hover/card:translate-y-0 transition-all duration-500 pointer-events-none">
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsQuickViewOpen(true);
            }}
            className="w-full bg-white/95 backdrop-blur-md text-black border border-white/50 py-3 rounded-lg text-[11px] font-bold tracking-[0.1em] uppercase shadow-[0_8px_30px_rgb(0,0,0,0.12)] pointer-events-auto hover:bg-black hover:text-white hover:scale-[1.02] transition-all"
            aria-label="Quick View Product"
          >
            + Quick View
          </button>
        </div>
      </div>

      {/* Info section */}
      <Link href={`/shop/${productId}`} className="flex flex-col flex-grow hover:opacity-80 transition-opacity">
        <h3 className="text-[12px] font-bold tracking-widest uppercase text-gray-900 mb-1.5 group-hover:text-black transition-colors line-clamp-1">
          {product.title || product.name}
        </h3>
        
        <div className="flex items-center justify-between mt-auto pt-1">
          <p className="text-[12px] text-gray-500 tracking-wider">Rs {product.price?.toLocaleString() || 0}</p>
          
          {/* Visual Color Swatches */}
          {displayColors.length > 0 && (
            <div className="flex items-center space-x-1">
              {displayColors.map(colorName => {
                const hex = colorMap[colorName] || '#CCCCCC';
                return (
                  <div 
                    key={colorName} 
                    className="w-3 h-3 rounded-full border border-gray-200 shadow-inner"
                    style={{ backgroundColor: hex }}
                    title={colorName}
                  />
                );
              })}
              {extraColors > 0 && (
                <span className="text-[9px] text-gray-400 font-bold ml-1">+{extraColors}</span>
              )}
            </div>
          )}
        </div>
      </Link>

      {/* Quick View Modal */}
      <QuickViewModal 
        product={product} 
        isOpen={isQuickViewOpen} 
        onClose={() => setIsQuickViewOpen(false)} 
      />
    </div>
  );
}
