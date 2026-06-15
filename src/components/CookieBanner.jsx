'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Link from 'next/link';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasConsented = localStorage.getItem('cookie_consent');
    if (!hasConsented) {
      // Small delay for better UX
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie_consent', 'true');
    setIsVisible(false);
  };

  const declineCookies = () => {
    localStorage.setItem('cookie_consent', 'false');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm bg-white/90 backdrop-blur-md border border-neutral-200 shadow-2xl p-6 z-50 rounded-2xl"
        >
          <button 
            onClick={() => setIsVisible(false)}
            className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-900 transition-colors"
          >
            <X size={18} />
          </button>
          
          <h3 className="text-lg font-medium text-neutral-900 mb-2">Cookie Consent</h3>
          <p className="text-sm text-neutral-600 mb-6 leading-relaxed">
            We use cookies to improve your experience and analyze our traffic. By clicking "Accept All", you consent to our use of cookies. Read our <Link href="/privacy" className="underline hover:text-neutral-900">Privacy Policy</Link>.
          </p>
          
          <div className="flex gap-3">
            <button
              onClick={acceptCookies}
              className="flex-1 bg-neutral-900 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-neutral-800 transition-colors"
            >
              Accept All
            </button>
            <button
              onClick={declineCookies}
              className="flex-1 bg-neutral-100 text-neutral-900 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-neutral-200 transition-colors"
            >
              Decline
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
