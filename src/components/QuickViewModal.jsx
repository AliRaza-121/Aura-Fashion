"use client";
import Image from 'next/image';
import Link from 'next/link';
import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function QuickViewModal({ product, isOpen, onClose }) {
  const { addToCart, openCart } = useCartStore();
  
  const defaultSize = product?.sizes && product.sizes.length > 0 ? product.sizes[0] : 'M';
  const defaultColor = product?.colors && product.colors.length > 0 ? product.colors[0] : 'Default';
  
  const [selectedSize, setSelectedSize] = useState(defaultSize);
  const [selectedColor, setSelectedColor] = useState(defaultColor);

  const activeColorImages = product?.colorImages?.find(c => c.color === selectedColor)?.images;
  const currentImages = activeColorImages && activeColorImages.length > 0 ? activeColorImages : product?.images || [];
  const mainImage = currentImages.length > 0 ? currentImages[0] : '/placeholder.png';

  // Reset selection when product changes
  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'M');
      setSelectedColor(product.colors && product.colors.length > 0 ? product.colors[0] : 'Default');
    }
  }, [product]);

  const colors = product?.colors || [];
  const displayColors = colors.slice(0, 5);
  const extraColors = colors.length > 5 ? colors.length - 5 : 0;
  
  const colorMap = {
    'Black': '#000000', 'White': '#FFFFFF', 'Blue': '#2563EB', 'Red': '#DC2626', 
    'Pink': '#FBCFE8', 'Grey': '#9CA3AF', 'Green': '#16A34A', 'Beige': '#F5F5DC',
    'Brown': '#8B4513', 'Navy': '#000080', 'Yellow': '#FACC15', 'Orange': '#F97316',
    'Purple': '#9333EA', 'Maroon': '#831843', 'Olive': '#4D7C0F', 'Teal': '#0D9488'
  };

  const productId = product?._id || product?.id;

  return (
    <AnimatePresence>
      {isOpen && product && (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClose();
        }}
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl flex flex-col md:flex-row cursor-default"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="quickview-title"
      >
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Close Quick View"
        >
          <X size={20} />
        </button>
        
        <div className="w-full md:w-1/2 aspect-[3/4] md:aspect-auto relative bg-[#f8f8f8]">
          <Image 
            src={mainImage} 
            alt={product.title || product.name || 'Product'}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-2">
            {product.isFeatured && <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mr-3">Featured</span>}
            {product.isBestSeller && <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Best Seller</span>}
          </div>
          <h2 id="quickview-title" className="text-3xl font-black uppercase tracking-widest mb-4">{product.title || product.name}</h2>
          <p className="text-xl text-gray-600 mb-8">Rs {product.price?.toLocaleString() || 0}</p>
          
          <div className="space-y-6 mb-8">
            {displayColors.length > 0 && (
              <div>
                <h4 className="text-[10px] font-bold tracking-widest uppercase text-gray-500 mb-3">Color</h4>
                <div className="flex items-center space-x-3">
                  {displayColors.map(colorName => {
                    const hex = colorMap[colorName] || '#CCCCCC';
                    const isSelected = selectedColor === colorName;
                    return (
                      <button 
                        key={colorName}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedColor(colorName);
                        }}
                        className={`w-6 h-6 rounded-full border shadow-sm transition-all ${isSelected ? 'ring-2 ring-black ring-offset-2 scale-110' : 'border-gray-200 hover:scale-110'}`}
                        style={{ backgroundColor: hex }}
                        title={colorName}
                        aria-label={`Select color ${colorName}`}
                      />
                    );
                  })}
                  {extraColors > 0 && <span className="text-xs text-gray-500 font-medium">+{extraColors} more</span>}
                </div>
              </div>
            )}
            
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <h4 className="text-[10px] font-bold tracking-widest uppercase text-gray-500 mb-3">Size</h4>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(size => {
                    const isSelected = selectedSize === size;
                    return (
                      <button 
                        key={size}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedSize(size);
                        }}
                        className={`w-10 h-10 border flex items-center justify-center text-xs font-bold transition-colors ${isSelected ? 'bg-black text-white border-black' : 'border-gray-200 text-gray-600 hover:border-gray-900 hover:text-black'}`}
                        aria-label={`Select size ${size}`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          
          <button 
            disabled={product.stockQuantity === 0 || product.inStock === false}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const productWithImage = { ...product, images: [mainImage] };
              addToCart(productWithImage, 1, selectedSize, selectedColor);
              onClose();
              openCart();
            }}
            className={`w-full py-4 text-sm font-bold tracking-widest uppercase transition-colors ${product.stockQuantity === 0 || product.inStock === false ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-900'}`}
            aria-label={product.stockQuantity === 0 || product.inStock === false ? "Out of Stock" : "Add to cart from Quick View"}
          >
            {product.stockQuantity === 0 || product.inStock === false ? 'Out of Stock' : 'Add To Cart'}
          </button>
          
          <Link 
            href={`/shop/${productId}`} 
            className="mt-6 text-center text-xs font-bold tracking-widest uppercase text-gray-500 hover:text-black underline underline-offset-4 transition-colors"
            onClick={onClose}
          >
            View Full Details
          </Link>
        </div>
      </motion.div>
    </div>
      )}
    </AnimatePresence>
  );
}
