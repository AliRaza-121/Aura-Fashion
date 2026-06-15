"use client";
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Search as SearchIcon, ArrowRight } from 'lucide-react';
import TopBar from '@/components/TopBar';
import Header from '@/components/Header';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      fetchResults();
    } else {
      setResults([]);
      setLoading(false);
    }
  }, [query]);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data);
      }
    } catch (error) {
      console.error('Failed to fetch search results', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <TopBar />
      <Header />
      <NavBar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="mb-12 text-center">
          <h1 className="text-3xl lg:text-4xl font-black uppercase tracking-tight text-gray-900 mb-4">
            Search Results
          </h1>
          {query && (
            <p className="text-sm text-gray-500">
              Showing {results.length} result{results.length !== 1 ? 's' : ''} for "<span className="font-bold text-black">{query}</span>"
            </p>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-gray-300" size={48} />
          </div>
        ) : !query ? (
          <div className="text-center py-20">
            <SearchIcon size={48} className="mx-auto text-gray-200 mb-4" />
            <p className="text-gray-500">Enter a keyword to search for products.</p>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-20">
            <SearchIcon size={48} className="mx-auto text-gray-200 mb-4" />
            <p className="text-gray-500 mb-6">No products found matching your search.</p>
            <Link href="/shop" className="inline-block bg-black text-white px-8 py-4 font-bold text-xs uppercase tracking-[0.2em] hover:bg-gray-800 transition-colors">
              Browse All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6 lg:gap-x-8">
            {results.map((product) => (
              <Link key={product._id} href={`/shop/${product._id}`} className="group cursor-pointer">
                <div className="aspect-[3/4] w-full bg-gray-100 overflow-hidden relative mb-4">
                  <img
                    src={product.images && product.images.length > 0 ? product.images[0] : ''}
                    alt={product.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 mix-blend-multiply"
                  />
                  {product.stock === 0 && (
                    <div className="absolute top-2 left-2 bg-black text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest">
                      Sold Out
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest">{product.category}</p>
                  <h3 className="text-sm font-bold text-gray-900 leading-snug group-hover:underline decoration-2 underline-offset-4">{product.title || product.name}</h3>
                  <p className="text-sm font-bold text-gray-900 mt-2">Rs {product.price?.toLocaleString()}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-gray-300" size={48} /></div>}>
      <SearchContent />
    </Suspense>
  );
}
