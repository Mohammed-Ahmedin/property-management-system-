"use client";

import { useState, useCallback } from "react";
import * as React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { StarIcon, X } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { PropertyFilters } from "@/types/property.types";
import CitySubcityFilter from "./city-filter";
import { FaStar } from "react-icons/fa";

interface PropertyFilterProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const FACILITIES = [
  "WiFi",
  "Kitchen",
  "Air Conditioning",
  "Heating",
  "Parking",
  "Washer",
  "Dryer",
  "TV",
  "Pool",
  "Gym",
];

export function PropertyFilter({
  isOpen,
  onOpenChange,
}: PropertyFilterProps) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState<PropertyFilters>({});

  // Sync filters from URL when dialog opens
  React.useEffect(() => {
    if (isOpen) {
      const f: any = {};
      searchParams.forEach((value, key) => {
        if (key === "facilityNames") { try { f[key] = JSON.parse(value); } catch { f[key] = []; } }
        else if (["minRating","maxRating","minPrice","maxPrice"].includes(key)) f[key] = Number(value);
        else if (key === "hasRoomsAvailable") f[key] = value === "true";
        else f[key] = value;
      });
      setFilters(f);
    }
  }, [isOpen]);

  const handleFilterChange = useCallback(
    (key: keyof PropertyFilters, value: any) => {
      setFilters((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    []
  );

  const handleClearFilters = () => {
    setFilters({});
    // Preserve only location/search params
    const p = new URLSearchParams();
    if (searchParams.get("city")) p.set("city", searchParams.get("city")!);
    if (searchParams.get("search")) p.set("search", searchParams.get("search")!);
    if (searchParams.get("type")) p.set("type", searchParams.get("type")!);
    navigate(`/properties?${p.toString()}`);
  };

  const handleSearch = () => {
    // Start from current URL params to preserve location/search
    const params = new URLSearchParams(searchParams);

    // Clear old filter params before applying new ones
    ["minPrice","maxPrice","minRating","maxRating","type","accessType","categoryId","facilityNames","hasRoomsAvailable","country","subcity"].forEach(k => params.delete(k));

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        if (Array.isArray(value)) {
          if (value.length > 0) params.set(key, JSON.stringify(value));
        } else if (typeof value === "number") {
          params.set(key, value.toString());
        } else if (typeof value === "boolean") {
          if (value) params.set(key, value.toString());
        } else {
          params.set(key, value as string);
        }
      }
    });

    navigate(`/properties?${params.toString()}`);
    onOpenChange(false);
  };

  // Helper to render stars
  const renderStars = (count: number) => {
    const stars = [];
    for (let i = 0; i < count; i++) {
      stars.push(
        <FaStar key={i} className="w-4 h-4 inline-block text-yellow-500" />
      );
    }
    return stars;
  };

  const renderStarsForValue = (value?: number) => {
  if (!value) return "0"; // default placeholder
  return renderStars(value);
};


  const filterContent = (
    <>
      {/* Search Input */}
      <div className="mt-1 space-y-2">
        <Label htmlFor="search" className="text-base font-medium">
          Search
        </Label>
        <Input
          id="search"
          placeholder="Search properties..."
          value={filters.search || ""}
          onChange={(e) => handleFilterChange("search", e.target.value)}
          className="w-full py-5"
        />
      </div>

      {/* Location Filters */}
      <div className="mt-1 space-y-2">
        <Label htmlFor="country" className="text-base font-medium">
          Country
        </Label>
        <Select
          value={filters.country || ""}
          onValueChange={(value) => handleFilterChange("country", value)}
        >
          <SelectTrigger id="country" className="w-full py-5">
            <SelectValue placeholder="Select country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ethiopia">Ethiopia</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <CitySubcityFilter
        filters={filters}
        handleFilterChange={handleFilterChange}
      />

      {/* Property Type */}
      <div className="mt-1 space-y-2">
        <Label htmlFor="accessType" className="text-base font-medium">
          Property Type
        </Label>
        <Select
          value={(filters as any).accessType || ""}
          onValueChange={(value) => {
            handleFilterChange("accessType" as any, value || undefined);
            // Clear specific type filter when access type is selected
            handleFilterChange("type", undefined);
          }}
        >
          <SelectTrigger id="accessType" className="w-full py-5">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="SHARED">Shared (Hotels, Resorts & more)</SelectItem>
            <SelectItem value="PRIVATE">Private (Villas & Guest Houses)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Category */}
      <div className="mt-1 space-y-2">
        <Label htmlFor="category" className="text-base font-medium">
          Category
        </Label>
        <Select
          value={filters.categoryId || ""}
          onValueChange={(value) => handleFilterChange("categoryId", value)}
        >
          <SelectTrigger id="category" className="w-full py-5">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="budget">Budget</SelectItem>
            <SelectItem value="standard">Standard</SelectItem>
            <SelectItem value="luxury">Luxury</SelectItem>
            <SelectItem value="premium">Premium</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Price Range */}
      <div className="mt-1 space-y-4">
        <Label className="text-base font-medium">Price Range</Label>
        <div className="flex gap-4">
          <div className="flex-1">
            <Label
              htmlFor="min-price"
              className="text-sm text-muted-foreground mb-2 block"
            >
              Min Price
            </Label>
            <Input
              id="min-price"
              type="number"
              placeholder="0"
              value={filters.minPrice || ""}
              onChange={(e) =>
                handleFilterChange(
                  "minPrice",
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
              className="w-full py-5"
            />
          </div>
          <div className="flex-1">
            <Label
              htmlFor="max-price"
              className="text-sm text-muted-foreground mb-2 block"
            >
              Max Price
            </Label>
            <Input
              id="max-price"
              type="number"
              placeholder="10000"
              value={filters.maxPrice || ""}
              onChange={(e) =>
                handleFilterChange(
                  "maxPrice",
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
              className="w-full py-5"
            />
          </div>
        </div>
      </div>

      {/* Rating Range */}
      <div className="mt-1 space-y-4">
        <Label className="text-base font-medium">Rating Range</Label>
        <div className="flex gap-4">
          <div className="flex-1">
            <Label
              htmlFor="min-rating"
              className="text-sm text-muted-foreground mb-2 block"
            >
              Min Rating
            </Label>
            <Select
              value={
                filters.minRating !== undefined
                  ? filters.minRating.toString()
                  : ""
              }
              onValueChange={(value) =>
                handleFilterChange(
                  "minRating",
                  value ? Number(value) : undefined
                )
              }
            >
              <SelectTrigger id="min-rating" className="w-full py-5">
                <SelectValue placeholder="0" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">{renderStars(1)}</SelectItem>
                <SelectItem value="2">{renderStars(2)}</SelectItem>
                <SelectItem value="3">{renderStars(3)}</SelectItem>
                <SelectItem value="4">{renderStars(4)}</SelectItem>
                <SelectItem value="5">{renderStars(5)}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <Label
              htmlFor="max-rating"
              className="text-sm text-muted-foreground mb-2 block"
            >
              Max Rating
            </Label>
            <Select
              value={
                filters.maxRating !== undefined
                  ? filters.maxRating.toString()
                  : ""
              }
              onValueChange={(value) =>
                handleFilterChange(
                  "maxRating",
                  value ? Number(value) : undefined
                )
              }
            >
              <SelectTrigger id="max-rating" className="w-full py-5">
                <SelectValue placeholder="5" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">{renderStars(1)}</SelectItem>
                <SelectItem value="2">{renderStars(2)}</SelectItem>
                <SelectItem value="3">{renderStars(3)}</SelectItem>
                <SelectItem value="4">{renderStars(4)}</SelectItem>
                <SelectItem value="5">{renderStars(5)}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Facilities */}
      <div className="mt-1 space-y-3">
        <Label className="text-base font-medium">Facilities</Label>
        <div className="space-y-2 grid grid-cols-3 ">
          {FACILITIES.map((facility) => (
            <div key={facility} className="flex items-center space-x-2">
              <Checkbox
                id={facility}
                checked={(filters.facilityNames || []).includes(facility)}
                onCheckedChange={(checked) => {
                  const current = filters.facilityNames || [];
                  const updated = checked
                    ? [...current, facility]
                    : current.filter((f) => f !== facility);
                  handleFilterChange(
                    "facilityNames",
                    updated.length > 0 ? updated : undefined
                  );
                }}
              />
              <Label
                htmlFor={facility}
                className="font-normal cursor-pointer text-sm"
              >
                {facility}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Availability Toggle */}
      <div className="mt-1 flex items-center justify-between py-2">
        <Label htmlFor="available" className="text-base font-medium">
          Available Only
        </Label>
        <Switch
          id="available"
          checked={filters.hasRoomsAvailable || false}
          onCheckedChange={(checked) =>
            handleFilterChange("hasRoomsAvailable", checked || undefined)
          }
        />
      </div>
    </>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent className="flex flex-col min-h-[90vh] max-h-[90vh]">
          <DrawerHeader className="flex  justify-between flex-row items-center">
            <DrawerTitle>Filter Properties</DrawerTitle>
            <button
              onClick={() => onOpenChange(false)}
              className="p-1"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </DrawerHeader>

          <div className="flex-1 overflow-y-scroll py-4 px-6 flex flex-col gap-4">
            {filterContent}
          </div>

          {/* Fixed Bottom Actions */}
          <div className="border-t p-4 bg-background space-y-2">
            <Button onClick={handleSearch} className="w-full py-6">
              Search
            </Button>
            <Button
              onClick={handleClearFilters}
              variant="outline"
              className="w-full bg-transparent py-6"
              size="lg"
            >
              Clear Filters
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col max-h-[90vh] w-[700px]">
        <DialogHeader>
          <DialogTitle>Filter Properties</DialogTitle>
          <DialogDescription>
            Refine your search with detailed filters
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-scroll">{filterContent}</div>

        {/* Fixed Bottom Actions */}
        <div className="border-t py-4  flex gap-3">
          <Button onClick={handleSearch} className="flex-1" size="lg">
            Search
          </Button>
          <Button
            onClick={handleClearFilters}
            variant="outline"
            className="flex-1 bg-transparent"
            size="lg"
          >
            Clear Filters
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
