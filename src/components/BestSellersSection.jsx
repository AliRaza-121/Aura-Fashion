"use client";
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import StarRating from '@/components/StarRating';
import dynamic from 'next/dynamic';
const QuickViewModal = dynamic(() => import('@/components/QuickViewModal'), { ssr: false });
import { Heart } from 'lucide-react';
import { useWishlistStore } from '@/store/wishlistStore';

const DUMMY_BEST_SELLERS = [
  { id: 30, name: "Premium Leather Jacket", price: 18500 },
  { id: 31, name: "Silk Blend Slip Dress", price: 7200 },
  { id: 32, name: "Minimalist Vintage Watch", price: 4500 },
  { id: 33, name: "Suede Ankle Boots", price: 12000 },
  { id: 34, name: "Cashmere Overcoat", price: 22000 }
];

export default function BestSellersSection({ products = [] }) {
  const displayProducts = products && products.length > 0 ? products : DUMMY_BEST_SELLERS;
  const [activeIndex, setActiveIndex] = useState(Math.floor(displayProducts.length / 2));
  const [isMobile, setIsMobile] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const wishlistItems = useWishlistStore((state) => state.wishlistItems);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const nextSlide = () => setActiveIndex((prev) => (prev + 1) % displayProducts.length);
  const prevSlide = () => setActiveIndex((prev) => (prev - 1 + displayProducts.length) % displayProducts.length);
  useEffect(() => {
    // Only check window size safely inside a passive timeout to avoid forced reflow
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    const timeoutResize = setTimeout(checkMobile, 100);
    window.addEventListener('resize', checkMobile, { passive: true });
    
    // Delay auto-carousel to reduce main thread work during load
    const timeout = setTimeout(() => {
      const interval = setInterval(nextSlide, 2500);
      window.__bestSellerInterval = interval;
    }, 2000);
    
    return () => {
      clearTimeout(timeout);
      clearTimeout(timeoutResize);
      if (window.__bestSellerInterval) clearInterval(window.__bestSellerInterval);
      window.removeEventListener('resize', checkMobile);
    }
  }, []);

  return (
    <section className="py-24 bg-[#FAFAFA] overflow-hidden border-t border-gray-100">
      <div className="flex flex-col items-center mb-16 text-center">
        <p className="text-[11px] font-bold tracking-[0.3em] text-gray-500 uppercase mb-4">Don't Miss Out</p>
        <h2 className="text-[32px] font-extrabold text-black tracking-wide uppercase">OUR BEST SELLERS</h2>
      </div>

      <div className="relative h-[550px] md:h-[650px] w-full flex items-center justify-center max-w-[100vw] overflow-hidden group">
        
        <div className="relative w-full max-w-7xl h-full flex items-center justify-center">
          {displayProducts.map((product, idx) => {
            let offset = idx - activeIndex;
            // Handle wrap around for seamless loop look
            if (offset < -Math.floor(displayProducts.length / 2)) offset += displayProducts.length;
            if (offset > Math.floor(displayProducts.length / 2)) offset -= displayProducts.length;
            
            const isActive = offset === 0;
            // Adjust translation distance based on screen size
            const translateX = offset * (isMobile ? 220 : 450);
            const scale = isActive ? 1 : (isMobile ? 0.85 : 0.8);
            const zIndex = 20 - Math.abs(offset);
            const opacity = Math.abs(offset) > (isMobile ? 1 : 2) ? 0 : isActive ? 1 : 0.4;

            return (
              <div 
                key={product._id || product.id}
                className="absolute transition-all duration-700 ease-in-out cursor-pointer group/card"
                style={{
                  transform: `translateX(${translateX}px) scale(${scale})`,
                  zIndex,
                  opacity,
                }}
                onClick={() => !isActive && setActiveIndex(idx)}
              >
                <div className={`relative aspect-[3/4] bg-[#f4f4f4] overflow-hidden w-[260px] md:w-[400px] ${isActive ? 'shadow-2xl' : 'shadow-md'} group/card`}>
                  
                  {/* The Image (Perfectly still) */}
                  <div className="absolute inset-0 z-10">
                    {/* Image swap effect on hover */}
                    <Image 
                      src={product.images?.[0] || `/product_card_${(idx % 2) + 1}.png`} 
                      alt={product.title || product.name}
                      fill
                      priority={idx < 4}
                      sizes="(max-width: 768px) 260px, 400px"
                      className="object-cover mix-blend-multiply transition-opacity duration-700 ease-in-out group-hover/card:opacity-0 z-20"
                    />
                    <Image 
                      src={product.images?.[1] || product.images?.[0] || `/product_card_${((idx + 1) % 2) + 1}.png`} 
                      alt={product.title || product.name}
                      fill
                      priority={idx < 4}
                      sizes="(max-width: 768px) 260px, 400px"
                      className="object-cover mix-blend-multiply opacity-0 group-hover/card:opacity-100 transition-opacity duration-700 ease-in-out z-10"
                    />
                  </div>
                  
                  {isActive && (
                    <>
                      {/* Frosted Glass Overlay */}
                      <div className="absolute inset-0 bg-white/10 backdrop-blur-[3px] opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none z-20"></div>

                      {/* Badge */}
                      <div className="absolute top-4 left-4 bg-black text-white text-[10px] font-bold px-3 py-1.5 tracking-widest z-30 pointer-events-none">
                        HOT
                      </div>

                      {/* Wishlist Button */}
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleWishlist(product);
                        }}
                        className="absolute top-4 right-4 z-40 p-2.5 bg-white/80 backdrop-blur-md rounded-full shadow-sm hover:scale-110 hover:bg-white transition-all transform opacity-0 translate-x-2 group-hover/card:opacity-100 group-hover/card:translate-x-0 focus:opacity-100 focus:translate-x-0 pointer-events-auto"
                        aria-label={mounted && wishlistItems.some(item => item.product === (product._id || product.id)) ? "Remove from wishlist" : "Add to wishlist"}
                      >
                        <Heart size={18} className={`transition-colors duration-300 ${mounted && wishlistItems.some(item => item.product === (product._id || product.id)) ? 'fill-red-500 text-red-500' : 'text-gray-900'}`} />
                      </button>
                      
                      {/* iOS Style Floating Glass Button */}
                      <div className="absolute bottom-4 left-4 right-4 z-30 hidden lg:flex items-center justify-center opacity-0 group-hover/card:opacity-100 transform translate-y-4 group-hover/card:translate-y-0 transition-all duration-500 pointer-events-none">
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setQuickViewProduct({
                              ...product,
                              images: product.images || [`/product_card_${(idx % 2) + 1}.png`]
                            });
                          }}
                          className="w-full bg-white/95 backdrop-blur-md text-black border border-white/50 py-3 rounded-lg text-[11px] font-bold tracking-[0.1em] uppercase shadow-[0_8px_30px_rgb(0,0,0,0.12)] pointer-events-auto hover:bg-black hover:text-white hover:scale-[1.02] transition-all"
                        >
                          + Quick View
                        </button>
                      </div>
                    </>
                  )}
                </div>
                <div className={`text-center px-2 mt-6 transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                  <Link href={`/shop/${product._id || product.id}`} className="hover:opacity-80 transition-opacity pointer-events-auto block">
                    <h3 className="text-lg text-gray-800 font-medium mb-1">{product.title || product.name}</h3>
                    <div className="flex justify-center mb-2"><StarRating rating={product.rating || 5} reviewCount={product.reviewCount || 0} showCount={false} size={14} /></div>
                    <p className="font-bold text-black text-xl">Rs {product.price?.toLocaleString()}</p>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pagination Dashes instead of arrows */}
      <div className="flex justify-center items-center space-x-3 mt-8">
        {displayProducts.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`transition-all duration-500 ${
              idx === activeIndex 
                ? 'w-10 h-1 bg-black' 
                : 'w-4 h-1 bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
      
      {/* View All Button */}
      <div className="mt-12 flex justify-center">
         <Link href="/shop?bestsellers=true" className="group flex items-center justify-center px-10 py-4 bg-transparent border-2 border-black text-[13px] font-bold tracking-widest text-black hover:bg-black hover:text-white transition-all duration-300">
           VIEW ALL BEST SELLERS
         </Link>
      </div>

      <QuickViewModal 
        product={quickViewProduct} 
        isOpen={!!quickViewProduct} 
        onClose={() => setQuickViewProduct(null)} 
      />
    </section>
  );
}
