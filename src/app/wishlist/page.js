"use client";
import { useEffect, useState } from 'react';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, ShoppingCart, Heart } from 'lucide-react';
import TopBar from '@/components/TopBar';
import Header from '@/components/Header';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist } = useWishlistStore();
  const { addToCart, openCart } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAddToCart = (item) => {
    // Reconstruct a product object for the cart store
    const mockProduct = {
      _id: item.product,
      title: item.title,
      price: item.price,
      images: [item.image],
    };
    addToCart(mockProduct, 1, 'M'); // Default size M for quick add
    openCart();
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <TopBar />
      <Header />
      <NavBar />
      
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="flex items-center space-x-3 mb-12 border-b border-gray-100 pb-6">
          <Heart size={28} className="text-red-500 fill-red-500" />
          <h1 className="text-3xl font-black tracking-widest uppercase">My Wishlist</h1>
        </div>

        {!mounted ? (
          <div className="py-20 text-center text-gray-400">Loading wishlist...</div>
        ) : wishlistItems.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-xl border border-gray-100">
            <Heart size={48} className="mx-auto text-gray-300 mb-6" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-8">Save items you love and they will show up here.</p>
            <Link href="/shop" className="inline-block bg-black text-white px-8 py-4 text-xs font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {wishlistItems.map((item) => (
              <div key={item.product} className="group relative border border-gray-100 p-4 rounded-xl hover:shadow-xl transition-all bg-white flex flex-col h-full">
                <button 
                  onClick={() => removeFromWishlist(item.product)}
                  className="absolute top-6 right-6 z-30 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors shadow-sm"
                  aria-label="Remove from wishlist"
                >
                  <Trash2 size={16} />
                </button>
                
                <div className="relative aspect-[3/4] bg-[#f8f8f8] mb-4 overflow-hidden group/card rounded-lg">
                  <Link href={`/shop/${item.product}`} className="absolute inset-0 z-0">
                    <Image 
                      src={item.image || '/product_card_1.png'} 
                      alt={item.title} 
                      fill 
                      sizes="(max-width: 768px) 100vw, 250px" 
                      className="object-cover" 
                    />
                  </Link>

                  {/* Frosted Glass Overlay */}
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-[3px] opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none z-10"></div>

                  {/* iOS Style Floating Glass Button */}
                  <div className="absolute bottom-4 left-4 right-4 z-20 hidden lg:flex items-center justify-center opacity-0 group-hover/card:opacity-100 transform translate-y-4 group-hover/card:translate-y-0 transition-all duration-500 pointer-events-none">
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleAddToCart(item);
                      }}
                      className="w-full bg-white/90 backdrop-blur-md text-black border border-white/50 py-3 rounded-lg text-[11px] font-bold tracking-[0.1em] uppercase shadow-[0_8px_30px_rgb(0,0,0,0.12)] pointer-events-auto hover:bg-white hover:scale-[1.02] transition-all"
                    >
                      + Quick Add
                    </button>
                  </div>
                </div>
                
                <div className="flex-grow flex flex-col">
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{item.category}</div>
                  <Link href={`/shop/${item.product}`} className="text-sm font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors line-clamp-2">
                    {item.title}
                  </Link>
                  <div className="text-sm font-bold text-gray-600 mb-6 mt-auto">Rs {item.price?.toLocaleString()}</div>
                  
                  <button 
                    onClick={() => handleAddToCart(item)}
                    className="w-full flex lg:hidden items-center justify-center bg-gray-100 text-gray-900 py-3 text-xs font-bold tracking-widest uppercase hover:bg-black hover:text-white transition-colors rounded-lg border border-transparent hover:border-black"
                  >
                    <ShoppingCart size={14} className="mr-2" /> Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
