import { useState } from "react";
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

const SORT_TABS = ["Our top picks", "Lowest price first", "Nearest to", "Best reviewed"];

const DataContainer = ({ data, pagination, locationParam = "", totalItems = 0 }: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeSort, setActiveSort] = useState("Our top picks");

  const handlePageChange = (newPage: number) => setSearchParams({ page: newPage.toString() });
  const handleRowsPerPageChange = (value: number) => setSearchParams({ limit: value.toString() });

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
              key={tab}
              onClick={() => setActiveSort(tab)}
              className={cn(
                "px-5 py-3 text-sm font-medium whitespace-nowrap transition-colors shrink-0",
                activeSort === tab
                  ? "bg-primary text-white"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Count */}
        <p className="text-sm text-muted-foreground mb-4">
          {totalItems || data.length} properties found{locationParam ? ` in ${locationParam}` : ""}
        </p>

        {/* Cards */}
        <div className="flex flex-col gap-4">
          {data.map((d, idx) => (
            <PropertyCard data={d} key={d.id + idx} />
          ))}
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
