"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetStaffDashboardStats } from "@/hooks/api/use-dashboard";
import { Building2, Bed } from "lucide-react";

export default function StaffStatsCards() {
  const { data, isFetching } = useGetStaffDashboardStats();
  const staffData: any = data;

  if (isFetching)
    return (
      <div className="grid gap-4 md:grid-cols-2 mb-8">
        <Skeleton className="w-full aspect-video" />
        <Skeleton className="w-full aspect-video" />
      </div>
    );

  return (
    <div className="grid gap-4 md:grid-cols-2 mb-8">
      <Card className="bg-accent border-primary">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium text-muted-foreground">Assigned Property</CardTitle>
          <Building2 className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{staffData?.property?.name || "â€”"}</div>
          <p className="text-xs text-muted-foreground mt-1">Your assigned property</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Rooms</CardTitle>
          <Bed className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{staffData?.totalRooms ?? 0}</div>
          <p className="text-xs text-muted-foreground mt-1">Rooms in your property</p>
        </CardContent>
      </Card>
    </div>
  );
}

