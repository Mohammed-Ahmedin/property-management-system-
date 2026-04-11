import { FilterSidebar } from "@/components/shared/filter/filter-sidebar";
import { PaginationControls } from "@/components/shared/pagination";
import { PropertyCard } from "@/components/shared/property-card";
import type { PropertyDataResponse } from "@/hooks/api/use-properties";
import { useSearchParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LayoutGrid, List } from "lucide-react";
import { useState } from "react";

interface Props {
  data: PropertyDataResponse[];
  pagination: {
    currentPage: number; totalPages: number; totalItems: number;
    limit: number; hasMore: boolean; previousPage: number | null; nextPage: number | null;
  };
  locationParam?: string;
  totalItems?: number;
}

const SORT_TABS = [
  { label: "Our top picks", sortField: "top_picks", sortDirection: "desc" },
  { label: "Lowest price first", sortField: "price", sortDirection: "asc" },
  { label: "Nearest to", sortField: "nearest", sortDirection: "asc" },
  { label: "Best reviewed", sortField: "rating", sortDirection: "desc" },
];

const DataContainer = ({ data, pagination, locationParam = "", totalItems = 0 }: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeSort = searchParams.get("sortField") || "top_picks";
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Client-side sorting and filtering
  const safeData = Array.isArray(data) ? data : [];

  // Helper: compute average room price for a property
  const avgPrice = (d: PropertyDataResponse) => {
    const prices = (d.rooms || []).map((r: any) => r.price).filter((p: number) => p > 0);
    return prices.length ? prices.reduce((a: number, b: number) => a + b, 0) / prices.length : null;
  };

  // Client-side price range filter (backend filters by any room in range, we want avg)
  const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : null;
  const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : null;

  const priceFiltered = (minPrice !== null || maxPrice !== null)
    ? safeData.filter(d => {
        const avg = avgPrice(d);
        if (avg === null) return false;
        if (minPrice !== null && avg < minPrice) return false;
        if (maxPrice !== null && avg > maxPrice) return false;
        return true;
      })
    : safeData;

  const sortedData = [...priceFiltered].sort((a, b) => {
    if (activeSort === "price") {
      const aAvg = avgPrice(a) ?? Infinity;
      const bAvg = avgPrice(b) ?? Infinity;
      return aAvg - bAvg;
    }
    if (activeSort === "nearest") {
      // Sort by lat/lon proximity — use Addis Ababa as default reference (9.0, 38.7)
      // Properties without coordinates go last, then sort by city name
      const refLat = 9.0; const refLon = 38.7;
      const dist = (d: PropertyDataResponse) => {
        const lat = parseFloat((d as any).location?.latitude);
        const lon = parseFloat((d as any).location?.longitude);
        if (isNaN(lat) || isNaN(lon)) return Infinity;
        return Math.sqrt((lat - refLat) ** 2 + (lon - refLon) ** 2);
      };
      const da = dist(a); const db = dist(b);
      if (da === Infinity && db === Infinity) {
        // Both no coords — sort by city
        return ((a as any).location?.city || "").localeCompare((b as any).location?.city || "");
      }
      return da - db;
    }
    return 0;
  });

  const handlePageChange = (newPage: number) => {
    const p = new URLSearchParams(searchParams);
    p.set("page", newPage.toString());
    setSearchParams(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const handleRowsPerPageChange = (value: number) => {
    const p = new URLSearchParams(searchParams);
    p.set("limit", value.toString());
    p.set("page", "1");
    setSearchParams(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSort = (sortField: string, sortDirection: string) => {
    const p = new URLSearchParams(searchParams);
    p.set("sortField", sortField);
    p.set("sortDirection", sortDirection);
    p.delete("page");
    setSearchParams(p);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 isolate">
      {/* Left sidebar — hidden on mobile, shown on lg+ */}
      <FilterSidebar />

      {/* Right content */}
      <div className="flex-1 min-w-0">
        {/* Heading + view toggle */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">
              {(() => {
                const typeParam = searchParams.get("type");
                const typeLabels: Record<string, string> = {
                  HOTEL: "Hotels", GUEST_HOUSE: "Guest Houses", APARTMENT: "Apartments",
                  RESORT: "Resorts", VILLA: "Villas", HOSTEL: "Hostels", LODGE: "Lodges",
                };
                if (typeParam && typeLabels[typeParam]) return typeLabels[typeParam];
                if (locationParam) return `Properties in ${locationParam}`;
                return "All Properties";
              })()}
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              {totalItems || safeData.length} properties found{locationParam ? ` in ${locationParam}` : ""}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {totalItems > 0 && (
              <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground bg-muted/40 border border-border rounded-full px-3 py-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                {totalItems} available
              </div>
            )}
            {/* View toggle */}
            <div className="flex items-center border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={cn("p-2 transition-colors", viewMode === "grid" ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground")}
                title="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn("p-2 transition-colors", viewMode === "list" ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground")}
                title="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Info panel — only when location is set */}
        {locationParam && (
          <div className="flex gap-4 mb-6">
            <div className="flex-1 border border-border rounded-xl p-4 text-sm">
              <p className="font-bold mb-2">Quick facts about {locationParam}</p>
              <p className="text-muted-foreground text-xs leading-relaxed">
                {locationParam} is one of Ethiopia's most vibrant cities, offering a rich blend of culture, history, and modern amenities. Explore local markets, historic sites, and enjoy warm Ethiopian hospitality.
              </p>
            </div>
            <div className="flex-1 border border-border rounded-xl p-4 text-sm">
              <p className="font-bold mb-2">Key Points</p>
              <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside leading-relaxed">
                <li>Wide range of accommodation options from budget to luxury</li>
                <li>Easy access to local attractions and transport</li>
                <li>Many properties offer free cancellation</li>
                <li>Best time to visit: October – February</li>
              </ul>
            </div>
          </div>
        )}

        {/* Sort tabs */}
        <div className="flex gap-2 mb-5 overflow-x-auto pb-1 scrollbar-hide">
          {SORT_TABS.map((tab) => {
            const icons: Record<string, string> = { "Our top picks": "⭐", "Lowest price first": "💰", "Nearest to": "📍", "Best reviewed": "🏆" };
            return (
              <button
                key={tab.label}
                onClick={() => handleSort(tab.sortField, tab.sortDirection)}
                className={cn(
                  "px-4 py-2 text-sm font-medium whitespace-nowrap rounded-full transition-all border shrink-0 flex items-center gap-1.5",
                  activeSort === tab.sortField
                    ? "bg-primary text-white border-primary shadow-sm shadow-primary/20 scale-[1.02]"
                    : "text-muted-foreground border-border hover:text-foreground hover:border-primary/50 hover:bg-muted/50"
                )}
              >
                <span>{icons[tab.label]}</span>{tab.label}
              </button>
            );
          })}
        </div>

        {/* Cards */}
        <div className={cn(
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
            : "flex flex-col gap-4"
        )}>
          {sortedData.length === 0 ? (
            <div className="col-span-full py-16 text-center text-muted-foreground">
              <svg className="w-16 h-16 mx-auto mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9.75L12 3l9 6.75V21H3V9.75z" />
              </svg>
              <p className="text-lg font-medium">No properties found</p>
              <p className="text-sm mt-1">Try adjusting your filters or check back later.</p>
            </div>
          ) : (
            sortedData.map((d, idx) => (
              <PropertyCard data={d} key={d.id + idx} view={viewMode === "grid" ? "vertical" : "horizontal"} />
            ))
          )}
        </div>

        <PaginationControls
          onLimitChange={handleRowsPerPageChange}
          onPageChange={handlePageChange}
          pagination={{
            ...pagination,
            limit: Number(pagination.limit) || Number(searchParams.get("limit")) || 10,
          }}
          className="py-10 mt-8"
          showLimitSelector
        />
      </div>
    </div>
  );
};

export default DataContainer;
