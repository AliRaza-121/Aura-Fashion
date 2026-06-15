"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import { RefreshCcw, Home } from 'lucide-react';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error('Application Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-white">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="mx-auto w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-8">
          <span className="text-4xl">⚠️</span>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Something went wrong</h2>
          <p className="text-gray-500">
            We apologize for the inconvenience. An unexpected error has occurred on our end.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button 
            onClick={() => reset()}
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 bg-black text-white text-sm font-bold uppercase tracking-widest hover:bg-gray-900 transition-colors"
          >
            <RefreshCcw size={18} />
            Try Again
          </button>
          <Link 
            href="/"
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 bg-gray-50 text-black border border-gray-200 text-sm font-bold uppercase tracking-widest hover:bg-gray-100 transition-colors"
          >
            <Home size={18} />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
