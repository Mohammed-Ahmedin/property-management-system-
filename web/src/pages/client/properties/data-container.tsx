import { FilterSidebar } from "@/components/shared/filter/filter-sidebar";
import { PaginationControls } from "@/components/shared/pagination";
import { PropertyCard } from "@/components/shared/property-card";
import type { PropertyDataResponse } from "@/hooks/api/use-properties";
import { useSearchParams } from "react-router-dom";
import { cn } from "@/lib/utils";

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
  { label: "Our top picks", sortField: "createdAt", sortDirection: "desc" },
  { label: "Lowest price first", sortField: "price", sortDirection: "asc" },
  { label: "Nearest to", sortField: "createdAt", sortDirection: "asc" },
  { label: "Best reviewed", sortField: "rating", sortDirection: "desc" },
];

const DataContainer = ({ data, pagination, locationParam = "", totalItems = 0 }: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeSort = searchParams.get("sortField") || "createdAt";

  // Client-side price sort (backend can't sort by min room price easily)
  const safeData = Array.isArray(data) ? data : [];
  const sortedData = [...safeData].sort((a, b) => {
    if (activeSort === "price") {
      const aRooms = a.rooms?.map((r: any) => r.price).filter((p: number) => p > 0) || [];
      const bRooms = b.rooms?.map((r: any) => r.price).filter((p: number) => p > 0) || [];
      const aPrice = aRooms.length ? Math.min(...aRooms) : Infinity;
      const bPrice = bRooms.length ? Math.min(...bRooms) : Infinity;
      return aPrice - bPrice;
    }
    return 0;
  });

  const handlePageChange = (newPage: number) => {
    const p = new URLSearchParams(searchParams);
    p.set("page", newPage.toString());
    setSearchParams(p);
  };
  const handleRowsPerPageChange = (value: number) => {
    const p = new URLSearchParams(searchParams);
    p.set("limit", value.toString());
    setSearchParams(p);
  };

  const handleSort = (sortField: string, sortDirection: string) => {
    const p = new URLSearchParams(searchParams);
    p.set("sortField", sortField);
    p.set("sortDirection", sortDirection);
    p.delete("page");
    setSearchParams(p);
  };

  return (
    <div className="flex gap-6 isolate">
      {/* Left sidebar */}
      <FilterSidebar />

      {/* Right content */}
      <div className="flex-1 min-w-0">
        {/* Heading */}
        <h2 className="text-2xl font-bold mb-4">
          {locationParam ? `Hotels in ${locationParam}` : "All Properties"}
        </h2>

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
        <div className="flex border-b border-border mb-4 overflow-x-auto">
          {SORT_TABS.map((tab) => (
            <button
              key={tab.label}
              onClick={() => handleSort(tab.sortField, tab.sortDirection)}
              className={cn(
                "px-5 py-3 text-sm font-medium whitespace-nowrap transition-colors shrink-0",
                activeSort === tab.sortField
                  ? "bg-primary text-white"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Count */}
        <p className="text-sm text-muted-foreground mb-4">
          {totalItems || safeData.length} properties found{locationParam ? ` in ${locationParam}` : ""}
        </p>

        {/* Cards */}
        <div className="flex flex-col gap-4">
          {sortedData.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground">
              <svg className="w-16 h-16 mx-auto mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9.75L12 3l9 6.75V21H3V9.75z" />
              </svg>
              <p className="text-lg font-medium">No properties found</p>
              <p className="text-sm mt-1">Try adjusting your filters or check back later.</p>
            </div>
          ) : (
            sortedData.map((d, idx) => <PropertyCard data={d} key={d.id + idx} />)
          )}
        </div>

        <PaginationControls
          onLimitChange={handleRowsPerPageChange}
          onPageChange={handlePageChange}
          pagination={pagination}
          className="py-10 mt-8"
          showLimitSelector
        />
      </div>
    </div>
  );
};

export default DataContainer;
