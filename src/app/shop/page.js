"use client";
import { useState, useMemo, useEffect, Suspense, useRef } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import TopBar from '@/components/TopBar';
import Header from '@/components/Header';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Plus, Minus, Filter, X } from 'lucide-react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import StarRating from '@/components/StarRating';
import SkeletonLoader from '@/components/SkeletonLoader';
import ProductCard from '@/components/ProductCard';

function ShopContent() {
  const searchParams = useSearchParams();
  const initCat = searchParams.get('category');
  const initSubCat = searchParams.get('subcategory');

  const [selectedCategories, setSelectedCategories] = useState(
    initCat ? [initCat.charAt(0).toUpperCase() + initCat.slice(1).toLowerCase()] : []
  );
  const [selectedSubCategories, setSelectedSubCategories] = useState(
    initSubCat ? [initSubCat] : []
  );
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [priceRange, setPriceRange] = useState(100000); 
  const [expandedSections, setExpandedSections] = useState({ category: false, subcategory: false, price: false, size: false, color: false });
  const [sortBy, setSortBy] = useState('featured');
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [dbProducts, setDbProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCartStore();
  const shopTopRef = useRef(null);

  useEffect(() => {
    const cat = searchParams.get('category');
    const subCat = searchParams.get('subcategory');
    
    if (cat) {
      setSelectedCategories([cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase()]);
    } else {
      // Only clear if we explicitly navigate to a clean /shop URL
      if (!cat && !subCat && searchParams.toString() === '') {
        setSelectedCategories([]);
      }
    }

    if (subCat) {
      setSelectedSubCategories([subCat]);
    } else {
      if (!cat && !subCat && searchParams.toString() === '') {
        setSelectedSubCategories([]);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/admin/products');
        const data = await res.json();
        setDbProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const availableSubCategories = useMemo(() => {
    const subs = new Set();
    dbProducts.forEach(p => {
      // Only show subcategories for selected categories if any category is selected
      if (selectedCategories.length === 0 || selectedCategories.includes(p.category)) {
        if (p.subCategory) subs.add(p.subCategory);
      }
    });
    return Array.from(subs).sort();
  }, [dbProducts, selectedCategories]);

  const availableSizes = useMemo(() => {
    const sizes = new Set();
    dbProducts.forEach(p => {
      if (selectedCategories.length === 0 || selectedCategories.includes(p.category)) {
        if (p.sizes) p.sizes.forEach(s => sizes.add(s));
      }
    });
    return Array.from(sizes);
  }, [dbProducts, selectedCategories]);

  const availableColors = useMemo(() => {
    const colors = new Set();
    dbProducts.forEach(p => {
      if (selectedCategories.length === 0 || selectedCategories.includes(p.category)) {
        if (p.colors) p.colors.forEach(c => colors.add(c));
      }
    });
    return Array.from(colors).sort();
  }, [dbProducts, selectedCategories]);

  const filteredProducts = useMemo(() => {
    let result = dbProducts.filter(product => {
      if (searchParams.get('bestsellers') === 'true' && !product.isBestSeller) return false;
      if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) return false;
      if (selectedSubCategories.length > 0 && !selectedSubCategories.includes(product.subCategory)) return false;
      if (selectedSizes.length > 0 && !product.sizes.some(size => selectedSizes.includes(size))) return false;
      if (selectedColors.length > 0 && !product.colors.some(color => selectedColors.includes(color))) return false;
      if (product.price > priceRange) return false;
      return true;
    });

    if (sortBy === 'price-low-high') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high-low') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      result.sort((a, b) => b.id - a.id);
    }

    return result;
  }, [dbProducts, selectedCategories, selectedSizes, selectedColors, priceRange, sortBy, searchParams]);

  const scrollToShopTop = () => {
    if (shopTopRef.current) {
      const offset = 80; // Account for the sticky header
      const top = shopTopRef.current.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const toggleFilter = (state, setState, value) => {
    scrollToShopTop();
    if (state.includes(value)) {
      setState(state.filter(item => item !== value));
    } else {
      setState([...state, value]);
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const clearAll = () => {
    scrollToShopTop();
    setSelectedCategories([]);
    setSelectedSubCategories([]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setPriceRange(100000);
  };

  const hasFilters = selectedCategories.length > 0 || selectedSubCategories.length > 0 || selectedSizes.length > 0 || selectedColors.length > 0 || priceRange < 100000;

  return (
    <div className="min-h-screen flex flex-col bg-white text-black font-sans">
      <TopBar />
      <Header />
      <NavBar />

      <div className="pt-10 pb-6 text-center bg-white" ref={shopTopRef}>
        <h1 className="text-3xl font-black uppercase tracking-[0.2em] mb-2">
          {searchParams.get('bestsellers') === 'true' ? 'Best Sellers' : 'Shop All'}
        </h1>
        <p className="text-gray-400 text-[11px] tracking-widest uppercase">
          {searchParams.get('bestsellers') === 'true' ? 'Our most popular pieces' : 'The Complete Aura Collection'}
        </p>
      </div>

      <div className="flex-grow max-w-[1400px] mx-auto w-full px-8 pb-24 flex flex-col md:flex-row gap-8 md:gap-16">
        
        {/* Left Sidebar Filters - Ultra Minimal */}
        <aside className="w-full md:w-52 flex-shrink-0 relative mb-12 md:mb-0">
          <div className={`md:block ${mobileFiltersOpen ? 'fixed inset-0 z-[100] bg-white pt-20 px-6 pb-24 overflow-y-auto w-full h-full' : 'hidden'} md:sticky md:top-24 space-y-8 md:max-h-[calc(100vh-8rem)] md:overflow-y-auto md:pb-16 md:pr-2`}>
            
            {mobileFiltersOpen && (
              <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
                <h2 className="text-sm font-bold uppercase tracking-widest text-black">Filters</h2>
                <button onClick={() => setMobileFiltersOpen(false)} className="text-black p-2"><X size={20}/></button>
              </div>
            )}

            <div className={`flex justify-between items-center mb-8 pb-4 ${mobileFiltersOpen ? '' : 'border-b border-gray-200'}`}>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Filter By</span>
              {hasFilters && (
                <button onClick={clearAll} className="text-[9px] uppercase tracking-wider text-gray-400 hover:text-black transition-colors p-2">
                  Clear
                </button>
              )}
            </div>
            
            {/* Category Filter */}
            <div>
              <div 
                className="flex justify-between items-center cursor-pointer mb-4 group"
                onClick={() => toggleSection('category')}
              >
                <h3 className="text-[11px] font-bold tracking-[0.15em] uppercase text-gray-900 group-hover:text-black">Category</h3>
                {expandedSections.category ? <Minus size={12} className="text-gray-400" /> : <Plus size={12} className="text-gray-400" />}
              </div>
              
              {expandedSections.category && (
                <div className="space-y-3 animate-in slide-in-from-top-2 fade-in duration-200">
                  {['Mens', 'Womens', 'Kids'].map(cat => (
                    <label key={cat} className="relative flex items-center space-x-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        className="absolute opacity-0 inset-0 w-full h-full cursor-pointer peer" 
                        checked={selectedCategories.includes(cat)}
                        onChange={() => toggleFilter(selectedCategories, setSelectedCategories, cat)}
                      />
                      <div className={`w-3 h-3 flex items-center justify-center border transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-offset-1 peer-focus-visible:ring-black ${selectedCategories.includes(cat) ? 'bg-black border-black' : 'border-gray-300 group-hover:border-black'}`}>
                        {selectedCategories.includes(cat) && <span className="w-1.5 h-1.5 bg-white"></span>}
                      </div>
                      <span className={`text-[11px] uppercase tracking-widest transition-colors ${selectedCategories.includes(cat) ? 'font-bold text-black' : 'text-gray-500 group-hover:text-black'}`}>{cat}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Sub Category Filter */}
            {availableSubCategories.length > 0 && (
              <div className="pt-4 border-t border-gray-100">
                <div 
                  className="flex justify-between items-center cursor-pointer mb-4 group"
                  onClick={() => toggleSection('subcategory')}
                >
                  <h3 className="text-[11px] font-bold tracking-[0.15em] uppercase text-gray-900 group-hover:text-black">Sub Category</h3>
                  {expandedSections.subcategory ? <Minus size={12} className="text-gray-400" /> : <Plus size={12} className="text-gray-400" />}
                </div>
                
                {expandedSections.subcategory && (
                  <div className="space-y-3 animate-in slide-in-from-top-2 fade-in duration-200 max-h-60 overflow-y-auto pr-2">
                    {availableSubCategories.map(subCat => (
                      <label key={subCat} className="relative flex items-center space-x-3 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          className="absolute opacity-0 inset-0 w-full h-full cursor-pointer peer" 
                          checked={selectedSubCategories.includes(subCat)}
                          onChange={() => toggleFilter(selectedSubCategories, setSelectedSubCategories, subCat)}
                        />
                        <div className={`w-3 h-3 flex items-center justify-center border transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-offset-1 peer-focus-visible:ring-black ${selectedSubCategories.includes(subCat) ? 'bg-black border-black' : 'border-gray-300 group-hover:border-black'}`}>
                          {selectedSubCategories.includes(subCat) && <span className="w-1.5 h-1.5 bg-white"></span>}
                        </div>
                        <span className={`text-[11px] uppercase tracking-widest transition-colors ${selectedSubCategories.includes(subCat) ? 'font-bold text-black' : 'text-gray-500 group-hover:text-black'}`}>{subCat}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Price Filter */}
            <div className="pt-4 border-t border-gray-100">
              <div 
                className="flex justify-between items-center cursor-pointer mb-4 group"
                onClick={() => toggleSection('price')}
              >
                <h3 className="text-[11px] font-bold tracking-[0.15em] uppercase text-gray-900 group-hover:text-black">Price</h3>
                {expandedSections.price ? <Minus size={12} className="text-gray-400" /> : <Plus size={12} className="text-gray-400" />}
              </div>
              
              {expandedSections.price && (
                <div className="pt-2 animate-in slide-in-from-top-2 fade-in duration-200">
                  <input 
                    type="range" 
                    min="0" 
                    max="100000" 
                    step="1000"
                    value={priceRange} 
                    onChange={(e) => {
                      setPriceRange(Number(e.target.value));
                    }}
                    onMouseUp={scrollToShopTop}
                    onTouchEnd={scrollToShopTop}
                    className="w-full h-[1px] bg-gray-300 appearance-none cursor-pointer accent-black outline-none"
                  />
                  <div className="flex justify-between text-[9px] uppercase tracking-widest text-gray-400 mt-4">
                    <span>Rs 0</span>
                    <span className="text-black font-bold">Rs {priceRange.toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Size Filter */}
            <div className="pt-4 border-t border-gray-100">
              <div 
                className="flex justify-between items-center cursor-pointer mb-4 group"
                onClick={() => toggleSection('size')}
              >
                <h3 className="text-[11px] font-bold tracking-[0.15em] uppercase text-gray-900 group-hover:text-black">Size</h3>
                {expandedSections.size ? <Minus size={12} className="text-gray-400" /> : <Plus size={12} className="text-gray-400" />}
              </div>

              {expandedSections.size && (
                <div className="flex flex-wrap gap-2 animate-in slide-in-from-top-2 fade-in duration-200 max-h-60 overflow-y-auto pr-2">
                  {availableSizes.map(size => (
                    <button 
                      key={size}
                      onClick={() => toggleFilter(selectedSizes, setSelectedSizes, size)}
                      className={`h-8 px-3 text-[9px] font-bold transition-all border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-1 ${
                        selectedSizes.includes(size) 
                          ? 'bg-black text-white border-black' 
                          : 'bg-transparent text-gray-500 border-gray-200 hover:border-black hover:text-black'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Color Filter */}
            <div className="pt-4 border-t border-gray-100">
              <div 
                className="flex justify-between items-center cursor-pointer mb-4 group"
                onClick={() => toggleSection('color')}
              >
                <h3 className="text-[11px] font-bold tracking-[0.15em] uppercase text-gray-900 group-hover:text-black">Color</h3>
                {expandedSections.color ? <Minus size={12} className="text-gray-400" /> : <Plus size={12} className="text-gray-400" />}
              </div>

              {expandedSections.color && (
                <div className="space-y-3 animate-in slide-in-from-top-2 fade-in duration-200 max-h-60 overflow-y-auto pr-2">
                  {availableColors.map(colorName => {
                    const colorMap = {
                      'Black': '#000000', 'White': '#FFFFFF', 'Blue': '#2563EB', 'Red': '#DC2626', 
                      'Pink': '#FBCFE8', 'Grey': '#9CA3AF', 'Green': '#16A34A', 'Beige': '#F5F5DC',
                      'Brown': '#8B4513', 'Navy': '#000080'
                    };
                    const hex = colorMap[colorName] || '#CCCCCC';
                    return (
                      <label key={colorName} className="relative flex items-center space-x-3 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          className="absolute opacity-0 inset-0 w-full h-full cursor-pointer peer" 
                          checked={selectedColors.includes(colorName)}
                          onChange={() => toggleFilter(selectedColors, setSelectedColors, colorName)}
                        />
                        <div 
                          className={`w-3.5 h-3.5 rounded-full border border-gray-300 shadow-inner flex items-center justify-center transition-all peer-focus:ring-2 peer-focus:ring-offset-1 peer-focus:ring-black ${selectedColors.includes(colorName) ? 'ring-2 ring-offset-1 ring-black' : 'group-hover:scale-110'}`}
                          style={{ backgroundColor: hex }}
                        >
                          {selectedColors.includes(colorName) && colorName === 'White' && <span className="w-1 h-1 bg-black rounded-full"></span>}
                          {selectedColors.includes(colorName) && colorName !== 'White' && <span className="w-1 h-1 bg-white rounded-full"></span>}
                        </div>
                        <span className={`text-[11px] uppercase tracking-widest transition-colors ${selectedColors.includes(colorName) ? 'font-bold text-black' : 'text-gray-500 group-hover:text-black'}`}>
                          {colorName}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

          {/* Mobile Filters are triggered from the inline bar instead of floating button */}
        </aside>

        {/* Right Side Products Grid */}
        <div className="flex-grow w-full min-h-[150vh]">
          {/* Mobile Filter & Sort Bar */}
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100 py-4 md:py-0">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setMobileFiltersOpen(true)}
                className="md:hidden flex items-center text-[10px] font-bold uppercase tracking-widest text-black border border-gray-200 px-4 py-2 rounded-md bg-white hover:bg-gray-50"
              >
                <Filter size={14} className="mr-2" /> Filters
                {hasFilters && <span className="ml-2 bg-black text-white w-4 h-4 flex items-center justify-center rounded-full text-[8px]">{selectedCategories.length + selectedSubCategories.length + selectedSizes.length + selectedColors.length + (priceRange < 100000 ? 1 : 0)}</span>}
              </button>
              <p className="hidden md:block text-[10px] font-bold tracking-widest uppercase text-gray-400">{filteredProducts.length} Results</p>
            </div>
            <div className="relative">
              <div 
                className="text-[10px] font-bold uppercase tracking-widest text-gray-800 cursor-pointer hover:text-black flex items-center"
                onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
              >
                Sort By: {sortBy === 'price-low-high' ? 'Price: Low - High' : sortBy === 'price-high-low' ? 'Price: High - Low' : sortBy === 'newest' ? 'Newest' : 'Featured'} <span className="ml-1 text-[8px] opacity-60">▼</span>
              </div>
              
              {sortDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex flex-col py-2 text-[10px] uppercase tracking-widest font-bold">
                    <button onClick={() => { setSortBy('featured'); setSortDropdownOpen(false); }} className={`text-left px-4 py-3 hover:bg-gray-50 ${sortBy === 'featured' ? 'text-black' : 'text-gray-500'}`}>Featured</button>
                    <button onClick={() => { setSortBy('newest'); setSortDropdownOpen(false); }} className={`text-left px-4 py-3 hover:bg-gray-50 ${sortBy === 'newest' ? 'text-black' : 'text-gray-500'}`}>Newest Arrivals</button>
                    <button onClick={() => { setSortBy('price-low-high'); setSortDropdownOpen(false); }} className={`text-left px-4 py-3 hover:bg-gray-50 ${sortBy === 'price-low-high' ? 'text-black' : 'text-gray-500'}`}>Price: Low - High</button>
                    <button onClick={() => { setSortBy('price-high-low'); setSortDropdownOpen(false); }} className={`text-left px-4 py-3 hover:bg-gray-50 ${sortBy === 'price-high-low' ? 'text-black' : 'text-gray-500'}`}>Price: High - Low</button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {loading ? (
            <div className="py-12">
              <SkeletonLoader count={8} />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-32 flex flex-col items-center justify-center text-center text-gray-400">
              <span className="text-4xl mb-4 font-serif italic opacity-30">No matches</span>
              <p className="text-[11px] tracking-widest uppercase max-w-sm leading-loose">We couldn't find anything matching your exact criteria. Try removing some filters.</p>
              <button onClick={clearAll} className="mt-8 border border-black text-black text-[10px] font-bold tracking-widest uppercase py-3 px-8 hover:bg-black hover:text-white transition-colors">
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
              {filteredProducts.map((product, idx) => {
                return (
                <div key={product._id} className="h-full">
                  <ProductCard product={product} priority={idx < 8} />
                </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      <Footer />
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center"><div className="text-sm font-bold tracking-widest uppercase text-gray-400">Loading Shop...</div></div>}>
      <ShopContent />
    </Suspense>
  );
}