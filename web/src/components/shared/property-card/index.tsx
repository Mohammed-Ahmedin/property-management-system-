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
import { FaStar } from "react-icons/fa";

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

  // Star count derived from rating (1-5)
  const starCount = averageRating ? Math.round(averageRating) : 0;

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
          {distance && <p className="text-xs text-muted-foreground mb-2">{distance} km from you</p>}
        </div>
      </div>
    );
  }

  // Calculate avg price from rooms
  const roomPrices = (data.rooms || []).map(r => r.price).filter(p => p > 0);
  const avgPrice = roomPrices.length
    ? Math.round(roomPrices.reduce((a, b) => a + b, 0) / roomPrices.length)
    : null;
  const allImages = images?.length ? images : [];
  const mainImage = allImages[0];

  // Collect room images for thumbnails
  const roomImages = (data.rooms || [])
    .flatMap(r => r.images || [])
    .slice(0, 4);

  // Fill 4 thumbnail slots: prefer room images, fall back to more property images
  const thumbSources = [
    ...roomImages,
    ...allImages.slice(1),
  ].slice(0, 4);
  const thumbSlots = Array.from({ length: 4 }, (_, i) => thumbSources[i] || null);

  return (
    <div
      className="rounded-xl overflow-hidden border border-border bg-card hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row cursor-pointer"
      onClick={() => navigate(`/properties/${data.id}`)}
    >
      {/* ── Left: image block ── */}
      <div className="sm:w-[260px] w-full shrink-0 flex flex-col cursor-pointer" onClick={() => navigate(`/properties/${data.id}`)}>
        {/* Main image */}
        <div className="relative h-[180px] overflow-hidden bg-muted">
          {mainImage ? (
            <img
              src={mainImage.url}
              alt={name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground gap-2">
              <svg className="w-12 h-12 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9.75L12 3l9 6.75V21H3V9.75z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 21V12h6v9" />
              </svg>
              <span className="text-xs">No image</span>
            </div>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); setSaved((s) => !s); }}
            className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-white/80 hover:bg-white shadow"
            aria-label="Save"
          >
            <Heart className={cn("w-4 h-4", saved ? "fill-red-500 text-red-500" : "text-gray-600")} />
          </button>
        </div>

        {/* Thumbnail strip — always 4 slots */}
        <div className="flex bg-black gap-0.5">
          {thumbSlots.map((img, i) => (
            <div key={i} className="relative flex-1 h-[52px] overflow-hidden bg-gray-800">
              {img ? (
                <>
                  <img src={img.url} alt="" className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity" />
                  {i === 3 && allImages.length > 5 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <span className="text-white text-xs font-bold">See all</span>
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  {i === 3 ? (
                    <span className="text-white text-xs font-bold opacity-60">See all</span>
                  ) : (
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Middle: details ── */}
      <div className="flex-1 p-4 flex flex-col justify-between min-w-0 border-r border-border">
        <div>
          <h3 className="font-bold text-base md:text-lg line-clamp-1 text-primary hover:underline mb-1">{name}</h3>

          {/* Stars */}
          {starCount > 0 && (
            <div className="flex items-center gap-0.5 mb-1">
              {Array.from({ length: Math.min(starCount, 5) }).map((_, i) => (
                <FaStar key={i} className="w-3 h-3 text-yellow-400" />
              ))}
            </div>
          )}

          {/* Location */}
          <div className="flex items-center gap-1 text-xs text-primary mb-3">
            <MapPin className="w-3 h-3 shrink-0" />
            <span className="line-clamp-1">{address}</span>
            <span className="text-muted-foreground ml-1 cursor-pointer hover:underline">· View on map</span>
          </div>

          {/* Facility tags */}
          {facilities && facilities.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {facilities.slice(0, 5).map((f) => (
                <span key={f.id} className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded border border-border">
                  {f.name}
                </span>
              ))}
            </div>
          )}

          {/* Review quote */}
          {about?.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 italic">"{about.description}"</p>
          )}
        </div>
      </div>

      {/* ── Right: rating + price + CTA ── */}
      <div
        className="sm:w-[200px] shrink-0 p-4 flex flex-col items-end justify-between"
        onClick={() => navigate(`/properties/${data.id}`)}
      >
        <div className="text-right">
          {averageRating > 0 ? (
            <div className="flex items-center gap-2 justify-end">
              <div className="text-right">
                <p className="text-sm font-semibold">{ratingLabel}</p>
                <p className="text-xs text-muted-foreground">{reviewCount} reviews</p>
              </div>
              <div className="bg-primary text-white text-sm font-bold w-9 h-9 flex items-center justify-center rounded-lg shrink-0">
                {averageRating.toFixed(1)}
              </div>
            </div>
          ) : (
            <span className="text-xs text-muted-foreground">No reviews yet</span>
          )}
        </div>
        <div className="text-right mt-4">
          <p className="text-xs text-muted-foreground mb-0.5">Avg price per night</p>
          {avgPrice ? (
            <p className="text-lg font-bold text-red-500">ETB {avgPrice.toLocaleString()}</p>
          ) : (
            <p className="text-sm text-muted-foreground">Contact for price</p>
          )}
          <Button
            size="sm"
            className="mt-2 w-full text-xs font-bold"
            onClick={(e) => { e.stopPropagation(); navigate(`/properties/${data.id}`); }}
          >
            Check availability
          </Button>
        </div>
      </div>
    </div>
  );
}
