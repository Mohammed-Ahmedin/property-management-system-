"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, RotateCcw } from "lucide-react";
import { FaStar } from "react-icons/fa";
import type { PropertyFilters } from "@/types/property.types";
import CitySubcityFilter from "./city-filter";
import { useNavigate, useSearchParams } from "react-router-dom";

const FACILITIES = ["WiFi", "Kitchen", "Air Conditioning", "Heating", "Parking", "Washer", "Dryer", "TV", "Pool", "Gym", "Breakfast", "Airport Transfer"];
const PROPERTY_TYPES = ["Shared", "Private", "Entire"];
const STAR_RATINGS = [5, 4, 3, 2, 1];
const REVIEW_SCORES = [
  { label: "Exceptional 9+", min: 9 },
  { label: "Very good 8+", min: 8 },
  { label: "Good 7+", min: 7 },
  { label: "Pleasant 6+", min: 6 },
];

function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="py-4 border-b border-border last:border-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between w-full text-sm font-semibold text-foreground"
      >
        {title}
        {open ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
}

export function FilterSidebar() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Read current filters from URL
  const getFilters = (): PropertyFilters => {
    const f: any = {};
    searchParams.forEach((value, key) => {
      if (key === "facilityNames") { try { f[key] = JSON.parse(value); } catch { f[key] = []; } }
      else if (["minRating","maxRating","minPrice","maxPrice"].includes(key)) f[key] = Number(value);
      else if (key === "hasRoomsAvailable") f[key] = value === "true";
      else f[key] = value;
    });
    return f;
  };

  // Apply a filter change immediately to URL
  const applyFilter = (key: keyof PropertyFilters, value: any) => {
    const p = new URLSearchParams(searchParams);
    // preserve location param
    if (value === undefined || value === null || value === "") {
      p.delete(key);
    } else if (Array.isArray(value)) {
      if (value.length === 0) p.delete(key);
      else p.set(key, JSON.stringify(value));
    } else {
      p.set(key, String(value));
    }
    navigate(`/properties?${p.toString()}`);
  };

  const filters = getFilters();

  const [minPrice, setMinPrice] = useState(filters.minPrice?.toString() || "");
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice?.toString() || "");

  return (
    <div className="hidden lg:flex flex-col bg-background border border-border rounded-xl w-[260px] shrink-0 sticky top-4 self-start max-h-[calc(100vh-5rem)] z-10">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border flex items-center justify-between shrink-0">
        <span className="text-sm font-bold">Filters</span>
        <button
          onClick={() => {
            const p = new URLSearchParams();
            if (searchParams.get("location")) p.set("location", searchParams.get("location")!);
            navigate(`/properties?${p.toString()}`);
          }}
          className="text-xs text-primary hover:underline flex items-center gap-1"
        >
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4">
        <div className="py-1">

          {/* Star rating */}
          <Section title="Star rating">
            <div className="space-y-2">
              {STAR_RATINGS.map((r) => {
                // Convert star count to rating score (5 stars = 9+, 4 stars = 7+, etc.)
                const ratingScore = r * 2 - 1; // 5→9, 4→7, 3→5, 2→3, 1→1
                return (
                  <label key={r} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={Number(searchParams.get("minRating")) === ratingScore}
                      onCheckedChange={(checked) => applyFilter("minRating", checked ? ratingScore : undefined)}
                    />
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: r }).map((_, i) => (
                        <FaStar key={i} className="w-3.5 h-3.5 text-yellow-400" />
                      ))}
                      {r < 5 && <span className="text-xs text-muted-foreground ml-1">& up</span>}
                    </div>
                  </label>
                );
              })}
            </div>
          </Section>

          {/* Review score */}
          <Section title="Review score">
            <div className="space-y-2">
              {REVIEW_SCORES.map((s) => (
                <label key={s.min} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={Number(searchParams.get("minRating")) === s.min}
                    onCheckedChange={(checked) => applyFilter("minRating", checked ? s.min : undefined)}
                  />
                  <span className="text-sm">{s.label}</span>
                </label>
              ))}
            </div>
          </Section>

          {/* Property type */}
          <Section title="Property type">
            <div className="space-y-2">
              {PROPERTY_TYPES.map((t) => (
                <label key={t} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={searchParams.get("type") === t.toLowerCase()}
                    onCheckedChange={(checked) => applyFilter("type", checked ? t.toLowerCase() : undefined)}
                  />
                  <span className="text-sm">{t}</span>
                </label>
              ))}
            </div>
          </Section>

          {/* Facilities */}
          <Section title="Facilities">
            <div className="space-y-2">
              {FACILITIES.map((f) => {
                const current: string[] = filters.facilityNames || [];
                return (
                  <label key={f} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={current.includes(f)}
                      onCheckedChange={(checked) => {
                        const upd = checked ? [...current, f] : current.filter((x) => x !== f);
                        applyFilter("facilityNames", upd.length > 0 ? upd : undefined);
                      }}
                    />
                    <span className="text-sm">{f}</span>
                  </label>
                );
              })}
            </div>
          </Section>

          {/* Price */}
          <Section title="Price per night (ETB)" defaultOpen={false}>
            <div className="flex gap-2 items-center">
              <Input
                type="number" placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                onBlur={() => applyFilter("minPrice", minPrice ? Number(minPrice) : undefined)}
                className="text-sm"
              />
              <span className="text-muted-foreground">–</span>
              <Input
                type="number" placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                onBlur={() => applyFilter("maxPrice", maxPrice ? Number(maxPrice) : undefined)}
                className="text-sm"
              />
            </div>
          </Section>

          {/* Location */}
          <Section title="Location" defaultOpen={false}>
            <CitySubcityFilter
              filters={filters}
              handleFilterChange={(key: keyof PropertyFilters, value: any) => applyFilter(key, value)}
            />
          </Section>

          {/* Availability */}
          <Section title="Availability" defaultOpen={false}>
            <div className="flex items-center justify-between">
              <span className="text-sm">Available rooms only</span>
              <Switch
                checked={searchParams.get("hasRoomsAvailable") === "true"}
                onCheckedChange={(v) => applyFilter("hasRoomsAvailable", v || undefined)}
              />
            </div>
          </Section>

        </div>
      </div>
    </div>
  );
}
