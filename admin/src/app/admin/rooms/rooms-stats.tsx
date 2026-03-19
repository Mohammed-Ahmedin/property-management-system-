"use client";

import React from "react";
import { StatsCard } from "./stats-card";
import { Building2, Calendar1Icon, DoorOpen, Loader } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetRoomsStatsQuery } from "@/hooks/api/use-rooms";
import { useAuthSession } from "@/hooks/use-auth-session";

const RoomsStats = () => {
  const { role } = useAuthSession();
  const canAccess = !!role && role !== "GUEST";

  const { isFetching, data } = useGetRoomsStatsQuery(canAccess);
  if (isFetching) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Skeleton className="w-full aspect-video" />
        <Skeleton className="w-full aspect-video" />
        <Skeleton className="w-full aspect-video" />
        <Skeleton className="w-full aspect-video" />
      </div>
    );
  }

  if (!data) return;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatsCard
        title="Total Rooms"
        value={data?.totalRooms}
        icon={<Building2 className="h-5 w-5" />}
        description="All rooms in the system"
      />
      <StatsCard
        title="Available Rooms"
        value={data?.availableRooms}
        icon={<DoorOpen className="h-5 w-5" />}
        description="Ready for booking"
        variant="success"
      />
      <StatsCard
        title="Booked Rooms"
        value={data?.bookedRooms}
        icon={<Calendar1Icon className="h-5 w-5" />}
        description="Currently occupied"
        variant="warning"
      />
      <StatsCard
        title="Pending"
        value={data?.pendingRooms}
        icon={<Loader className="h-5 w-5" />}
        description="Maximum occupancy"
      />
    </div>
  );

  return <div></div>;
};

export default RoomsStats;
