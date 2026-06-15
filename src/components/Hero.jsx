import Link from 'next/link';
import Image from 'next/image';

export default function Hero({ data }) {
  const heroData = data || {
    heading: "NEW POCKET LONG SLEEVE SHIRT",
    subheading: "AURA MENS",
    buttonText: "SHOP MENS",
    buttonLink: "/shop?category=mens",
    image: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?q=80&w=1920&auto=format&fit=crop"
  };

  return (
    <div className="relative w-full h-[500px] md:h-[650px] bg-[#f8f9fa] flex flex-col md:flex-row items-center overflow-hidden">
      
      {/* Model Image */}
      <div className="absolute inset-0 md:left-0 md:bottom-0 h-full w-full md:w-[55%] z-10 flex items-end justify-center">
        <Image 
          src={heroData.image} 
          alt="Campaign" 
          fill
          priority
          sizes="(max-width: 768px) 100vw, 55vw"
          placeholder="blur"
          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2U4ZThlOCIvPjwvc3ZnPg=="
          className="object-cover object-top mix-blend-multiply"
        />
      </div>

      {/* Background abstract element - hidden on mobile */}
      <div className="hidden md:block absolute right-0 top-0 w-[60%] h-full bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none"></div>

      {/* Mobile Dark Overlay */}
      <div className="absolute inset-0 bg-black/40 md:hidden z-15 pointer-events-none"></div>

      {/* Hero Content */}
      <div className="relative z-20 flex w-full max-w-[1400px] mx-auto px-6 md:px-12 h-full items-center justify-center md:justify-end text-center md:text-left">
        <div className="hidden md:block w-[55%]"></div> {/* Spacer for image on desktop */}
        <div className="w-full md:w-[45%] md:pl-8 flex flex-col items-center md:items-start justify-center p-8 md:p-0">
          <p className="text-gray-200 md:text-gray-600 text-sm md:text-[15px] mb-4 font-black md:font-medium tracking-[0.3em] uppercase">{heroData.subheading}</p>
          <h2 className="text-4xl sm:text-5xl md:text-[64px] font-black text-white md:text-black leading-[1.1] mb-8 md:mb-10 tracking-tight uppercase drop-shadow-md md:drop-shadow-none">
            {heroData.heading}
          </h2>
          <Link href={heroData.buttonLink} className="bg-white text-black md:bg-black md:text-white px-10 py-4 text-[13px] font-bold tracking-widest w-fit uppercase border border-transparent md:border-black">
            {heroData.buttonText}
          </Link>
        </div>
      </div>
    </div>
  );
}
