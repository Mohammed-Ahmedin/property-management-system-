"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useGetProperties } from "@/hooks/api/use-properties";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import DataContainer from "./data-container";
import { Filter, Search } from "lucide-react";
import type { PropertyFilters } from "@/types/property.types";
import SortPopover from "./sort";
import { PropertyFilter } from "@/components/shared/filter";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";

// City hero images mapped by location name
const CITY_IMAGES: Record<string, string> = {
  "Addis Ababa": "https://images.unsplash.com/photo-1580746738099-b2d4b5d4b9b7?w=1600&q=80",
  "Bahir Dar": "https://images.unsplash.com/photo-1504432842672-1a79f78e4084?w=1600&q=80",
  "Hawassa": "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1600&q=80",
  "Gondar": "https://images.unsplash.com/photo-1489493887464-892be6d1daae?w=1600&q=80",
};
const DEFAULT_HERO = "https://images.unsplash.com/photo-1561501900-3701fa6a0864?w=1600&q=80";

export default function PropertiesPage() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [stickyVisible, setStickyVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const limitSearchParam = searchParams.get("limit");
  const pageSearchParam = searchParams.get("page");
  const locationParam = searchParams.get("location") || "";
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
    const keys = Array.from(searchParams.keys());
    return keys.some((k) => !["sort"].includes(k));
  }, [searchParams]);

  const dataQuery = useGetProperties({
    filters,
    limit: Number(limitSearchParam) || 10,
    page: Number(pageSearchParam) || 1,
    sortDirection: sort === "latest" ? "desc" : "asc",
  });

  useEffect(() => { dataQuery.refetch(); }, [searchParams]);

  // Show sticky bar after hero scrolls out of view
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const obs = new IntersectionObserver(([e]) => setStickyVisible(!e.isIntersecting), { threshold: 0 });
    obs.observe(hero);
    return () => obs.disconnect();
  }, []);

  const handleSearch = () => {
    const p = new URLSearchParams(searchParams);
    if (search) p.set("search", search); else p.delete("search");
    setSearchParams(p);
  };

  const heroImage = CITY_IMAGES[locationParam] || DEFAULT_HERO;

  const renderData = () => {
    if (dataQuery.isLoading) {
      return (
        <div className="flex gap-10 mt-6">
          <Skeleton className="w-[280px] h-[80vh] max-lg:hidden rounded-xl" />
          <div className="flex flex-col gap-3 flex-1">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-[200px] w-full rounded-xl" />)}
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
    return <DataContainer data={dataQuery.data.data} pagination={dataQuery.data.pagination} />;
  };

  return (
    <>
      {dataQuery.isFetching && (
        <div className="fixed inset-0 bg-black/10 z-[999] backdrop-blur-sm flex items-center justify-center">
          <Spinner scale={2} className="size-12" />
        </div>
      )}

      {/* Sticky search bar — appears after hero scrolls away */}
      <div className={`fixed top-16 left-0 right-0 z-40 bg-[#1a2340] shadow-lg transition-all duration-300 ${stickyVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}`}>
        <div className="max-w-5xl mx-auto px-4 py-3 flex gap-2 items-center">
          <div className="flex-1 bg-white rounded-lg flex items-center px-3 gap-2">
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              className="flex-1 py-2.5 text-sm text-gray-900 bg-transparent outline-none placeholder:text-gray-400"
              placeholder={locationParam || "Search destination..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <button className="bg-white rounded-lg px-4 py-2.5 text-sm text-gray-500 border border-gray-200 hover:border-primary transition-colors">Check-in</button>
          <button className="bg-white rounded-lg px-4 py-2.5 text-sm text-gray-500 border border-gray-200 hover:border-primary transition-colors">Check-out</button>
          <button className="bg-primary text-white rounded-lg px-6 py-2.5 text-sm font-bold hover:bg-primary/90 transition-colors">SEARCH</button>
        </div>
      </div>

      {/* City Hero */}
      <div ref={heroRef} className="relative w-full h-[320px] md:h-[400px] overflow-hidden">
        <img src={heroImage} alt={locationParam || "Properties"} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">
            {locationParam ? `${locationParam} hotels & places to stay` : "Find your perfect stay"}
          </h1>
          <p className="text-white/80 text-sm md:text-base mb-8">
            Search to compare prices and discover great deals
          </p>
          {/* Inline search bar in hero */}
          <div className="w-full max-w-3xl bg-white rounded-xl flex flex-col sm:flex-row overflow-hidden shadow-2xl">
            <div className="flex-1 flex items-center px-4 py-3 gap-2 border-b sm:border-b-0 sm:border-r border-gray-200">
              <Search className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                className="flex-1 text-sm text-gray-900 bg-transparent outline-none placeholder:text-gray-400"
                placeholder={locationParam || "Enter a destination or property"}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <button className="px-4 py-3 text-sm text-gray-500 border-b sm:border-b-0 sm:border-r border-gray-200 hover:bg-gray-50 transition-colors text-left">
              <span className="block text-xs text-gray-400">Check-in</span>
            </button>
            <button className="px-4 py-3 text-sm text-gray-500 border-b sm:border-b-0 sm:border-r border-gray-200 hover:bg-gray-50 transition-colors text-left">
              <span className="block text-xs text-gray-400">Check-out</span>
            </button>
            <button
              onClick={handleSearch}
              className="bg-primary text-white px-8 py-3 text-sm font-bold hover:bg-primary/90 transition-colors"
            >
              SEARCH
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="px-4 sm:px-8 md:px-16 py-8">
        {/* Title + sort row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
          <h2 className="text-2xl font-bold">
            {locationParam ? `Hotels in ${locationParam}` : "All Properties"}
          </h2>
          <div className="flex items-center gap-2">
            <SortPopover />
            <Button onClick={() => setFilterOpen(true)} variant="default" size="sm" className="gap-2 lg:hidden">
              <Filter className="w-4 h-4" /> Filters
            </Button>
            {hasActiveFilters && (
              <Button variant="link" onClick={() => navigate("/properties")} className="text-red-600 text-sm px-2">
                Clear filters
              </Button>
            )}
          </div>
        </div>

        <PropertyFilter isOpen={filterOpen} onOpenChange={setFilterOpen} />
        {renderData()}
      </main>
    </>
  );
}
