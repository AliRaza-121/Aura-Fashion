"use client";
import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/store/cartStore';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import StarRating from '@/components/StarRating';
import ProductCard from '@/components/ProductCard';

const DUMMY_PRODUCTS = {
  FEATURED: [
    { id: 1, name: "Classic White T-Shirt", price: 2500 },
    { id: 2, name: "Denim Jacket", price: 8500 },
    { id: 3, name: "Summer Floral Dress", price: 5500 },
    { id: 4, name: "Canvas Sneakers", price: 4000 },
    { id: 13, name: "Linen Trousers", price: 4200 },
    { id: 14, name: "Straw Sun Hat", price: 1800 },
    { id: 15, name: "Sleeveless Blouse", price: 3000 },
    { id: 16, name: "Woven Sandals", price: 3500 },
  ],
  LATEST: [
    { id: 5, name: "Linen Button-Down", price: 4500 },
    { id: 6, name: "Pleated Midi Skirt", price: 3800 },
    { id: 7, name: "Vintage Sunglasses", price: 1500 },
    { id: 8, name: "Leather Crossbody Bag", price: 6000 },
    { id: 17, name: "Silk Scarf", price: 2200 },
    { id: 18, name: "Chino Shorts", price: 3500 },
    { id: 19, name: "Polo Shirt", price: 2800 },
    { id: 20, name: "Gold Plated Hoop Earrings", price: 1200 },
  ],
  'BEST SELLERS': [
    { id: 9, name: "High-Waist Mom Jeans", price: 5000 },
    { id: 10, name: "Oversized Graphic Hoodie", price: 4800 },
    { id: 11, name: "Classic Leather Belt", price: 1200 },
    { id: 12, name: "Athletic Running Shoes", price: 9000 },
    { id: 21, name: "Ribbed Tank Top", price: 1500 },
    { id: 22, name: "Denim Shorts", price: 3200 },
    { id: 23, name: "Platform Sneakers", price: 5500 },
    { id: 24, name: "Cotton Crewneck Sweater", price: 4500 },
  ]
};

export default function ProductSection({ products = [] }) {
  const [activeTab, setActiveTab] = useState('FEATURED');
  const tabs = ['FEATURED', 'LATEST', 'BEST SELLERS'];
  const scrollContainerRef = useRef(null);
  const { addToCart, openCart } = useCartStore();

  // Simple categorization fallback since all products are passed
  const getProductsForTab = (tab) => {
    if (!products || products.length === 0) return DUMMY_PRODUCTS[tab];
    
    if (tab === 'FEATURED') {
      const featured = products.filter(p => p.isFeatured);
      return featured.length > 0 ? featured.slice(0, 8) : products.slice(0, 8);
    }
    if (tab === 'LATEST') {
      return [...products].reverse().slice(0, 8);
    }
    if (tab === 'BEST SELLERS') {
      const bestSellers = products.filter(p => p.isBestSeller);
      return bestSellers.length > 0 ? bestSellers.slice(0, 8) : products.slice(0, 8);
    }
    
    return products.slice(0, 8);
  };
  
  const displayProducts = getProductsForTab(activeTab);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-8 relative">
        
        <div className="flex flex-col items-center mb-16">
          <h2 className="text-[28px] font-extrabold text-black tracking-wide uppercase mb-3">OUR NEW STOCK</h2>
          <div className="w-12 h-[2px] bg-gray-800 mb-10"></div>
          
          <div className="flex w-full md:w-auto justify-center gap-2 md:gap-4 md:space-x-0 overflow-x-auto no-scrollbar px-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 md:px-8 py-2 md:py-3 text-[10px] md:text-[11px] font-bold tracking-wider md:tracking-[0.2em] transition-colors border whitespace-nowrap flex-1 md:flex-none
                  ${activeTab === tab 
                    ? 'bg-black text-white border-black' 
                    : 'bg-white text-gray-500 border-gray-200 hover:bg-black hover:text-white hover:border-black'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="relative group">
          
          {displayProducts.length > 4 && (
            <button 
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 w-14 h-14 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-lg z-50 text-gray-600 hover:text-black hover:bg-gray-50 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Scroll left"
            >
              <ChevronLeft size={28} />
            </button>
          )}

          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-8 snap-x snap-mandatory scroll-smooth pb-8 no-scrollbar"
          >
            {displayProducts.map((product, idx) => {
              const productId = product._id || product.id;
              const productImage = product.images && product.images.length > 0 ? product.images[0] : `/product_card_${(idx % 2) + 1}.png`;
              
              return (
              <div key={productId} className="min-w-[280px] w-[280px] snap-start h-full">
                <ProductCard product={product} priority={idx < 2} />
              </div>
            )})}
          </div>

          {displayProducts.length > 4 && (
            <button 
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 w-14 h-14 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-lg z-50 text-gray-600 hover:text-black hover:bg-gray-50 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Scroll right"
            >
              <ChevronRight size={28} />
            </button>
          )}
        </div>
        
      </div>
    </section>
  );
}
