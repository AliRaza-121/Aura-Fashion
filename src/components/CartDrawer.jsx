"use client";
import { useCartStore } from '@/store/cartStore';
import { X, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartDrawer() {
  const { cartItems, isOpen, closeCart, removeFromCart, updateQuantity, getCartTotal, clearDirectCheckoutItem } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Prevent hydration errors by only rendering cart contents after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCheckout = () => {
    clearDirectCheckoutItem();
    closeCart();
    router.push('/checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[999] backdrop-blur-sm"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full md:w-[450px] bg-white z-[1000] shadow-2xl flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-drawer-title"
          >
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 id="cart-drawer-title" className="text-lg font-black tracking-widest uppercase flex items-center">
            <ShoppingBag size={20} className="mr-3" /> 
            Your Cart
          </h2>
          <button 
            onClick={closeCart}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {!mounted || cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <ShoppingBag size={64} className="mb-4 opacity-20" />
              <p className="font-medium">Your cart is empty.</p>
              <button 
                onClick={closeCart}
                className="mt-6 text-black border-b-2 border-black font-bold uppercase tracking-widest text-xs pb-1"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div key={`${item.product}-${item.size}-${item.color || 'default'}`} className="flex space-x-4">
                  <div className="w-24 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200 relative">
                    <Image 
                      src={item.image || '/product_card_1.png'} 
                      alt={item.title} 
                      fill 
                      sizes="96px" 
                      className="object-cover" 
                    />
                  </div>
                  
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-sm font-bold text-gray-900">{item.title}</h3>
                        <p className="text-xs text-gray-500 mt-1 uppercase">
                          Size: {item.size} {item.color ? `| Color: ${item.color}` : ''}
                        </p>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.product, item.size, item.color)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        aria-label="Remove item"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center border border-gray-300 rounded-md">
                        <button 
                          className="px-2 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                          onClick={() => updateQuantity(item.product, item.size, item.color, item.quantity - 1)}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-xs font-bold w-8 text-center">{item.quantity}</span>
                        <button 
                          className="px-2 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                          onClick={() => updateQuantity(item.product, item.size, item.color, item.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <span className="text-sm font-bold">Rs {item.price.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer / Checkout */}
        {mounted && cartItems.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-gray-50">
            <div className="flex justify-between items-center mb-6">
              <span className="text-sm font-medium text-gray-600 uppercase tracking-widest">Subtotal</span>
              <span className="text-xl font-black">Rs {getCartTotal().toLocaleString()}</span>
            </div>
            <p className="text-xs text-gray-500 mb-6 text-center">Shipping, taxes, and discounts codes calculated at checkout.</p>
            
            <button 
              onClick={handleCheckout}
              className="w-full flex items-center justify-center py-4 bg-black text-white border-2 border-black rounded-xl font-bold uppercase tracking-widest hover:bg-transparent hover:text-black transition-all duration-300 group"
            >
              Checkout <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
