import TopBar from '@/components/TopBar';
import Header from '@/components/Header';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

export default function GlobalLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-black font-sans">
      <TopBar />
      <Header />
      <NavBar />

      <div className="flex-grow flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 border-2 border-gray-200 border-t-black rounded-full animate-spin"></div>
          <div className="mt-4 text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400">Loading Aura...</div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
