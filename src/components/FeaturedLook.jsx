"use client";
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import toast from 'react-hot-toast';

export default function FeaturedLook({ data }) {
  const { addToCart } = useCartStore();

  if (!data) return null;

  const p1 = data.item1ProductId;
  const p2 = data.item2ProductId;
  const p3 = data.item3ProductId;

  const bundleItems = [
    { id: 1, product: p1, name: p1?.title || p1?.name || "Nylon Parka", image: p1?.images?.[0] || "/product_card_1.png", priceRaw: p1?.price || 18000, price: `Rs ${(p1?.price || 18000).toLocaleString()}` },
    { id: 2, product: p2, name: p2?.title || p2?.name || "Cargo Trousers", image: p2?.images?.[0] || "/product_card_2.png", priceRaw: p2?.price || 15000, price: `Rs ${(p2?.price || 15000).toLocaleString()}` },
    { id: 3, product: p3, name: p3?.title || p3?.name || "Cotton Tee", image: p3?.images?.[0] || "/product_card_1.png", priceRaw: p3?.price || 12000, price: `Rs ${(p3?.price || 12000).toLocaleString()}` }
  ];

  const handleAddBundleToCart = () => {
    // Add all 3 real items to cart if available, otherwise fallback to pseudo bundle
    if (p1 && p2 && p3) {
      addToCart(p1, 1, p1.sizes?.[0] || 'M', p1.colors?.[0] || 'Default');
      addToCart(p2, 1, p2.sizes?.[0] || 'M', p2.colors?.[0] || 'Default');
      addToCart(p3, 1, p3.sizes?.[0] || 'M', p3.colors?.[0] || 'Default');
      toast.success('All 3 items added to cart!');
    } else {
      const product = {
        _id: `featured-bundle-1`,
        name: `${data.heading ? data.heading.replace(/\n/g, ' ') : 'Urban Nomad'} Bundle`,
        price: data.bundlePrice || 45000,
        images: [data.image || "/lookbook_portrait.png"]
      };
      addToCart(product, 1, 'M');
      toast.success('Complete bundle added to cart!');
    }
  };

  return (
    <section className="bg-[#FAFAFA] border-t border-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-8 py-16 lg:py-24 flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
        
        {/* Left Side: Editorial Text */}
        <div className="lg:w-1/3 flex-shrink-0">
          <span className="text-gray-500 text-xs font-bold tracking-[0.2em] uppercase mb-4 block">Look of the Week</span>
          <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none mb-6 whitespace-pre-line">{data.heading || "Urban\nNomad"}</h3>
          <p className="text-gray-600 mb-0 lg:mb-8 leading-relaxed">
            {data.description || "A masterclass in transitional dressing. Combine functional outerwear with soft, breathable layers for a look that thrives in unpredictable city climates."}
          </p>
          {/* Bundle Price (Desktop only) */}
          <div className="border-t border-gray-200 pt-6 hidden lg:block">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-gray-500">Bundle Price</span>
              <span className="font-black text-xl">Rs {data.bundlePrice ? data.bundlePrice.toLocaleString() : '45,000'}</span>
            </div>
            <p className="text-xs text-gray-400 mb-6">Save 15% when you buy the complete look.</p>
            <button onClick={handleAddBundleToCart} className="block text-center w-full bg-black text-white py-4 text-xs font-bold tracking-widest hover:bg-gray-800 transition-colors">
              {data.buttonText || "ADD BUNDLE TO CART"}
            </button>
          </div>
        </div>

        {/* Right Side: Interactive Bundle Image */}
        <div className="lg:flex-1 w-full flex flex-col justify-center items-center lg:items-end mt-0">
          <div onClick={handleAddBundleToCart} className="block relative w-full max-w-[500px] aspect-[4/5] group cursor-pointer shadow-2xl">
            <Image 
              src={data.image || "/lookbook_portrait.png"} 
              alt="New Arrival Featured Look"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2U4ZThlOCIvPjwvc3ZnPg=="
              className="object-cover z-10 transition-transform duration-700 group-hover:scale-[0.98]"
            />
            
            {/* Popping out item 1 (Desktop only) */}
            {bundleItems[0].product && (
            <Link href={`/shop/${bundleItems[0].product._id}`} onClick={(e) => e.stopPropagation()} className="hidden md:block absolute top-[10%] left-[-5%] z-20 bg-white p-2 shadow-xl opacity-0 group-hover:opacity-100 translate-x-0 group-hover:-translate-x-4 transition-all duration-700 delay-100 w-40 cursor-pointer hover:scale-105 pointer-events-none group-hover:pointer-events-auto">
              <div className="relative w-full aspect-square mb-2">
                <Image src={bundleItems[0].image} alt={bundleItems[0].name} fill sizes="160px" className="object-cover" />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-center">{bundleItems[0].name}</p>
              <p className="text-[9px] text-gray-500 text-center mt-1">{bundleItems[0].price}</p>
            </Link>
            )}

            {/* Popping out item 2 (Desktop only) */}
            {bundleItems[1].product && (
            <Link href={`/shop/${bundleItems[1].product._id}`} onClick={(e) => e.stopPropagation()} className="hidden md:block absolute bottom-[20%] right-[-5%] z-20 bg-white p-2 shadow-xl opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-4 transition-all duration-700 delay-200 w-40 cursor-pointer hover:scale-105 pointer-events-none group-hover:pointer-events-auto">
              <div className="relative w-full aspect-square mb-2">
                <Image src={bundleItems[1].image} alt={bundleItems[1].name} fill sizes="160px" className="object-cover" />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-center">{bundleItems[1].name}</p>
              <p className="text-[9px] text-gray-500 text-center mt-1">{bundleItems[1].price}</p>
            </Link>
            )}

            {/* Popping out item 3 (Desktop only) */}
            {bundleItems[2].product && (
            <Link href={`/shop/${bundleItems[2].product._id}`} onClick={(e) => e.stopPropagation()} className="hidden md:block absolute top-[50%] left-[-5%] z-20 bg-white p-2 shadow-xl opacity-0 group-hover:opacity-100 translate-x-0 group-hover:-translate-x-4 transition-all duration-700 delay-300 w-32 cursor-pointer hover:scale-105 pointer-events-none group-hover:pointer-events-auto">
              <div className="relative w-full aspect-square mb-2">
                <Image src={bundleItems[2].image} alt={bundleItems[2].name} fill sizes="128px" className="object-cover" />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-center">{bundleItems[2].name}</p>
              <p className="text-[9px] text-gray-500 text-center mt-1">{bundleItems[2].price}</p>
            </Link>
            )}
          </div>

          {/* Bundle Items Breakdown (Mobile only) */}
          <div className="md:hidden w-full max-w-[500px] mt-6 grid grid-cols-3 gap-3">
            {bundleItems.map((item) => item.product ? (
              <Link href={`/shop/${item.product._id}`} key={item.id} className="bg-white p-2 shadow-sm border border-gray-100 rounded-lg">
                <div className="relative w-full aspect-square mb-2 bg-gray-50 rounded-md overflow-hidden">
                  <Image src={item.image} alt={item.name} fill sizes="33vw" className="object-cover mix-blend-multiply" />
                </div>
                <p className="text-[9px] font-bold uppercase tracking-wider text-center text-gray-800 line-clamp-1">{item.name}</p>
                <p className="text-[8px] text-gray-500 text-center mt-0.5">{item.price}</p>
              </Link>
            ) : null)}
          </div>

          {/* Bundle Price (Mobile only) */}
          <div className="border-t border-gray-200 pt-6 mt-8 w-full max-w-[500px] lg:hidden">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-gray-500">Bundle Price</span>
              <span className="font-black text-xl">Rs {data.bundlePrice ? data.bundlePrice.toLocaleString() : '45,000'}</span>
            </div>
            <p className="text-xs text-gray-400 mb-6">Save 15% when you buy the complete look.</p>
            <button onClick={handleAddBundleToCart} className="block text-center w-full bg-black text-white py-4 text-xs font-bold tracking-widest hover:bg-gray-800 transition-colors">
              {data.buttonText || "ADD BUNDLE TO CART"}
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
