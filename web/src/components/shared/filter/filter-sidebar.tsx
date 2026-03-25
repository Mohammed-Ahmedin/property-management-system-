"use client";

import { useState, useCallback } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, RotateCcw } from "lucide-react";
import { FaStar } from "react-icons/fa";
import type { PropertyFilters } from "@/types/property.types";
import CitySubcityFilter from "./city-filter";
import { useNavigate } from "react-router-dom";

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
  const [filters, setFilters] = useState<PropertyFilters>({});
  const navigate = useNavigate();

  const set = useCallback((key: keyof PropertyFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") return;
      if (Array.isArray(value)) params.append(key, JSON.stringify(value));
      else if (typeof value === "number") params.append(key, value.toString());
      else if (typeof value === "boolean") params.append(key, value.toString());
      else params.append(key, value);
    });
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <div className="hidden lg:flex flex-col bg-background border border-border rounded-xl w-[260px] shrink-0 sticky top-4 self-start max-h-[calc(100vh-6rem)] z-10 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <span className="text-sm font-bold">Filters</span>
        <button
          onClick={() => { setFilters({}); navigate("/properties"); }}
          className="text-xs text-primary hover:underline flex items-center gap-1"
        >
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
      </div>

      <ScrollArea className="flex-1 px-4">
        <div className="py-1">

          {/* Star rating — matches Agoda screenshot */}
          <Section title="Star rating">
            <div className="space-y-2">
              {STAR_RATINGS.map((r) => (
                <label key={r} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={filters.minRating === r}
                    onCheckedChange={(checked) => set("minRating", checked ? r : undefined)}
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

          {/* Review score — matches Agoda screenshot */}
          <Section title="Review score">
            <div className="space-y-2">
              {REVIEW_SCORES.map((s) => (
                <label key={s.min} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={filters.minRating === s.min}
                    onCheckedChange={(checked) => set("minRating", checked ? s.min : undefined)}
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
                    checked={filters.type === t.toLowerCase()}
                    onCheckedChange={(checked) => set("type", checked ? t.toLowerCase() : undefined)}
                  />
                  <span className="text-sm">{t}</span>
                </label>
              ))}
            </div>
          </Section>

          {/* Facilities */}
          <Section title="Facilities">
            <div className="space-y-2">
              {FACILITIES.map((f) => (
                <label key={f} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={(filters.facilityNames || []).includes(f)}
                    onCheckedChange={(checked) => {
                      const cur = filters.facilityNames || [];
                      const upd = checked ? [...cur, f] : cur.filter((x) => x !== f);
                      set("facilityNames", upd.length > 0 ? upd : undefined);
                    }}
                  />
                  <span className="text-sm">{f}</span>
                </label>
              ))}
            </div>
          </Section>

          {/* Price */}
          <Section title="Price per night (ETB)" defaultOpen={false}>
            <div className="flex gap-2 items-center">
              <Input type="number" placeholder="Min" value={filters.minPrice || ""} onChange={(e) => set("minPrice", e.target.value ? Number(e.target.value) : undefined)} className="text-sm" />
              <span className="text-muted-foreground">–</span>
              <Input type="number" placeholder="Max" value={filters.maxPrice || ""} onChange={(e) => set("maxPrice", e.target.value ? Number(e.target.value) : undefined)} className="text-sm" />
            </div>
          </Section>

          {/* Location */}
          <Section title="Location" defaultOpen={false}>
            <CitySubcityFilter filters={filters} handleFilterChange={set} />
          </Section>

          {/* Availability */}
          <Section title="Availability" defaultOpen={false}>
            <div className="flex items-center justify-between">
              <span className="text-sm">Available rooms only</span>
              <Switch checked={filters.hasRoomsAvailable || false} onCheckedChange={(v) => set("hasRoomsAvailable", v || undefined)} />
            </div>
          </Section>

        </div>
      </ScrollArea>

      <div className="border-t border-border p-3">
        <Button onClick={handleSearch} className="w-full text-sm">Show results</Button>
      </div>
    </div>
  );
}
