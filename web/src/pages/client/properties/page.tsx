"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useGetProperties } from "@/hooks/api/use-properties";
import LoaderState from "@/components/shared/loader-state";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import DataContainer from "./data-container";
import { Filter, Search, X } from "lucide-react";
import type { PropertyFilters } from "@/types/property.types";
import SortPopover from "./sort";
import { PropertyFilter } from "@/components/shared/filter";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";

export default function PropertiesPage() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search"));
  const limitSearchParam = searchParams.get("limit");
  const pageSearchParam = searchParams.get("page");
  const navigate = useNavigate();
  const filters: any = {};

  // Parse search params
  searchParams.forEach((value, key) => {
    if (key === "facilityNames") {
      filters[key as keyof PropertyFilters] = JSON.parse(value);
    } else if (
      key === "minRating" ||
      key === "maxRating" ||
      key === "minPrice" ||
      key === "maxPrice"
    ) {
      filters[key] = Number(value);
    } else if (key === "hasRoomsAvailable") {
      filters[key] = value === "true";
    } else {
      filters[key as any] = value;
    }
  });

  const sort = searchParams.get("sort");

  // Check if any filters are active (excluding sort)
  const hasActiveFilters = useMemo(() => {
    const keys = Array.from(searchParams.keys());
    return keys.some((k) => !["sort"].includes(k));
  }, [searchParams]);

  const dataQuery = useGetProperties({
    filters: filters,
    limit: Number(limitSearchParam) || 10,
    page: Number(pageSearchParam) || 1,
    sortDirection: sort == "latest" ? "desc" : "asc",
  });

  useEffect(() => {
    dataQuery.refetch();
  }, [searchParams]);

  const renderData = () => {
    if (dataQuery.isLoading) {
      return (
        <main className="flex flex-row mt-6 md:mt-16 md:px-4 gap-2">
          <Skeleton className="w-[450px] h-[100dvh] max-md:hidden" />

          <div className="flex flex-col gap-3 flex-1">
            <Skeleton className="h-[330px] w-full rounded-xl " />
            <Skeleton className="h-[330px] w-full rounded-xl " />
            <Skeleton className="h-[330px] w-full rounded-xl " />
            <Skeleton className="h-[330px] w-full rounded-xl " />
            <Skeleton className="h-[330px] w-full rounded-xl " />
            <Skeleton className="h-[330px] w-full rounded-xl " />
            <Skeleton className="h-[330px] w-full rounded-xl " />
            <Skeleton className="h-[330px] w-full rounded-xl " />
          </div>
        </main>
      );
    }

    if (dataQuery.isError || !dataQuery.data?.data) {
      return (
        <div>
          <ErrorState
            title="Something went wrong, please try again"
            refetch={dataQuery.refetch}
          />
        </div>
      );
    }

    if (dataQuery.data?.data.length === 0 && hasActiveFilters) {
      return (
        <div className="mt-20 flex flex-col justify-center items-center">
          <EmptyState
            title="No Properties Found"
            description="We couldn't find any properties matching your filters. Try adjusting your search criteria or clear the filters to see all properties."
          />
          <Button onClick={() => navigate("/properties")} variant={"outline"}>
            Clear Filters
          </Button>
        </div>
      );
    }

    if (dataQuery.data?.data.length === 0) {
      return <EmptyState title="No property available yet" description="" />;
    }

    return (
      <DataContainer
        data={dataQuery.data?.data}
        pagination={dataQuery.data.pagination}
      />
    );
  };

  return (
    <>
      {dataQuery.isFetching && (
        <div className="w-full h-full bg-black/10 z-[999] fixed top-0 left-0 right-0 bottom-0 backdrop-blur-sm flex justify-center items-center">
          <Spinner scale={2} className="size-12" />
        </div>
      )}

      <main className="mt-6 md:mt-16 px-4 sm:px-14 md:px-24">
        <div className="flex max-sm:flex-col sm:items-center justify-between mb-8">
          <h1 className="text-2xl md:text-3xl font-bold">Properties</h1>

          <div className="max-sm:flex-col gap-2 flex items-center max-sm:mt-4 ">
            {/* Search Input */}
            <div className="mt-1 space-y-2 flex gap-1 max-sm:w-full">
              <Input
                id="search"
                placeholder="Search anything (properties, city, subcities)..."
                value={search || ""}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                className="w-full sm:w-[300px]  py-6"
              />
              {search && (
                <Button
                  variant={"default"}
                  size={"icon"}
                  className="py-6 aspect-square px-6"
                  onClick={() => {
                    setSearchParams({ search: search });
                  }}
                >
                  <Search />
                </Button>
              )}
            </div>

            <div className="flex gap-2 items-center max-sm:w-full relative">
              <SortPopover />
              <div className="relative max-sm:flex-1">
                <Button
                  onClick={() => setFilterOpen(true)}
                  variant="default"
                  size="lg"
                  className="gap-2 max-sm:w-full py-6 lg:hidden"
                >
                  <Filter className="w-4 h-4" />
                  <h2 className="">Filter Properties</h2>
                </Button>

                {/* Small red dot indicator for active filters */}
                {hasActiveFilters && (
                  <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                )}
              </div>
              {hasActiveFilters && (
                <Button
                  variant="link"
                  onClick={() => navigate("/properties")}
                  className="py-6 px-6 text-red-600"
                  title="Clear Filters"
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
        </div>

        <PropertyFilter isOpen={filterOpen} onOpenChange={setFilterOpen} />

        {renderData()}
      </main>
    </>
  );
}
