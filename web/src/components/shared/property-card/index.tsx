"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Heart, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { PropertyDataResponse } from "@/hooks/api/use-properties";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface PropertyCardProps {
  data: PropertyDataResponse;
  view?: "horizontal" | "vertical";
  distance?: number;
}

export function PropertyCard({ data, view = "horizontal", distance }: PropertyCardProps) {
  const { about, address, name, type, images, facilities, averageRating, reviewCount } = data;
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);

  const ratingLabel =
    !averageRating ? null
    : averageRating >= 4.5 ? "Exceptional"
    : averageRating >= 4 ? "Excellent"
    : averageRating >= 3.5 ? "Very Good"
    : "Good";

  const ImageCarousel = ({ height }: { height: string }) => (
    <div className={cn("relative w-full overflow-hidden", height)}>
      <Carousel className="w-full h-full">
        <CarouselContent className="w-full h-full">
          {(images?.length ? images : [{ url: "/placeholder.svg" }]).map((img, i) => (
            <CarouselItem key={i} className="w-full h-full">
              <img src={img.url || "/placeholder.svg"} alt={name} className="object-cover w-full h-full" />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 h-7 w-7 bg-white/80 hover:bg-white border-0 shadow" />
        <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 bg-white/80 hover:bg-white border-0 shadow" />
      </Carousel>
      {/* Save button */}
      <button
        onClick={(e) => { e.stopPropagation(); setSaved((s) => !s); }}
        className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white/80 hover:bg-white shadow transition-colors"
        aria-label="Save property"
      >
        <Heart className={cn("w-4 h-4", saved ? "fill-red-500 text-red-500" : "text-gray-600")} />
      </button>
      <div className="absolute top-3 left-3">
        <Badge className="text-xs font-medium">{type || "Property"}</Badge>
      </div>
    </div>
  );

  if (view === "vertical") {
    return (
      <div
        className="rounded-xl overflow-hidden border bg-card hover:shadow-lg transition-all duration-300 cursor-pointer group"
        onClick={() => navigate(`/properties/${data.id}`)}
      >
        <ImageCarousel height="h-52" />
        <div className="p-4">
          <h3 className="font-semibold text-base line-clamp-1 mb-1">{name}</h3>
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
            <MapPin className="w-3 h-3 shrink-0" />
            <span className="line-clamp-1">{address}</span>
          </div>
          {averageRating > 0 && (
            <div className="flex items-center gap-1.5 mb-2">
              <span className="bg-primary text-primary-foreground text-xs font-bold px-1.5 py-0.5 rounded">
                {averageRating.toFixed(1)}
              </span>
              <span className="text-xs font-medium">{ratingLabel}</span>
              <span className="text-xs text-muted-foreground">({reviewCount})</span>
            </div>
          )}
          {distance && (
            <p className="text-xs text-muted-foreground mb-2">{distance} km from you</p>
          )}
        </div>
      </div>
    );
  }

  // Horizontal layout — Agoda style
  return (
    <div className="rounded-xl overflow-hidden border bg-card hover:shadow-lg transition-all duration-300 flex flex-col sm:flex-row cursor-pointer group">
      {/* Left: main image + thumbnail strip */}
      <div className="sm:w-[260px] w-full shrink-0 flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="relative h-[180px] sm:h-[160px] overflow-hidden">
          <img
            src={images?.[0]?.url || "/placeholder.svg"}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <button
            onClick={(e) => { e.stopPropagation(); setSaved((s) => !s); }}
            className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-white/80 hover:bg-white shadow"
            aria-label="Save"
          >
            <Heart className={cn("w-4 h-4", saved ? "fill-red-500 text-red-500" : "text-gray-600")} />
          </button>
          <div className="absolute top-2 left-2">
            <Badge className="text-xs">{type || "Property"}</Badge>
          </div>
        </div>
        {/* Thumbnail strip */}
        {images && images.length > 1 && (
          <div className="flex gap-1 p-1 bg-black/5">
            {images.slice(1, 4).map((img, i) => (
              <div key={i} className="relative flex-1 h-14 overflow-hidden rounded">
                <img src={img.url} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
            {images.length > 4 && (
              <div className="relative flex-1 h-14 overflow-hidden rounded">
                <img src={images[4].url} alt="" className="w-full h-full object-cover opacity-60" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <span className="text-white text-xs font-bold">See all</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Middle: details */}
      <div className="flex-1 p-4 flex flex-col justify-between min-w-0" onClick={() => navigate(`/properties/${data.id}`)}>
        <div>
          <h3 className="font-bold text-lg line-clamp-1 mb-1 hover:text-primary transition-colors">{name}</h3>
          <div className="flex items-center gap-1 text-sm text-primary mb-2">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="line-clamp-1 text-xs">{address}</span>
          </div>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {facilities?.slice(0, 4).map((f) => (
              <span key={f.id} className="text-xs bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 px-2 py-0.5 rounded-full border border-blue-100 dark:border-blue-800">
                {f.name}
              </span>
            ))}
          </div>
          {about?.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 italic">
              "{about.description}"
            </p>
          )}
        </div>
      </div>

      {/* Right: rating + price + CTA */}
      <div className="sm:w-[180px] shrink-0 p-4 flex flex-col items-end justify-between border-t sm:border-t-0 sm:border-l border-border" onClick={() => navigate(`/properties/${data.id}`)}>
        <div className="text-right">
          {averageRating > 0 ? (
            <>
              <p className="text-sm font-semibold text-right">{ratingLabel}</p>
              <p className="text-xs text-muted-foreground mb-1">{reviewCount} reviews</p>
              <span className="inline-block bg-primary text-primary-foreground text-sm font-bold px-2 py-1 rounded">
                {averageRating.toFixed(1)}
              </span>
            </>
          ) : (
            <span className="text-xs text-muted-foreground">No reviews yet</span>
          )}
        </div>
        <div className="text-right mt-3">
          <p className="text-xs text-muted-foreground mb-1">Avg price per night</p>
          <Button size="sm" className="w-full mt-2 text-xs font-bold">Check availability</Button>
        </div>
      </div>
    </div>
  );
}
