"use client";

import FilterTab from "./_components/filter-tab";

const HeroSection = () => {
  return (
    <div className="w-full relative flex flex-col items-center justify-center min-h-[480px] md:min-h-[520px]">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          className="object-cover w-full h-full"
          src="https://images.unsplash.com/photo-1561501900-3701fa6a0864?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bHV4dXJ5JTIwaG90ZWx8ZW58MHx8MHx8fDA%3D&fm=jpg&q=60&w=3000"
          alt="Property background"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Hero text */}
      <div className="relative z-10 text-center px-4 mb-6">
        <h1 className="font-bold text-3xl md:text-4xl text-white mb-2 drop-shadow">
          Find Your Perfect Stay, Anywhere
        </h1>
        <p className="text-white/80 text-sm md:text-base max-w-lg mx-auto">
          Discover cozy properties across Ethiopia. Compare prices and book in just a few clicks.
        </p>
      </div>

      {/* Search card — gentle left-to-right float */}
      <style>{`
        @keyframes float-lr {
          0%   { transform: translateX(-6px); }
          50%  { transform: translateX(6px); }
          100% { transform: translateX(-6px); }
        }
        .search-float {
          animation: float-lr 4s ease-in-out infinite;
        }
        .search-float:hover, .search-float:focus-within {
          animation-play-state: paused;
        }
      `}</style>
      <div className="relative z-10 w-[95%] md:w-[780px] lg:w-[860px] search-float">
        <FilterTab />
      </div>
    </div>
  );
};

export default HeroSection;
