"use client";

import FilterTab from "./_components/filter-tab";
import { Wifi, Car, UtensilsCrossed, Dumbbell, Waves, Shield } from "lucide-react";

const features = [
  { icon: Wifi, label: "Free WiFi" },
  { icon: Car, label: "Airport Transfer" },
  { icon: UtensilsCrossed, label: "Breakfast" },
  { icon: Dumbbell, label: "Gym Access" },
  { icon: Waves, label: "Pool" },
  { icon: Shield, label: "Free Cancellation" },
];

const HeroSection = () => {
  return (
    <div className="c-px pt-4">
      <div className="w-full min-h-[480px] relative flex flex-col justify-center items-center pb-16">
        {/* Background Image */}
        <div className="w-full h-full absolute inset-0 rounded-2xl overflow-hidden">
          <img
            className="object-cover w-full h-full absolute inset-0"
            src="https://images.unsplash.com/photo-1561501900-3701fa6a0864?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bHV4dXJ5JTIwaG90ZWx8ZW58MHx8MHx8fDA%3D&fm=jpg&q=60&w=3000"
            alt="Property background"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        </div>

        {/* Hero text */}
        <div className="flex flex-col items-center justify-center text-center z-10 px-4 mb-6">
          <p className="text-primary-foreground/80 text-sm font-medium uppercase tracking-widest mb-3">
            Discover Your Perfect Stay
          </p>
          <h1 className="font-bold text-3xl md:text-5xl text-white mb-3 leading-tight">
            Find Hotels, Guesthouses &<br className="hidden md:block" /> Resorts Across Ethiopia
          </h1>
          <p className="text-white/80 max-w-xl text-sm md:text-base">
            Compare prices, explore unique stays, and book your ideal getaway in just a few clicks.
          </p>
        </div>

        {/* Filter Bar */}
        <FilterTab />

        {/* Feature pills */}
        <div className="absolute bottom-4 z-10 flex flex-wrap justify-center gap-2 px-4 max-md:hidden">
          {features.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm border border-white/20 text-white text-xs px-3 py-1.5 rounded-full"
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
