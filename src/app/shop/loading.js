import TopBar from '@/components/TopBar';
import Header from '@/components/Header';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import SkeletonLoader from '@/components/SkeletonLoader';

export default function ShopLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-black font-sans">
      <TopBar />
      <Header />
      <NavBar />

      <div className="pt-10 pb-6 text-center bg-white">
        <div className="h-10 w-64 bg-gray-200 rounded mx-auto mb-2 animate-pulse"></div>
        <div className="h-4 w-48 bg-gray-200 rounded mx-auto animate-pulse"></div>
      </div>

      <div className="flex-grow max-w-[1400px] mx-auto w-full px-8 pb-24 flex flex-col md:flex-row gap-8 md:gap-16">
        
        {/* Left Sidebar Skeleton */}
        <aside className="w-full md:w-52 flex-shrink-0">
          <div className="space-y-8">
            <div className="flex justify-between mb-8 pb-4 border-b border-gray-200">
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
            </div>
            
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="pt-4 border-t border-gray-100">
                <div className="flex justify-between mb-4">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Right Side Products Grid Skeleton */}
        <div className="flex-grow w-full">
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100 py-4 md:py-0">
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse hidden md:block"></div>
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>

          <div className="py-2">
            <SkeletonLoader count={8} />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
