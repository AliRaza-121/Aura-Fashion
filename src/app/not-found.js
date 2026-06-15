import Link from 'next/link';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-white">
      <div className="max-w-md w-full text-center space-y-8">
        <h1 className="text-9xl font-black text-gray-100 tracking-tighter">404</h1>
        
        <div className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Page not found</h2>
          <p className="text-gray-500">
            We couldn't find the page you're looking for. It might have been moved, deleted, or perhaps never existed.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link 
            href="/"
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 bg-black text-white text-sm font-bold uppercase tracking-widest hover:bg-gray-900 transition-colors"
          >
            <Home size={18} />
            Back to Home
          </Link>
          <Link 
            href="/shop"
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 bg-gray-50 text-black border border-gray-200 text-sm font-bold uppercase tracking-widest hover:bg-gray-100 transition-colors"
          >
            <Search size={18} />
            Browse Shop
          </Link>
        </div>
      </div>
    </div>
  );
}
