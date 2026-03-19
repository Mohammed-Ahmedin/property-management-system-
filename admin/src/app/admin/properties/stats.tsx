"use client";

import React from "react";
import { Building2, Loader, DoorOpen, Calendar1Icon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetPropertyStats } from "@/hooks/api/use-property";
import { StatsCard } from "../rooms/stats-card";
import { useAuthSession } from "@/hooks/use-auth-session";

const PropertyStats = () => {
  const { role } = useAuthSession();
  const canAccess = !!role && role !== "GUEST";

  const { isFetching, data } = useGetPropertyStats(canAccess);

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

  if (!data) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatsCard
        title="Total Properties"
        value={data.totalProperties}
        icon={<Building2 className="h-5 w-5" />}
        description="All properties in the system"
      />
      <StatsCard
        title="Approved Properties"
        value={data.approvedProperties}
        icon={<DoorOpen className="h-5 w-5" />}
        description="Ready for bookings"
        variant="success"
      />
      <StatsCard
        title="Pending Properties"
        value={data.pendingProperties}
        icon={<Loader className="h-5 w-5" />}
        description="Awaiting approval"
        variant="warning"
      />
      <StatsCard
        title="Total Rooms"
        value={data.totalRooms}
        icon={<Calendar1Icon className="h-5 w-5" />}
        description="All rooms across properties"
      />
    </div>
  );
};

export default PropertyStats;
