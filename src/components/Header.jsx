"use client";
import { Search, Phone, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Header() {
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchResults = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }
      setIsSearching(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.slice(0, 4)); // Only show top 4 results
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceId = setTimeout(fetchResults, 300);
    return () => clearTimeout(debounceId);
  }, [searchQuery]);

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchFocused(false);
    }
  };

  return (
    <div className="hidden md:flex px-8 py-6 flex-col md:flex-row justify-between items-center bg-white relative border-b border-gray-100 gap-6 md:gap-0">
      {/* Search Bar */}
      <div className="relative w-full md:w-80 hidden md:block">
        <div className={`flex items-center border ${searchFocused ? 'border-gray-400' : 'border-gray-200'} rounded-sm px-3 py-2 transition-colors`}>
          <input 
            type="text" 
            placeholder="Search" 
            className="outline-none w-full text-sm text-gray-700 bg-transparent placeholder-gray-500"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
          />
          {searchQuery && (
            <button className="text-gray-500 hover:text-gray-700 mr-2" onClick={() => setSearchQuery('')} aria-label="Clear search">
              <X size={14} />
            </button>
          )}
          <Search size={18} className="text-gray-600 cursor-pointer hover:text-black" />
        </div>

        {/* Search Dropdown */}
        {searchFocused && (
          <div className="absolute top-full left-0 w-[400px] bg-white border border-gray-100 shadow-2xl mt-2 z-50 p-6 rounded-sm">
            {searchQuery === '' ? (
              <div className="text-sm text-gray-500 italic">Type to search for products or pages...</div>
            ) : (
              <div>
                <h4 className="text-[11px] font-bold text-gray-800 tracking-widest mb-3 uppercase">Pages</h4>
                <div className="text-sm text-gray-600 hover:text-black cursor-pointer mb-6">Policy for Buyers</div>
                
                <h4 className="text-[11px] font-bold text-gray-800 tracking-widest mb-4 uppercase">Products</h4>
                <div className="space-y-4">
                  {isSearching ? (
                    <div className="text-sm text-gray-500 italic py-2">Searching...</div>
                  ) : searchResults.length > 0 ? (
                    searchResults.map((product, idx) => (
                      <div 
                        key={product._id} 
                        className="flex gap-4 cursor-pointer group items-center"
                        onMouseDown={() => router.push(`/shop/${product._id}`)} // use onMouseDown to fire before onBlur of input
                      >
                        <div className="w-12 h-16 bg-gray-200 flex-shrink-0 relative overflow-hidden">
                          <Image src={product.images?.[0] || `/product_card_${(idx % 2) + 1}.png`} alt={product.title} fill sizes="48px" className="object-cover mix-blend-multiply" />
                        </div>
                        <div>
                          <div className="text-[11px] text-gray-500 mb-1">{product.category}</div>
                          <div className="text-sm text-gray-800 group-hover:text-blue-600 transition-colors leading-tight mb-1">{product.title}</div>
                          <div className="text-sm">
                            <span className="font-bold text-gray-900">Rs {product.price?.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-gray-500 italic py-2">No products found.</div>
                  )}
                </div>
                <div 
                  onClick={() => router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)}
                  className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center text-sm font-semibold cursor-pointer hover:text-blue-600 transition-colors"
                >
                  <span>Search for "{searchQuery}"</span>
                  <span>→</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Logo */}
      <div className="flex flex-col items-center">
        <h1 className="text-4xl font-extrabold tracking-widest text-black">AURA</h1>
        <p className="text-[9px] font-bold tracking-[0.3em] text-gray-500 mt-1">BEST ONLINE STORE</p>
      </div>

      {/* Contact */}
      <div className="hidden md:flex flex-col items-end w-auto shrink-0">
        <a 
          href="https://wa.me/923261302639" 
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2.5 bg-gray-50 hover:bg-whatsapp text-black hover:text-white px-4 py-2 rounded-full transition-all duration-300 border border-gray-200 hover:border-whatsapp shadow-sm"
        >
          <div className="bg-black/5 group-hover:bg-white/20 p-1.5 rounded-full transition-colors">
            <svg className="group-hover:animate-pulse" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
            </svg>
          </div>
          <span className="font-black text-sm tracking-wider">+92 326 1302639</span>
        </a>
        <div className="mt-2.5 flex items-center gap-2">
          <div className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </div>
          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.15em] whitespace-nowrap">
            Always Open, Always in Style — 24/7 Fashion Shopping ✨
          </p>
        </div>
      </div>
    </div>
  );
}
