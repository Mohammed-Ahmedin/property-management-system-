"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { RotateCcw, ChevronDown, ChevronUp } from "lucide-react";
import { FaStar } from "react-icons/fa";
import type { PropertyFilters } from "@/types/property.types";
import CitySubcityFilter from "./city-filter";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const FACILITIES = ["WiFi", "Kitchen", "Air Conditioning", "Heating", "Parking", "Washer", "Dryer", "TV", "Pool", "Gym", "Breakfast", "Airport Transfer"];
const PROPERTY_TYPES = ["SHARED", "PRIVATE", "ENTIRE"];
const RATINGS = [5, 4, 3, 2, 1];

function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="py-4 border-b border-border last:border-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between w-full text-sm font-semibold text-foreground mb-0"
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

  const handleFilterChange = useCallback((key: keyof PropertyFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleClearFilters = () => {
    setFilters({});
    navigate("/properties");
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        if (Array.isArray(value)) params.append(key, JSON.stringify(value));
        else if (typeof value === "number") params.append(key, value.toString());
        else if (typeof value === "boolean") params.append(key, value.toString());
        else params.append(key, value);
      }
    });
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <div className="hidden lg:flex flex-col h-full bg-card border rounded-xl w-[280px] shrink-0 sticky top-4 self-start max-h-[calc(100vh-6rem)]">
      <div className="px-5 py-4 border-b flex items-center justify-between">
        <h2 className="text-base font-bold">Filters</h2>
        <button onClick={handleClearFilters} className="text-xs text-primary hover:underline flex items-center gap-1">
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
      </div>

      <ScrollArea className="flex-1 px-5">
        <div className="py-2">

          <Section title="Search">
            <Input
              placeholder="Property name..."
              value={filters.search || ""}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="text-sm"
            />
          </Section>

          <Section title="Location">
            <CitySubcityFilter filters={filters} handleFilterChange={handleFilterChange} />
          </Section>

          <Section title="Price per night (ETB)">
            <div className="flex gap-2 items-center">
              <Input
                type="number"
                placeholder="Min"
                value={filters.minPrice || ""}
                onChange={(e) => handleFilterChange("minPrice", e.target.value ? Number(e.target.value) : undefined)}
                className="text-sm"
              />
              <span className="text-muted-foreground text-sm">–</span>
              <Input
                type="number"
                placeholder="Max"
                value={filters.maxPrice || ""}
                onChange={(e) => handleFilterChange("maxPrice", e.target.value ? Number(e.target.value) : undefined)}
                className="text-sm"
              />
            </div>
          </Section>

          <Section title="Guest rating">
            <div className="space-y-2">
              {RATINGS.map((r) => (
                <label key={r} className="flex items-center gap-2 cursor-pointer group">
                  <Checkbox
                    checked={filters.minRating === r}
                    onCheckedChange={(checked) => handleFilterChange("minRating", checked ? r : undefined)}
                  />
                  <div className="flex items-center gap-1">
                    {Array.from({ length: r }).map((_, i) => (
                      <FaStar key={i} className="w-3 h-3 text-yellow-400" />
                    ))}
                    {r < 5 && <span className="text-xs text-muted-foreground ml-1">& up</span>}
                  </div>
                </label>
              ))}
            </div>
          </Section>

          <Section title="Property type">
            <div className="space-y-2">
              {PROPERTY_TYPES.map((t) => (
                <label key={t} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={filters.type === t.toLowerCase()}
                    onCheckedChange={(checked) => handleFilterChange("type", checked ? t.toLowerCase() : undefined)}
                  />
                  <span className="text-sm capitalize">{t.toLowerCase()}</span>
                </label>
              ))}
            </div>
          </Section>

          <Section title="Facilities">
            <div className="space-y-2">
              {FACILITIES.map((f) => (
                <label key={f} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={(filters.facilityNames || []).includes(f)}
                    onCheckedChange={(checked) => {
                      const current = filters.facilityNames || [];
                      const updated = checked ? [...current, f] : current.filter((x) => x !== f);
                      handleFilterChange("facilityNames", updated.length > 0 ? updated : undefined);
                    }}
                  />
                  <span className="text-sm">{f}</span>
                </label>
              ))}
            </div>
          </Section>

          <Section title="Availability" defaultOpen={false}>
            <div className="flex items-center justify-between">
              <span className="text-sm">Available rooms only</span>
              <Switch
                checked={filters.hasRoomsAvailable || false}
                onCheckedChange={(checked) => handleFilterChange("hasRoomsAvailable", checked || undefined)}
              />
            </div>
          </Section>

        </div>
      </ScrollArea>

      <div className="border-t p-4">
        <Button onClick={handleSearch} className="w-full">Show results</Button>
      </div>
    </div>
  );
}
