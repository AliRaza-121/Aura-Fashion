import TopBar from '@/components/TopBar';
import Header from '@/components/Header';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <TopBar />
      <Header />
      <NavBar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 w-full flex-grow animate-pulse">
        {/* Back Button Skeleton */}
        <div className="h-4 w-20 bg-gray-200 rounded mb-8"></div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          
          {/* Images Skeleton */}
          <div className="flex flex-col-reverse lg:flex-row gap-4">
            <div className="flex flex-row lg:flex-col gap-3 w-full lg:w-24">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-20 h-24 lg:w-24 lg:h-32 bg-gray-200 rounded-sm"></div>
              ))}
            </div>
            <div className="w-full lg:flex-grow aspect-[3/4] bg-gray-200 rounded-sm"></div>
          </div>

          {/* Details Skeleton */}
          <div className="flex flex-col pt-4 space-y-6">
            <div className="h-6 w-32 bg-gray-200 rounded"></div>
            <div className="h-8 w-3/4 bg-gray-200 rounded"></div>
            <div className="h-8 w-1/4 bg-gray-200 rounded mb-6"></div>
            
            <div className="border-b border-gray-100 w-full"></div>
            
            <div className="h-4 w-40 bg-gray-200 rounded mt-6"></div>
            <div className="flex space-x-3 mt-2">
              <div className="h-6 w-6 rounded-full bg-gray-200"></div>
              <div className="h-6 w-6 rounded-full bg-gray-200"></div>
            </div>

            <div className="h-4 w-24 bg-gray-200 rounded mt-6"></div>
            <div className="flex space-x-3 mt-2">
              <div className="h-8 w-16 bg-gray-200 rounded"></div>
              <div className="h-8 w-16 bg-gray-200 rounded"></div>
              <div className="h-8 w-16 bg-gray-200 rounded"></div>
            </div>

            <div className="flex gap-3 mt-8">
              <div className="h-12 w-32 bg-gray-200 rounded"></div>
              <div className="h-12 flex-1 bg-gray-200 rounded"></div>
            </div>
            <div className="h-12 w-full bg-gray-200 rounded mt-2"></div>
          </div>

        </div>
      </div>
      
      <Footer />
    </div>
  );
}
