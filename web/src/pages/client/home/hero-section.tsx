"use client";

import FilterTab from "./_components/filter-tab";

const HeroSection = () => {
  return (
    <div className="c-px pt-4">
      <div className="w-full h-[400px] relative flex flex-col justify-center items-center">
        {/* Background Image */}
        <div className="w-full h-full absolute inset-0 rounded-2xl overflow-hidden">
          <img
            className="object-cover w-full h-full absolute inset-0 rounded-2xl overflow-hidden"
            src="https://images.unsplash.com/photo-1561501900-3701fa6a0864?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bHV4dXJ5JTIwaG90ZWx8ZW58MHx8MHx8fDA%3D&fm=jpg&q=60&w=3000"
            alt="Property background"
          />

          {/* Black overlay */}
          <div className="absolute inset-0 bg-black/50" />
        </div>

        {/* Hero text */}
        <div className="flex flex-col items-center justify-center text-center z-10 px-4 max-md:hidden">
          <h2 className="font-bold text-3xl md:text-4xl text-white mb-2">
            Find Your Perfect Stay, Anywhere
          </h2>
          <p className="text-white max-w-2xl text-sm md:text-base">
            Discover cozy properties across Ethiopia and beyond. Compare
            prices, explore unique stays, and book your ideal getaway in just a
            few clicks.
          </p>
        </div>

        {/* Filter Bar */}
        <FilterTab />
      </div>
    </div>
  );
};

export default HeroSection;
