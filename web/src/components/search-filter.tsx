"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

export function SearchFilter() {
  // const router = useRouter()
  const searchParams = {
    get: (data: any) => {
      return "";
    },
  };
  const navigate = useNavigate();

  const [city, setCity] = useState(searchParams.get("city") || "");
  const [checkIn, setCheckIn] = useState(searchParams.get("checkIn") || "");
  const [checkOut, setCheckOut] = useState(searchParams.get("checkOut") || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    navigate(`/properties?${params.toString()}`);
  };

  const handleClear = () => {
    setCity("");
    setCheckIn("");
    setCheckOut("");
    navigate("/properties");
  };

  return (
    <div className="border bg-white dark:bg-card rounded-xl shadow-lg p-6 sm:p-8 -mt-12 sm:-mt-16 relative z-10 mx-4 sm:mx-8">
      <form
        onSubmit={handleSearch}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end"
      >
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            City
          </label>
          <Input
            type="text"
            placeholder="Where to stay?"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Check-in
          </label>
          <Input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Check-out
          </label>
          <Input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="flex gap-2">
          <Button
            type="submit"
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            🔍 Search
          </Button>
          {(city || checkIn || checkOut) && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleClear}
              className="text-muted-foreground hover:text-foreground bg-transparent"
            >
              ✕
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
