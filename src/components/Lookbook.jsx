"use client";
import { Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import toast from 'react-hot-toast';

export default function Lookbook({ data }) {
  const { addToCart } = useCartStore();

  if (!data) return null;

  const p1 = data.item1ProductId;
  const p2 = data.item2ProductId;
  const p3 = data.item3ProductId;

  const lookItems = [
    { 
      id: 1, 
      product: p1,
      name: p1?.title || p1?.name || "Oversized Wool Blazer", 
      priceRaw: p1?.price || 14500,
      price: `Rs ${(p1?.price || 14500).toLocaleString()}`, 
      top: data.item1Top || "20%", 
      left: data.item1Left || "30%" 
    },
    { 
      id: 2, 
      product: p2,
      name: p2?.title || p2?.name || "Wide-Leg Trousers", 
      priceRaw: p2?.price || 8000,
      price: `Rs ${(p2?.price || 8000).toLocaleString()}`, 
      top: data.item2Top || "60%", 
      left: data.item2Left || "45%" 
    },
    { 
      id: 3, 
      product: p3,
      name: p3?.title || p3?.name || "Leather Handbag", 
      priceRaw: p3?.price || 11200,
      price: `Rs ${(p3?.price || 11200).toLocaleString()}`, 
      top: data.item3Top || "45%", 
      left: data.item3Left || "70%" 
    }
  ];

  const handleAddToCart = (item, idx, e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (item.product) {
      addToCart(item.product, 1, item.product.sizes?.[0] || 'M', item.product.colors?.[0] || 'Default');
      toast.success(`${item.name} added to cart!`);
    } else {
      toast.error('Product not available');
    }
  };

  const handleAddLookToCart = () => {
    lookItems.forEach((item) => {
      if (item.product) {
        addToCart(item.product, 1, item.product.sizes?.[0] || 'M', item.product.colors?.[0] || 'Default');
      }
    });
    toast.success('Entire look added to cart!');
  };

  return (
    <section className="py-24 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-16">
          <p className="text-[11px] font-bold tracking-[0.3em] text-gray-500 uppercase mb-4">{data.subheading || "Editorial Style"}</p>
          <h2 className="text-[32px] font-extrabold text-black tracking-wide uppercase">{data.heading || "SHOP THE LOOK"}</h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 bg-[#FAFAFA] p-8 lg:p-16">
          
          {/* Main Look Image (Interactive) */}
          <div onClick={handleAddLookToCart} className="block relative w-full lg:w-1/2 aspect-[4/5] group cursor-crosshair">
            <Image 
              src={data.images && data.images.length > 0 ? data.images[0] : "/lookbook_portrait.png"} 
              alt={data.heading || "Lookbook"}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            
            {/* Interactive Pins */}
            {lookItems.map((item, idx) => (
              <button 
                key={item.id} 
                className="absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-colors hover:scale-110 shadow-lg group/pin border-none cursor-pointer"
                style={{ top: item.top, left: item.left }}
                aria-label={`View details for ${item.name}`}
                onClick={(e) => handleAddToCart(item, idx, e)}
              >
                <Plus size={16} />
                <div className="absolute left-10 top-1/2 -translate-y-1/2 bg-white px-4 py-2 text-xs font-bold shadow-xl whitespace-nowrap opacity-0 group-hover/pin:opacity-100 transition-opacity text-black z-50">
                  {item.name} - {item.price}
                </div>
              </button>
            ))}
          </div>

          {/* Shop The Look Panel */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center pl-0 lg:pl-12">
            <h3 className="text-3xl font-black mb-6 uppercase tracking-wider">{data.shopHeading || "The Autumn Edit"}</h3>
            <p className="text-gray-500 mb-10 leading-relaxed text-sm whitespace-pre-line">
              {data.shopDescription || "Discover the perfect balance of comfort and sophistication. This curated look combines oversized tailoring with effortless drape, designed for the modern wardrobe."}
            </p>

            <div className="space-y-6">
              {lookItems.map((item, idx) => item.product ? (
                <Link href={`/shop/${item.product._id}`} key={item.id} className="flex items-center gap-6 p-4 border border-gray-100 shadow-sm md:border-transparent md:shadow-none hover:border-gray-200 hover:shadow-lg transition-all bg-white cursor-pointer group">
                  <div className="w-20 h-24 bg-gray-100 overflow-hidden flex-shrink-0 relative">
                    <Image 
                      src={item.product?.images?.[0] || (data.images && data.images.length > idx + 1 ? data.images[idx + 1] : `/product_card_${(idx % 2) + 1}.png`)} 
                      fill
                      sizes="80px"
                      className="object-cover grayscale-0 opacity-100 md:grayscale md:opacity-70 md:group-hover:grayscale-0 md:group-hover:opacity-100 transition-all duration-700"
                      alt={item.name}
                    />
                  </div>
                  <div className="flex-grow">
                    <h4 className="text-sm font-bold text-black md:text-gray-900 uppercase tracking-wide mb-1 md:group-hover:text-black">{item.name}</h4>
                    <p className="text-gray-500 text-sm">{item.price}</p>
                  </div>
                  <button onClick={(e) => handleAddToCart(item, idx, e)} className="w-10 h-10 border border-gray-300 flex items-center justify-center rounded-full md:hover:bg-black md:hover:text-white md:hover:border-black transition-colors active:bg-black active:text-white active:border-black" aria-label={`Add ${item.name} to cart`}>
                    <Plus size={16} />
                  </button>
                </Link>
              ) : null)}
            </div>
            
            <button onClick={handleAddLookToCart} className="mt-12 bg-black text-white w-full py-4 text-xs font-bold tracking-[0.2em] hover:bg-gray-800 transition-colors">
              {data.buttonText || "ADD ENTIRE LOOK TO CART"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
