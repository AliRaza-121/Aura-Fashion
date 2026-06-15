"use client";
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import { LogOut, User, ShieldAlert, Globe, Loader2, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function TopBar() {
  const { data: session, status } = useSession();
  const [langOpen, setLangOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'ar', name: 'Arabic' },
    { code: 'zh-CN', name: 'Chinese' },
    { code: 'ur', name: 'Urdu' }
  ];

  const handleLanguageChange = (langCode) => {
    setLangOpen(false);
    
    if (langCode === 'en') {
      // Clear cookie to revert to default English
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
    } else {
      // Set the googtrans cookie manually to bypass DOM issues
      document.cookie = `/en/${langCode}; path=/;`; // fallback format
      document.cookie = `googtrans=/en/${langCode}; path=/;`;
      document.cookie = `googtrans=/en/${langCode}; path=/; domain=${window.location.hostname};`;
    }
    
    window.location.reload();
  };

  return (
    <div className="hidden md:flex bg-black text-gray-400 text-[11px] py-2.5 px-8 justify-between items-center tracking-wider uppercase font-medium">
      <div className="flex items-center space-x-4">
        <div className="relative" ref={dropdownRef}>
          <div 
            onClick={() => setLangOpen(!langOpen)}
            className="flex items-center hover:text-white transition-colors cursor-pointer group"
          >
            <Globe size={12} className="mr-1.5 flex-shrink-0 text-gray-400 group-hover:text-white transition-colors" />
            <span className="text-gray-400 group-hover:text-white transition-colors uppercase font-medium">Language</span>
            <ChevronDown size={10} className={`ml-1 text-gray-500 group-hover:text-white transition-transform duration-300 ${langOpen ? 'rotate-180' : ''}`} />
          </div>
          
          {/* Hidden Google Translate Element to hold the engine */}
          <div className="hidden">
            <div id="google_translate_element"></div>
          </div>

          {/* Premium Custom Dropdown Menu */}
          {langOpen && (
            <div className="absolute top-full left-0 mt-3 w-32 bg-[#0f0f0f] border border-white/10 rounded-lg shadow-2xl overflow-hidden z-50 py-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className="w-full text-left px-4 py-2 text-[10px] tracking-[0.1em] text-gray-400 hover:text-white hover:bg-white/5 transition-colors uppercase font-bold"
                >
                  {lang.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center tracking-[0.2em] text-gray-300">
        Free Shipping On Domestic Orders Over Rs 15,000
      </div>
      
      <div className="flex items-center space-x-6">
        {status === 'loading' ? (
          <div className="flex items-center text-gray-500">
            <Loader2 size={12} className="animate-spin mr-2" /> Loading
          </div>
        ) : session?.user ? (
          <div className="flex items-center space-x-4">
            {!session.user.isAdmin && (
              <Link href="/profile" className="flex items-center text-white space-x-2 hover:text-gray-300 transition-colors">
                <div className="w-5 h-5 bg-gray-800 rounded-full flex items-center justify-center border border-gray-700 relative overflow-hidden">
                  {session.user.profilePicture ? (
                    <Image src={session.user.profilePicture} alt="Profile" fill sizes="20px" className="object-cover" />
                  ) : (
                    <User size={10} />
                  )}
                </div>
                <span>{session.user.name.split(' ')[0]}</span>
              </Link>
            )}
            
            {session.user.isAdmin && (
              <Link 
                href="/admin" 
                className="flex items-center text-blue-400 hover:text-blue-300 transition-colors border border-blue-900/50 bg-blue-950/30 px-3 py-1 rounded-full"
              >
                <ShieldAlert size={12} className="mr-1.5" />
                Admin Panel
              </Link>
            )}
            
            <button 
              onClick={() => signOut()} 
              className="flex items-center text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <LogOut size={12} className="mr-1.5" />
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-5">
            <Link href="/login" className="hover:text-white transition-colors flex items-center">
              <User size={12} className="mr-1.5" /> Login
            </Link>
            <Link 
              href="/register" 
              className="text-white bg-gray-800 hover:bg-gray-700 px-4 py-1 rounded-full transition-colors"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
