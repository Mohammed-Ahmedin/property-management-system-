"use client";

import { useState, useEffect } from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"; // adjust path if needed
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface ImageSliderProps {
  images: { url: string; alt?: string }[];
  heightClass?: string; // e.g. "h-[200px] sm:h-[350px]"
}

export const ImageSlider: React.FC<ImageSliderProps> = ({
  images,
  heightClass = "h-[240px] sm:h-[400px]",
}) => {
  const [api, setApi] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const autoplayPlugin = Autoplay({ delay: 15000, stopOnInteraction: false });

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      const idx = api.selectedScrollSnap();
      setCurrentIndex(idx);
    };

    api.on("select", onSelect);

    // cleanup
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <div
      className={`relative w-full ${heightClass} rounded-lg overflow-hidden`}
    >
      <Carousel
        setApi={setApi}
        plugins={[autoplayPlugin]}
        opts={{ loop: true, align: "center" }}
        className="w-full h-full"
      >
        <CarouselContent className="w-full h-full">
          {images.map((img, idx) => (
            <CarouselItem key={idx} className="w-full h-full">
              <img
                src={img.url}
                alt={img.alt || `slide-${idx}`}
                className="w-full h-full object-cover rounded-xl"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/30 text-white p-1 rounded-full hover:bg-black/50 transition" />
        <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/30 text-white p-1 rounded-full hover:bg-black/50 transition" />
      </Carousel>

      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => api?.scrollTo(idx)}
            className={`w-2 h-2 rounded-full transition-all ${
              idx === currentIndex ? "bg-white scale-125" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
