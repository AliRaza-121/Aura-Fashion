"use client";
import { useState } from 'react';
import toast from 'react-hot-toast';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || 'Subscribed successfully!');
        setEmail('');
      } else {
        toast.error(data.error || 'Subscription failed');
      }
    } catch (err) {
      toast.error('An error occurred');
    }
    setLoading(false);
  };

  return (
    <footer className="bg-[#050505] text-white py-12 overflow-hidden relative">
      
      {/* Massive Background Typography Watermark */}
      <div className="absolute top-0 left-0 w-full overflow-hidden flex justify-center pointer-events-none opacity-[0.03] select-none">
        <h1 className="text-[25vw] font-black leading-none tracking-tighter">AURA</h1>
      </div>

      <div className="max-w-7xl mx-auto px-8 relative z-10">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-12">
          
          {/* Newsletter & Branding (Takes up 5 columns on desktop) */}
          <div className="lg:col-span-5 flex flex-col items-start text-left">
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter mb-2">Join The Inner Circle</h2>
            <p className="text-white/60 mb-6 max-w-sm text-xs leading-relaxed">
              Subscribe to receive exclusive access to limited drops, early sale previews, and editorial stories.
            </p>
            
            <form className="relative w-full max-w-sm group mb-8" onSubmit={handleSubscribe}>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="EMAIL ADDRESS" 
                className="w-full bg-transparent border-b border-white/30 py-2 pr-10 text-xs text-white placeholder-white/40 focus:outline-none focus:border-white transition-colors disabled:opacity-50 autofill:shadow-[inset_0_0_0px_1000px_#050505] autofill:[-webkit-text-fill-color:white]"
                required
                spellCheck="false"
                disabled={loading}
              />
              <button 
                type="submit" 
                disabled={loading}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-white/50 group-hover:text-white transition-colors p-1 disabled:opacity-50"
              >
                {loading ? <span className="animate-spin block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span> : <ArrowRight size={16} />}
              </button>
            </form>

            <h3 className="text-xl font-black tracking-widest mb-2">AURA</h3>
            <p className="text-white/40 text-[10px] leading-relaxed max-w-xs">
              Redefining modern luxury through sustainable craftsmanship and timeless silhouettes. Designed for the bold.
            </p>
          </div>

          {/* Links Grid (Takes up 7 columns on desktop) */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-4 gap-8">
            
            <div className="flex flex-col space-y-3">
              <h4 className="text-xs font-bold tracking-[0.2em] uppercase mb-3 text-white/50">Shop</h4>
              <Link href="/shop" className="text-sm text-white/80 hover:text-white transition-colors w-fit relative group">
                Shop All
                <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link href="/shop?category=Mens" className="text-sm text-white/80 hover:text-white transition-colors w-fit relative group">
                Mens
                <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link href="/shop?category=Womens" className="text-sm text-white/80 hover:text-white transition-colors w-fit relative group">
                Womens
                <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link href="/shop?category=Kids" className="text-sm text-white/80 hover:text-white transition-colors w-fit relative group">
                Kids
                <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </div>

            <div className="flex flex-col space-y-3">
              <h4 className="text-xs font-bold tracking-[0.2em] uppercase mb-3 text-white/50">Customer Care</h4>
              <Link href="/track" className="text-sm text-white/80 hover:text-white transition-colors w-fit relative group">
                Track Order
                <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link href="/contact" className="text-sm text-white/80 hover:text-white transition-colors w-fit relative group">
                Contact Us
                <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link href="/refund" className="text-sm text-white/80 hover:text-white transition-colors w-fit relative group">
                Returns
                <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </div>

            <div className="flex flex-col space-y-3">
              <h4 className="text-xs font-bold tracking-[0.2em] uppercase mb-3 text-white/50">Admin</h4>
              <Link href="/admin" className="text-sm text-white/80 hover:text-white transition-colors w-fit relative group">
                Dashboard
                <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link href="/admin/orders" className="text-sm text-white/80 hover:text-white transition-colors w-fit relative group">
                Orders
                <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link href="/admin/products" className="text-sm text-white/80 hover:text-white transition-colors w-fit relative group">
                Products
                <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </div>

            <div className="flex flex-col space-y-3">
              <h4 className="text-xs font-bold tracking-[0.2em] uppercase mb-3 text-white/50">Social</h4>
              <div className="flex flex-col space-y-3">
                <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Visit our Instagram page" className="text-sm text-white/80 hover:text-white transition-colors w-fit relative group">
                  Instagram
                  <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full"></span>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Visit our Twitter page" className="text-sm text-white/80 hover:text-white transition-colors w-fit relative group">
                  Twitter
                  <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full"></span>
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Section: Copyright & Legal */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-white/10 text-[9px] text-white/30 tracking-widest uppercase">
          <p>© {new Date().getFullYear()} AURA. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/refund" className="hover:text-white transition-colors">Refund Policy</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
