"use client";
import { ShoppingCart, Menu, X, Search, User, ShieldAlert, Heart } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useCartStore } from '@/store/cartStore';
import dynamic from 'next/dynamic';
const CartDrawer = dynamic(() => import('./CartDrawer'), { ssr: false });
import { useWishlistStore } from '@/store/wishlistStore';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function NavBar() {
  const [fashionHover, setFashionHover] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const openCart = useCartStore((state) => state.openCart);
  const cartItems = useCartStore((state) => state.cartItems);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const wishlistItems = useWishlistStore((state) => state.wishlistItems);
  const [mounted, setMounted] = useState(false);
  const [categories, setCategories] = useState({ Mens: [], Womens: [], Kids: [] });
  const router = useRouter();
  const { data: session } = useSession();

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileSearchOpen(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchCategories();
  }, []);

  // Lock body scroll when mobile menu or search is open
  useEffect(() => {
    if (mobileMenuOpen || mobileSearchOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen, mobileSearchOpen]);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (err) {
      console.error('Failed to fetch categories', err);
    }
  };

  const [isSticky, setIsSticky] = useState(false);
  const [showSticky, setShowSticky] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Determine if we've scrolled past the header/topbar area
      if (currentScrollY > 150) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }

      // Determine scroll direction to show/hide smart header
      if (currentScrollY < lastScrollY.current) {
        // Scrolling UP
        setShowSticky(true);
      } else if (currentScrollY > 150 && currentScrollY > lastScrollY.current) {
        // Scrolling DOWN and past threshold
        setShowSticky(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <div
        className={`w-full border-b border-gray-100 bg-white shadow-sm z-40 transition-transform duration-300 ease-in-out ${isSticky
          ? 'fixed top-0 left-0 right-0'
          : 'relative'
          } ${isSticky && !showSticky ? '-translate-y-full' : 'translate-y-0'}`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center h-[60px]">

          {/* Mobile Menu & Search Toggles */}
          <div className="md:hidden flex items-center space-x-4 flex-1">
            <button onClick={() => { setMobileMenuOpen(true); setMobileSearchOpen(false); }} className="text-gray-800 hover:text-black transition-colors" aria-label="Open menu">
              <Menu size={24} strokeWidth={1.5} />
            </button>
            <button onClick={() => { setMobileSearchOpen(!mobileSearchOpen); setMobileMenuOpen(false); }} className="text-gray-800" aria-label="Toggle search">
              <Search size={20} />
            </button>
          </div>

          {/* Mobile Centered Logo */}
          <div className="md:hidden flex justify-center items-center flex-1">
            <Link href="/" className="text-2xl font-black tracking-widest text-black">AURA</Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex space-x-10 text-[13px] font-bold tracking-wider text-gray-800 h-full">
            <Link href="/" className="hover:text-black flex items-center h-full nav-link-hover transition-colors">HOME</Link>

            {/* Shop Dropdown Trigger */}
            <div
              className="relative flex items-center cursor-pointer h-full nav-link-hover transition-colors"
              onMouseEnter={() => setFashionHover(true)}
              onMouseLeave={() => setFashionHover(false)}
            >
              <Link href="/shop" className="flex items-center hover:text-black">
                SHOP <span className="text-[9px] ml-1.5 opacity-60">▼</span>
              </Link>

              {/* Mega Menu */}
              {fashionHover && (
                <div className="absolute top-[60px] -left-4 w-[600px] max-w-[90vw] bg-white shadow-2xl p-6 md:p-10 flex justify-between border-t border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden">
                  <div className="w-1/3 pr-2 md:pr-4">
                    <h3 className="text-[11px] font-bold text-gray-900 mb-5 tracking-widest uppercase">MENS</h3>
                    <ul className="space-y-4 text-gray-500 font-normal text-[13px]">
                      {categories.Mens.length > 0 ? categories.Mens.map(subCat => (
                        <Link key={subCat} href={`/shop?category=mens&subcategory=${encodeURIComponent(subCat)}`} className="block hover:text-black hover:translate-x-1 transition-transform"><li>{subCat}</li></Link>
                      )) : <li className="text-gray-300 italic">No items yet</li>}
                    </ul>
                  </div>
                  <div className="w-1/3 pr-4">
                    <h3 className="text-[11px] font-bold text-gray-900 mb-5 tracking-widest uppercase">WOMENS</h3>
                    <ul className="space-y-4 text-gray-500 font-normal text-[13px]">
                      {categories.Womens.length > 0 ? categories.Womens.map(subCat => (
                        <Link key={subCat} href={`/shop?category=womens&subcategory=${encodeURIComponent(subCat)}`} className="block hover:text-black hover:translate-x-1 transition-transform"><li>{subCat}</li></Link>
                      )) : <li className="text-gray-300 italic">No items yet</li>}
                    </ul>
                  </div>
                  <div className="w-1/3">
                    <h3 className="text-[11px] font-bold text-gray-900 mb-5 tracking-widest uppercase">KIDS</h3>
                    <ul className="space-y-4 text-gray-500 font-normal text-[13px]">
                      {categories.Kids.length > 0 ? categories.Kids.map(subCat => (
                        <Link key={subCat} href={`/shop?category=kids&subcategory=${encodeURIComponent(subCat)}`} className="block hover:text-black hover:translate-x-1 transition-transform"><li>{subCat}</li></Link>
                      )) : <li className="text-gray-300 italic">No items yet</li>}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            <Link href="/shop?category=mens" className="hover:text-black flex items-center h-full nav-link-hover transition-colors">MENS</Link>
            <Link href="/shop?category=womens" className="hover:text-black flex items-center h-full nav-link-hover transition-colors">WOMENS</Link>
            <Link href="/shop?category=kids" className="hover:text-black flex items-center h-full nav-link-hover transition-colors">KIDS</Link>
            <Link href="/contact" className="hover:text-black flex items-center h-full nav-link-hover transition-colors">CONTACT</Link>
          </div>

          {/* Wishlist & Cart */}
          <div className="flex items-center space-x-6 h-full md:flex-none flex-1 justify-end">
            <Link
              href="/wishlist"
              className="hidden md:flex items-center text-[13px] font-bold cursor-pointer transition-colors h-full nav-link-hover hover:text-black text-gray-800"
            >
              <Heart size={18} className="mr-2" />
              WISHLIST ({mounted ? wishlistItems.length : 0})
            </Link>

            <button
              onClick={openCart}
              className="flex items-center text-[13px] font-bold cursor-pointer transition-colors h-full nav-link-hover hover:text-black text-gray-800"
              aria-label="Open cart"
            >
              <ShoppingCart size={18} className="md:mr-2" />
              <span className="hidden md:inline">CART</span> ({mounted ? cartCount : 0})
            </button>
          </div>
        </div>
      </div>

      {/* Premium Dark Mode Mobile Side Drawer */}
      <div
        className={`md:hidden fixed inset-0 z-[100] transition-opacity duration-500 ease-out ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-md touch-none"
          onClick={() => setMobileMenuOpen(false)}
        ></div>

        {/* Drawer Panel */}
        <div
          className={`absolute top-0 left-0 h-full w-[85%] max-w-[400px] bg-[#0a0a0a] text-white shadow-[20px_0_40px_rgba(0,0,0,0.5)] flex flex-col transform transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          {/* Header */}
          <div className="px-8 py-6 flex justify-between items-center border-b border-white/10 touch-none">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-black tracking-widest text-white">AURA</Link>
            <button onClick={() => setMobileMenuOpen(false)} className="text-gray-400 hover:text-white transition-colors bg-white/5 p-2 rounded-full">
              <X size={20} strokeWidth={2} />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-8 py-10 no-scrollbar overscroll-none">
            <div className="space-y-8">
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block text-4xl font-light tracking-wide text-white/90 hover:text-white hover:translate-x-2 transition-all duration-300">Home</Link>
              <Link href="/shop" onClick={() => setMobileMenuOpen(false)} className="block text-4xl font-light tracking-wide text-white/90 hover:text-white hover:translate-x-2 transition-all duration-300">Shop All</Link>
            </div>

            <div className="mt-16 mb-12">
              <p className="text-[10px] font-bold text-gray-500 tracking-[0.3em] uppercase mb-8">Collections</p>
              <div className="space-y-6">
                <Link href="/shop?category=mens" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between text-2xl font-medium text-gray-400 hover:text-white transition-colors group">
                  <span className="group-hover:translate-x-2 transition-transform duration-300">Mens</span>
                </Link>
                <Link href="/shop?category=womens" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between text-2xl font-medium text-gray-400 hover:text-white transition-colors group">
                  <span className="group-hover:translate-x-2 transition-transform duration-300">Womens</span>
                </Link>
                <Link href="/shop?category=kids" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between text-2xl font-medium text-gray-400 hover:text-white transition-colors group">
                  <span className="group-hover:translate-x-2 transition-transform duration-300">Kids</span>
                </Link>
              </div>
            </div>

            <div className="w-full h-px bg-gradient-to-r from-white/10 to-transparent my-10"></div>

            <div className="space-y-8">
              <Link href="/wishlist" onClick={() => setMobileMenuOpen(false)} className="flex items-center text-xs font-bold text-gray-400 hover:text-white transition-colors tracking-[0.2em] uppercase">
                <Heart size={16} strokeWidth={2} className="mr-4 text-gray-500" /> Wishlist <span className="ml-3 text-[10px] bg-white/10 px-2 py-0.5 rounded-full">{mounted ? wishlistItems.length : 0}</span>
              </Link>
              <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="flex items-center text-xs font-bold text-gray-400 hover:text-white transition-colors tracking-[0.2em] uppercase">
                <span className="w-4 h-[2px] bg-gray-500 mr-4"></span> Contact Support
              </Link>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="p-8 bg-[#0f0f0f] border-t border-white/5">
            {session ? (
              session.user?.isAdmin ? (
                <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center w-full py-4 bg-white text-black font-bold tracking-widest uppercase text-xs hover:bg-gray-200 transition-colors">
                  <ShieldAlert size={14} strokeWidth={2} className="mr-2" />
                  ADMIN PANEL
                </Link>
              ) : (
                <Link href="/profile" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center w-full py-4 bg-white/10 text-white font-bold tracking-widest uppercase text-xs hover:bg-white/20 transition-colors">
                  <User size={16} strokeWidth={2} className="mr-3" /> My Account
                </Link>
              )
            ) : (
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center w-full py-4 bg-white text-black font-bold tracking-widest uppercase text-xs hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                <User size={16} strokeWidth={2} className="mr-3" /> Sign In
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {mobileSearchOpen && (
        <div className="md:hidden absolute top-[60px] left-0 w-full bg-white border-b border-gray-100 shadow-xl z-40 p-4 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center border border-gray-300 rounded-sm px-3 py-3 focus-within:border-black transition-colors">
            <Search size={18} className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search for products..."
              className="outline-none w-full text-sm text-gray-900 bg-transparent placeholder-gray-400 font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              autoFocus
            />
            {searchQuery && (
              <button className="text-gray-400 p-1 hover:text-black transition-colors" onClick={() => setSearchQuery('')}>
                <X size={16} />
              </button>
            )}
          </div>
          {searchQuery && (
            <div className="mt-4 pb-2">
              <p className="text-xs text-gray-500 italic mb-2">Press enter to search for "{searchQuery}"</p>
            </div>
          )}
        </div>
      )}
      <CartDrawer />
    </>
  );
}
