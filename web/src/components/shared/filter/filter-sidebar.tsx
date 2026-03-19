"use client";

import { useState, useCallback } from "react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { RotateCcw } from "lucide-react";
import { FaStar } from "react-icons/fa";
import type { PropertyFilters } from "@/types/property.types";
import CitySubcityFilter from "./city-filter";
import { useNavigate } from "react-router-dom";

interface FilterSidebarProps {
  onSearch: (filters: PropertyFilters) => void;
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

export function FilterSidebar() {
  const [filters, setFilters] = useState<PropertyFilters>({});
  const navigate = useNavigate();

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
    navigate("/properties");
  };

  const handleSearch = () => {
    const params = new URLSearchParams();

    // Add filters to search params
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        if (Array.isArray(value)) {
          params.append(key, JSON.stringify(value));
        } else if (typeof value === "number") {
          params.append(key, value.toString());
        } else if (typeof value === "boolean") {
          params.append(key, value.toString());
        } else {
          params.append(key, value);
        }
      }
    });

    navigate(`/properties?${params.toString()}`);
  };

  // const handleSearch = (filters: PropertyFilters) => {

  //   if (filters.search) {
  //     results = results.filter((house) =>
  //       house.name.toLowerCase().includes(filters.search.toLowerCase())
  //     );
  //   }

  //   if (filters.city) {
  //     results = results.filter((house) => house.city === filters.city);
  //   }

  //   if (filters.subcity) {
  //     results = results.filter((house) => house.subcity === filters.subcity);
  //   }

  //   if (filters.minPrice) {
  //     results = results.filter((house) => house.price >= filters.minPrice);
  //   }

  //   if (filters.maxPrice) {
  //     results = results.filter((house) => house.price <= filters.maxPrice);
  //   }

  //   if (filters.minRating) {
  //     results = results.filter((house) => house.rating >= filters.minRating);
  //   }

  //   if (filters.maxRating) {
  //     results = results.filter((house) => house.rating <= filters.maxRating);
  //   }

  //   if (filters.facilityNames && filters.facilityNames.length > 0) {
  //     results = results.filter((house) =>
  //       filters.facilityNames!.some((facility) =>
  //         house.facilities.includes(facility)
  //       )
  //     );
  //   }

  //   setFilteredProperties(results);
  // };

  const renderStars = (count: number) => {
    const stars = [];
    for (let i = 0; i < count; i++) {
      stars.push(
        <FaStar key={i} className="w-3 h-3 inline-block text-yellow-500" />
      );
    }
    return stars;
  };

  return (
    <div className="hidden lg:flex flex-col h-full bg-card border-r border-border w-[450px]">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <h2 className="text-xl font-bold text-foreground">Filters</h2>
      </div>

      {/* Scrollable Content */}
      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          {/* Search Input */}
          <div className="space-y-2">
            <Label htmlFor="search" className="text-sm font-medium">
              Search
            </Label>
            <Input
              id="search"
              placeholder="Search properties..."
              value={filters.search || ""}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="w-full py-2 text-sm"
            />
          </div>

          {/* Country */}
          <div className="space-y-2">
            <Label htmlFor="country" className="text-sm font-medium">
              Country
            </Label>
            <Select
              value={filters.country || ""}
              onValueChange={(value) => handleFilterChange("country", value)}
            >
              <SelectTrigger id="country" className="w-full py-2 text-sm">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ethiopia">Ethiopia</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* City & Sub-city */}
          <div className="space-y-3">
            <CitySubcityFilter
              filters={filters}
              handleFilterChange={handleFilterChange}
            />
          </div>

          {/* Property Type */}
          <div className="space-y-2">
            <Label htmlFor="type" className="text-sm font-medium">
              Property Type
            </Label>
            <Select
              value={filters.type || ""}
              onValueChange={(value) => handleFilterChange("type", value)}
            >
              <SelectTrigger id="type" className="w-full py-2 text-sm">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="shared">Shared</SelectItem>
                <SelectItem value="private">Private</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-medium">
              Category
            </Label>
            <Select
              value={filters.categoryId || ""}
              onValueChange={(value) => handleFilterChange("categoryId", value)}
            >
              <SelectTrigger id="category" className="w-full py-2 text-sm">
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
          <div className="space-y-3">
            <Label className="text-sm font-medium">Price Range</Label>
            <div className="flex gap-2">
              <div className="flex-1">
                <Label
                  htmlFor="min-price"
                  className="text-xs text-muted-foreground mb-1 block"
                >
                  Min
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
                  className="w-full py-2 text-sm"
                />
              </div>
              <div className="flex-1">
                <Label
                  htmlFor="max-price"
                  className="text-xs text-muted-foreground mb-1 block"
                >
                  Max
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
                  className="w-full py-2 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Rating Range */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Rating Range</Label>
            <div className="flex gap-2">
              <div className="flex-1">
                <Label
                  htmlFor="min-rating"
                  className="text-xs text-muted-foreground mb-1 block"
                >
                  Min
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
                  <SelectTrigger
                    id="min-rating"
                    className="w-full py-2 text-sm"
                  >
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
                  className="text-xs text-muted-foreground mb-1 block"
                >
                  Max
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
                  <SelectTrigger
                    id="max-rating"
                    className="w-full py-2 text-sm"
                  >
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
          <div className="space-y-3">
            <Label className="text-sm font-medium">Facilities</Label>
            <div className="space-y-2 grid grid-cols-3">
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
          <div className="flex items-center justify-between py-2 border-t border-border">
            <Label htmlFor="available" className="text-sm font-medium">
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
        </div>
      </ScrollArea>

      {/* Fixed Bottom Actions */}
      <div className="border-t border-border p-6 bg-background space-y-2">
        <Button onClick={handleSearch} className="w-full" size="lg">
          Search
        </Button>
        <Button
          onClick={handleClearFilters}
          variant="outline"
          className="w-full bg-transparent"
          size="lg"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Clear Filters
        </Button>
      </div>
    </div>
  );
}
