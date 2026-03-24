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

  const lowestPrice = data.rooms?.length
    ? Math.min(...data.rooms.map((r: any) => r.price ?? Infinity))
    : null;

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
          {lowestPrice && (
            <p className="text-sm font-semibold mt-2">
              From <span className="text-primary">ETB {lowestPrice.toLocaleString()}</span>
              <span className="text-xs text-muted-foreground font-normal"> /night</span>
            </p>
          )}
        </div>
      </div>
    );
  }

  // Horizontal layout (listing page)
  return (
    <div className="rounded-xl overflow-hidden border bg-card hover:shadow-lg transition-all duration-300 flex flex-col sm:flex-row sm:h-[240px] cursor-pointer group">
      <div className="sm:w-[280px] w-full shrink-0" onClick={(e) => e.stopPropagation()}>
        <ImageCarousel height="h-[200px] sm:h-full" />
      </div>

      <div className="flex-1 p-4 flex flex-col justify-between" onClick={() => navigate(`/properties/${data.id}`)}>
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-bold text-lg line-clamp-1">{name}</h3>
            {lowestPrice && (
              <div className="text-right shrink-0">
                <p className="text-xs text-muted-foreground">From</p>
                <p className="font-bold text-primary text-base">ETB {lowestPrice.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">/night</p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="line-clamp-1">{address}</span>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {about?.description || "A cozy property offering a warm Ethiopian experience."}
          </p>

          <div className="flex flex-wrap gap-1.5 mb-3">
            {facilities?.slice(0, 4).map((f) => (
              <span key={f.id} className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                {f.name}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          {averageRating > 0 ? (
            <div className="flex items-center gap-2">
              <span className="bg-primary text-primary-foreground text-sm font-bold px-2 py-0.5 rounded">
                {averageRating.toFixed(1)}
              </span>
              <div>
                <p className="text-sm font-semibold leading-none">{ratingLabel}</p>
                <p className="text-xs text-muted-foreground">{reviewCount} reviews</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-muted-foreground text-sm">
              <Star className="w-4 h-4" />
              <span>No reviews yet</span>
            </div>
          )}
          {distance && (
            <Badge variant="secondary" className="text-xs">
              <MapPin className="w-3 h-3 mr-1" />{distance} km
            </Badge>
          )}
          <Button size="sm" className="ml-auto">View Details</Button>
        </div>
      </div>
    </div>
  );
}
