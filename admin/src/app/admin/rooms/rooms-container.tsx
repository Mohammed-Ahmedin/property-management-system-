"use client";

import { EmptyState } from "@/components/shared/empty-state";
import LoaderState from "@/components/shared/loader-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUpRightIcon, BadgeAlert, Bed, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { RoomCard } from "./room-card";
import { DataPagination } from "@/components/pagination";
import Link from "next/link";
import { useGetRoomsForManagementQuery } from "@/hooks/api/use-rooms";

const RoomsContainer = () => {
  const { isFetching, error, data } = useGetRoomsForManagementQuery();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const filteredRooms = useMemo(() => {
    if (!data?.data) return [];

    return data.data.filter((room: any) => {
      // Search by room ID, name, or other text fields
      const matchesSearch =
        searchQuery === "" ||
        room.id?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.roomNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.description?.toLowerCase().includes(searchQuery.toLowerCase());

      // Filter by status — use availability field
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "available" && room.availability === true) ||
        (statusFilter === "occupied" && room.availability === false);

      // Filter by type
      const matchesType =
        typeFilter === "all" ||
        room.type?.toLowerCase() === typeFilter.toLowerCase() ||
        room.roomType?.toLowerCase() === typeFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [data?.data, searchQuery, statusFilter, typeFilter]);

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setTypeFilter("all");
  };

  const hasActiveFilters =
    searchQuery !== "" || statusFilter !== "all" || typeFilter !== "all";

  if (isFetching) {
    return <LoaderState />;
  }

  if (error) {
    return (
      <EmptyState
        icon={<BadgeAlert />}
        title="Failed to load rooms"
        description="Please try again later"
      />
    );
  }

  if (data?.data?.length === 0) {
    return (
      <div className="flex justify-center items-center mt-20">
        <EmptyState
          icon={<Bed size={40} />}
          title="No Rooms Found"
          description="You haven't added any rooms yet. Start by creating your first room listing to welcome guests."
          primaryActions={
            <Button onClick={() => router.push("/admin/rooms/create")}>
              Create Rooms
            </Button>
          }
          secondaryLink={{
            href: "/docs/rooms",
            label: "Learn how it works",
            icon: <ArrowUpRightIcon className="ml-1 h-4 w-4" />,
          }}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">All Rooms</h2>
        <div className="flex gap-2 items-center">
          <p className="text-sm text-muted-foreground">
            {filteredRooms.length} room{filteredRooms.length !== 1 ? "s" : ""}{" "}
            found
          </p>
          <Link href={`/admin/rooms/create`}>
            <Button>Add new</Button>
          </Link>
        </div>
      </div>

      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          {/* Search Input */}
          <div className="relative max-md:flex-1 md:w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by Room ID, name, or number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex gap-3">
            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="occupied">Occupied</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="reserved">Reserved</SelectItem>
              </SelectContent>
            </Select>

            {/* Type Filter */}
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="single">Single</SelectItem>
                <SelectItem value="double">Double</SelectItem>
                <SelectItem value="suite">Suite</SelectItem>
                <SelectItem value="deluxe">Deluxe</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="icon"
              onClick={clearFilters}
              className="shrink-0 bg-transparent"
              title="Clear all filters"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Active filters indicator */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Active filters:</span>
            {searchQuery && (
              <span className="px-2 py-1 bg-secondary rounded-md">
                Search: "{searchQuery}"
              </span>
            )}
            {statusFilter !== "all" && (
              <span className="px-2 py-1 bg-secondary rounded-md">
                Status: {statusFilter}
              </span>
            )}
            {typeFilter !== "all" && (
              <span className="px-2 py-1 bg-secondary rounded-md">
                Type: {typeFilter}
              </span>
            )}
          </div>
        )}
      </div>

      {filteredRooms.length === 0 ? (
        <div className="flex justify-center items-center py-12">
          <EmptyState
            icon={<Search size={40} />}
            title="No rooms match your search"
            description="Try adjusting your search terms or filters to find what you're looking for."
            primaryActions={
              hasActiveFilters ? (
                <Button onClick={clearFilters} variant="outline">
                  Clear Filters
                </Button>
              ) : undefined
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room: any) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      )}

      <div className="py-6">
        <DataPagination
          pagination={{
            currentPage: 1,
            hasMore: false,
            limit: 5,
            totalItems: filteredRooms.length,
            totalPages: 1,
            previousPage: 0,
            nextPage: 2,
          }}
        />
      </div>
    </div>
  );
};

export default RoomsContainer;
