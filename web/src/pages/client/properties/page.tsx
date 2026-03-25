"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useGetProperties } from "@/hooks/api/use-properties";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import DataContainer from "./data-container";
import { Search, Users, CalendarDays } from "lucide-react";
import type { PropertyFilters } from "@/types/property.types";
import { PropertyFilter } from "@/components/shared/filter";
import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";

const CITY_IMAGES: Record<string, string> = {
  "Addis Ababa": "https://images.unsplash.com/photo-1580746738099-b2d4b5d4b9b7?w=1600&q=80",
  "Bahir Dar":   "https://images.unsplash.com/photo-1504432842672-1a79f78e4084?w=1600&q=80",
  "Hawassa":     "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1600&q=80",
  "Gondar":      "https://images.unsplash.com/photo-1489493887464-892be6d1daae?w=1600&q=80",
};
const DEFAULT_HERO = "https://images.unsplash.com/photo-1561501900-3701fa6a0864?w=1600&q=80";

// Agoda-style dark navy search bar used in hero + sticky
function SearchBar({ location, onSearch }: { location: string; onSearch: (q: string) => void }) {
  const [q, setQ] = useState(location);
  return (
    <div className="flex w-full max-w-4xl bg-white rounded-lg overflow-hidden shadow-xl">
      {/* Destination */}
      <div className="flex-1 flex items-center gap-2 px-4 py-3 border-r border-gray-200 min-w-0">
        <Search className="w-4 h-4 text-gray-400 shrink-0" />
        <input
          className="flex-1 text-sm text-gray-900 bg-transparent outline-none placeholder:text-gray-400 min-w-0"
          placeholder="Enter a destination or property"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSearch(q)}
        />
      </div>
      {/* Check-in */}
      <button className="flex items-center gap-2 px-4 py-3 border-r border-gray-200 hover:bg-gray-50 transition-colors shrink-0">
        <CalendarDays className="w-4 h-4 text-gray-400" />
        <span className="text-sm text-gray-400">Check-in</span>
      </button>
      {/* Check-out */}
      <button className="flex items-center gap-2 px-4 py-3 border-r border-gray-200 hover:bg-gray-50 transition-colors shrink-0">
        <CalendarDays className="w-4 h-4 text-gray-400" />
        <span className="text-sm text-gray-400">Check-out</span>
      </button>
      {/* Guests */}
      <button className="flex items-center gap-2 px-4 py-3 border-r border-gray-200 hover:bg-gray-50 transition-colors shrink-0">
        <Users className="w-4 h-4 text-gray-400" />
        <div className="text-left">
          <p className="text-sm text-gray-700 font-medium leading-none">2 adults</p>
          <p className="text-xs text-gray-400">1 room</p>
        </div>
      </button>
      {/* Search button */}
      <button
        onClick={() => onSearch(q)}
        className="bg-primary hover:bg-primary/90 text-white px-8 text-sm font-bold transition-colors shrink-0"
      >
        SEARCH
      </button>
    </div>
  );
}

export default function PropertiesPage() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [stickyVisible, setStickyVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const locationParam = searchParams.get("location") || "";
  const limitSearchParam = searchParams.get("limit");
  const pageSearchParam = searchParams.get("page");
  const navigate = useNavigate();
  const filters: any = {};

  searchParams.forEach((value, key) => {
    if (key === "facilityNames") {
      filters[key as keyof PropertyFilters] = JSON.parse(value);
    } else if (["minRating","maxRating","minPrice","maxPrice"].includes(key)) {
      filters[key] = Number(value);
    } else if (key === "hasRoomsAvailable") {
      filters[key] = value === "true";
    } else {
      filters[key as any] = value;
    }
  });

  const sort = searchParams.get("sort");

  const hasActiveFilters = useMemo(() => {
    return Array.from(searchParams.keys()).some((k) => k !== "sort");
  }, [searchParams]);

  const dataQuery = useGetProperties({
    filters,
    limit: Number(limitSearchParam) || 10,
    page: Number(pageSearchParam) || 1,
    sortDirection: sort === "latest" ? "desc" : "asc",
  });

  useEffect(() => { dataQuery.refetch(); }, [searchParams]);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const obs = new IntersectionObserver(([e]) => setStickyVisible(!e.isIntersecting), { threshold: 0 });
    obs.observe(hero);
    return () => obs.disconnect();
  }, []);

  const handleSearch = (q: string) => {
    const p = new URLSearchParams(searchParams);
    if (q) p.set("search", q); else p.delete("search");
    setSearchParams(p);
  };

  const heroImage = CITY_IMAGES[locationParam] || DEFAULT_HERO;

  const renderData = () => {
    if (dataQuery.isLoading) {
      return (
        <div className="flex gap-6 mt-6">
          <Skeleton className="w-[260px] h-[80vh] max-lg:hidden rounded-xl shrink-0" />
          <div className="flex flex-col gap-4 flex-1">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-[220px] w-full rounded-xl" />)}
          </div>
        </div>
      );
    }
    if (dataQuery.isError || !dataQuery.data?.data) {
      return <ErrorState title="Something went wrong, please try again" refetch={dataQuery.refetch} />;
    }
    if (dataQuery.data.data.length === 0 && hasActiveFilters) {
      return (
        <div className="mt-20 flex flex-col items-center gap-4">
          <EmptyState title="No Properties Found" description="Try adjusting your filters." />
          <Button onClick={() => navigate("/properties")} variant="outline">Clear Filters</Button>
        </div>
      );
    }
    if (dataQuery.data.data.length === 0) {
      return <EmptyState title="No properties available yet" description="" />;
    }
    return (
      <DataContainer
        data={dataQuery.data.data}
        pagination={dataQuery.data.pagination}
        locationParam={locationParam}
        totalItems={dataQuery.data.pagination.totalItems}
      />
    );
  };

  return (
    <>
      {dataQuery.isFetching && (
        <div className="fixed inset-0 bg-black/10 z-[999] backdrop-blur-sm flex items-center justify-center">
          <Spinner scale={2} className="size-12" />
        </div>
      )}

      {/* Sticky dark navy search bar */}
      <div className={`fixed top-16 left-0 right-0 z-40 bg-[#1a2340] py-3 px-4 shadow-lg transition-all duration-300 ${stickyVisible ? "translate-y-0 opacity-100 pointer-events-auto" : "-translate-y-full opacity-0 pointer-events-none"}`}>
        <div className="max-w-5xl mx-auto">
          <SearchBar location={locationParam} onSearch={handleSearch} />
        </div>
      </div>

      {/* Hero */}
      <div ref={heroRef} className="relative w-full h-[340px] md:h-[420px] overflow-hidden">
        <img src={heroImage} alt={locationParam} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 gap-4">
          <h1 className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg">
            {locationParam ? `${locationParam} hotels & places to stay` : "Find your perfect stay"}
          </h1>
          <p className="text-white/80 text-sm md:text-base">
            Search to compare prices and discover great deals with free cancellation
          </p>
          <SearchBar location={locationParam} onSearch={handleSearch} />
        </div>
      </div>

      {/* Page body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PropertyFilter isOpen={filterOpen} onOpenChange={setFilterOpen} />
        {renderData()}
      </div>
    </>
  );
}
