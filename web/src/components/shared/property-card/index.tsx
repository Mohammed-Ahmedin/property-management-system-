"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { PropertyDataResponse } from "@/hooks/api/use-properties";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { FaStar } from "react-icons/fa";

interface PropertyCardProps {
  data: PropertyDataResponse;
  view?: "horizontal" | "vertical"; // 🔥 Switch between two card styles
  distance?: number;
}

export function PropertyCard({
  data,
  view = "horizontal",
  distance,
}: PropertyCardProps) {
  const {
    about,
    address,
    name,
    type,
    images,
    facilities,
    averageRating,
    reviewCount,
  } = data;
  const navigate = useNavigate();

  if (view === "vertical") {
    // 🔹 VERTICAL LAYOUT — image carousel on top
    return (
      <Card className="py-0  px-0 flex flex-col overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer">
        {/* Image Carousel */}
        <div className="relative w-full h-56 sm:h-64 overflow-hidden px-0 ">
          <Carousel className="w-full h-full px-0 ">
            <CarouselContent className="w-full h-full px-0 ">
              {(images?.length ? images : [{ url: "/placeholder.svg" }]).map(
                (img, i) => (
                  <CarouselItem key={i} className="w-full h-full px-0 ">
                    <img
                      src={img.url || "/placeholder.svg"}
                      alt={name}
                      className="object-cover w-full h-full transition-transform duration-500 scale-105"
                    />
                  </CarouselItem>
                )
              )}
            </CarouselContent>
            <CarouselPrevious className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white" />
            <CarouselNext className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white" />
          </Carousel>

          <div className="absolute top-3 left-3 flex gap-2 items-center h-fit">
            <Badge>{type || "Property"}</Badge>
          </div>
        </div>

        {/* Content */}
        <div
          className="pt-3 p-5 flex flex-col justify-between"
          onClick={() => navigate(`/properties/${data.id}`)}
        >
          <div>
            <h3 className="font-bold text-lg text-foreground mb-1 line-clamp-1">
              {name}
            </h3>

            <div className="flex items-center gap-1 mb-3 text-sm text-muted-foreground">
              <MapPin className="size-4 shrink-0" />
              <span className="line-clamp-1">{address}</span>
            </div>

            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {about?.description ||
                "A cozy property offering a warm Ethiopian experience."}
            </p>

            {distance && (
              <Badge className="" variant={"secondary"}>
                <MapPin />
                <span>{distance} km from you</span>
              </Badge>
            )}

            {/* <div className="flex items-center gap-1 mb-3">
              <Star className="size-4 text-yellow-500" />
              <span className="font-semibold text-foreground">
                {(Math.random() * (5 - 3.5) + 3.5).toFixed(1)}
              </span>
            </div> */}

            {/* 
            <div className="flex flex-wrap gap-2">
              {facilities?.length ? (
                facilities.slice(0, 4).map((f) => (
                  <Badge key={f.id} variant="outline" className="text-xs">
                    {f.name}
                  </Badge>
                ))
              ) : (
                <Badge variant="outline" className="text-xs">
                  Free Wi-Fi
                </Badge>
              )}
            </div> */}
          </div>

          <div className="mt-5">
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              View Details
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  // 🔸 HORIZONTAL LAYOUT (default)
  return (
    <Card className="py-0 flex flex-col sm:flex-row md:h-[280px] overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer">
      {/* Image Carousel */}
      <div className="sm:w-2/5 w-full relative">
        <Carousel className="w-full min-h-full max-h-full">
          <CarouselContent className="w-full h-full">
            {(images?.length ? images : [{ url: "/placeholder.svg" }]).map(
              (img, i) => (
                <CarouselItem key={i} className="w-full h-full">
                  <img
                    src={img.url || "/placeholder.svg"}
                    alt={name}
                    className="object-cover max-md:h-[210px] w-full h-full sm:h-full transition-transform duration-500 scale-105"
                  />
                </CarouselItem>
              )
            )}
          </CarouselContent>
          <CarouselPrevious className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white" />
          <CarouselNext className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white" />
        </Carousel>

        <div className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full font-medium">
          {type || "Property"}
        </div>
      </div>

      {/* Content */}
      <div
        className="sm:w-3/5 w-full  pt-0 p-5 flex flex-col justify-between"
        onClick={() => navigate(`/properties/${data.id}`)}
      >
        <div>
          <h3 className="font-bold text-lg text-foreground mb-1 line-clamp-1">
            {name}
          </h3>

          <div className="flex items-center gap-1 mb-3 text-sm text-muted-foreground">
            <MapPin className="size-4 shrink-0" />
            <span className="line-clamp-1">{address}</span>
          </div>

          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {about?.description ||
              "A cozy property offering a warm Ethiopian experience."}
          </p>

          <div className="flex items-center gap-1 mb-3">
            <FaStar className="size-4 text-yellow-500" />
            <span className="font-semibold text-foreground">
              {averageRating}-({reviewCount} reviews)
            </span>
          </div>

          {distance && (
            <Badge className="" variant={"secondary"}>
              <MapPin />
              <span>{distance} km from you</span>
            </Badge>
          )}

          <div className="flex flex-wrap gap-2">
            {facilities?.length ? (
              facilities.slice(0, 4).map((f) => (
                <Badge key={f.id} variant="outline" className="text-xs">
                  {f.name}
                </Badge>
              ))
            ) : (
              <Badge variant="outline" className="text-xs">
                Free Wi-Fi
              </Badge>
            )}
          </div>
        </div>

        <div className="mt-5">
          <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
            View Details
          </Button>
        </div>
      </div>
    </Card>
  );
}
