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
const PROPERTY_TYPES = ["Shared", "Private"];
const STAR_RATINGS = [5, 4, 3, 2, 1];
const REVIEW_SCORES = [
  { label: "Excellent (5)", min: 5, max: 5 },
  { label: "Very Good (4+)", min: 4, max: undefined },
  { label: "Good (3+)", min: 3, max: undefined },
  { label: "Fair (2+)", min: 2, max: undefined },
  { label: "Poor (1+)", min: 1, max: undefined },
];

function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const key = `section-open-${title}`;
  const [open, setOpen] = useState(() => {
    try { return sessionStorage.getItem(key) !== "false"; } catch { return defaultOpen; }
  });
  const toggle = () => {
    const next = !open;
    setOpen(next);
    try { sessionStorage.setItem(key, String(next)); } catch {}
  };
  return (
    <div className="py-4 border-b border-border last:border-0">
      <button onClick={toggle} className="flex items-center justify-between w-full text-sm font-semibold text-foreground">
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
              {STAR_RATINGS.map((r) => (
                <label key={r} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={Number(searchParams.get("minRating")) === r}
                    onCheckedChange={(checked) => applyFilter("minRating", checked ? r : undefined)}
                  />
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: r }).map((_, i) => (
                      <FaStar key={i} className="w-3.5 h-3.5 text-yellow-400" />
                    ))}
                    {r < 5 && <span className="text-xs text-muted-foreground ml-1">& up</span>}
                  </div>
                </label>
              ))}
            </div>
          </Section>

          {/* Review score */}
          <Section title="Review score">
            <div className="space-y-2">
              {REVIEW_SCORES.map((s) => {
                const currentMin = searchParams.get("minReviewScore");
                const currentMax = searchParams.get("maxReviewScore");
                const isChecked = currentMin !== null && Number(currentMin) === s.min &&
                  (s.max !== undefined ? currentMax !== null && Number(currentMax) === s.max : currentMax === null);
                return (
                  <label key={s.min} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={(checked) => {
                        const p = new URLSearchParams(searchParams);
                        if (checked) {
                          p.set("minReviewScore", String(s.min));
                          if (s.max !== undefined) p.set("maxReviewScore", String(s.max));
                          else p.delete("maxReviewScore");
                        } else {
                          p.delete("minReviewScore");
                          p.delete("maxReviewScore");
                        }
                        navigate(`/properties?${p.toString()}`);
                      }}
                    />
                    <span className="text-sm">{s.label}</span>
                  </label>
                );
              })}
            </div>
          </Section>

          {/* Property type */}
          <Section title="Property type">
            <div className="space-y-2">
              {PROPERTY_TYPES.map((t) => (
                <label key={t} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={searchParams.get("accessType") === t.toUpperCase()}
                    onCheckedChange={(checked) => applyFilter("accessType" as any, checked ? t.toUpperCase() : undefined)}
                  />
                  <span className="text-sm">{t} {t === "Private" ? "(Villas & Guest Houses)" : "(Hotels, Resorts & more)"}</span>
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
            <div className="space-y-3">
              <div className="flex gap-2 items-center">
                <Input
                  type="number" placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      applyFilter("minPrice", minPrice ? Number(minPrice) : undefined);
                      applyFilter("maxPrice", maxPrice ? Number(maxPrice) : undefined);
                    }
                  }}
                  className="text-sm"
                />
                <span className="text-muted-foreground">–</span>
                <Input
                  type="number" placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      applyFilter("minPrice", minPrice ? Number(minPrice) : undefined);
                      applyFilter("maxPrice", maxPrice ? Number(maxPrice) : undefined);
                    }
                  }}
                  className="text-sm"
                />
              </div>
              <button
                onClick={() => {
                  const p = new URLSearchParams(searchParams);
                  if (minPrice) p.set("minPrice", minPrice); else p.delete("minPrice");
                  if (maxPrice) p.set("maxPrice", maxPrice); else p.delete("maxPrice");
                  navigate(`/properties?${p.toString()}`);
                }}
                className="w-full text-xs bg-primary text-white rounded-lg py-2 font-semibold hover:bg-primary/90 transition-colors"
              >
                Apply price filter
              </button>
              {(searchParams.get("minPrice") || searchParams.get("maxPrice")) && (
                <p className="text-xs text-primary">
                  Active: ETB {searchParams.get("minPrice") || "0"} – {searchParams.get("maxPrice") || "∞"}
                </p>
              )}
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
