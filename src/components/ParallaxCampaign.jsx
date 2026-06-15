"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import toast from 'react-hot-toast';

export default function ParallaxCampaign({ data }) {
  const { addToCart } = useCartStore();

  const cData = data || {
    heading: "The Winter\nCollection",
    subheading: "Embrace the cold with our most premium fabrics.",
    buttonText: "PRE-ORDER NOW",
    buttonLink: "/shop",
    image: "/parallax_campaign.png"
  };

  const product = cData.productId;
  const productName = product?.title || product?.name || 'Exclusive Item';
  const productPrice = product?.price || 0;
  const productImage = product?.images?.[0] || '/placeholder.png';

  const handleAddToCart = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!product) {
      toast.error('Product not available');
      return;
    }
    addToCart(product, 1, product.sizes?.[0] || 'M', product.colors?.[0] || 'Default');
    toast.success(`${productName} added to cart!`);
  };

  return (
    <section className="relative h-auto md:h-[80vh] md:min-h-[600px] w-full flex items-center justify-center overflow-hidden py-24 md:py-0">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes floatMobile {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .mobile-float {
          animation: floatMobile 5s ease-in-out infinite;
        }
        @media (min-width: 768px) {
          .mobile-float {
            animation: none !important;
          }
        }
      `}} />
      
      {/* Parallax Background - using Next.js Image for optimization */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="fixed inset-0" style={{ zIndex: -1 }}>
          <Image 
            src={cData.image}
            alt="Campaign Background"
            fill
            sizes="100vw"
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzJhMmEyYSIvPjwvc3ZnPg=="
            className="object-cover object-center"
          />
        </div>
        <div className="absolute inset-0 bg-black/40 mix-blend-multiply"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 w-full flex flex-col md:flex-row items-center justify-between">
        
        {/* Massive Typography */}
        <div className="text-white w-full md:w-1/2 mb-12 md:mb-0 text-center md:text-left whitespace-pre-line">
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-6 break-words hyphens-auto">
            {cData.heading}
          </h2>
          <p className="text-sm md:text-xl font-light opacity-90 max-w-md tracking-wide mx-auto md:mx-0">
            {cData.subheading}
          </p>
        </div>

        {/* Glassmorphism Card */}
        <div className="w-full md:w-auto flex justify-center perspective-[1000px]">
          {product && (
          <Link href={`/shop/${product._id}`} className="mobile-float group bg-black/20 backdrop-blur-md border border-white/20 p-6 md:p-8 shadow-2xl w-full max-w-[350px] transition-all duration-500 hover:border-white hover:bg-black/40 block active:scale-[0.98] active:shadow-inner text-left">
            <div className="flex justify-between items-center mb-6">
              <span className="text-white text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase">Limited Drop</span>
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
              </span>
            </div>
            
            <div className="aspect-[4/5] bg-gray-900 mb-6 relative overflow-hidden">
               <Image 
                src={productImage} 
                alt={productName}
                fill
                sizes="(max-width: 768px) 100vw, 350px"
                className="object-cover"
              />
            </div>
            
            <h3 className="text-white font-bold text-base md:text-lg uppercase tracking-wider mb-1 line-clamp-1">{productName}</h3>
            <p className="text-white font-medium text-sm md:text-base mb-6 transition-colors duration-500 md:text-white/80 md:group-hover:text-white">Rs {productPrice.toLocaleString()}</p>
            
            <button onClick={handleAddToCart} className="flex justify-center items-center w-full bg-transparent text-white py-4 text-[10px] md:text-xs font-bold tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-300 border border-white cursor-pointer mt-auto relative z-20">
              {cData.buttonText}
            </button>
          </Link>
          )}
        </div>

      </div>
    </section>
  );
}
