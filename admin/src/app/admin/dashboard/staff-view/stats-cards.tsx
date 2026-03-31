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
          <div className="text-2xl font-bold">{staffData?.property?.name || "—"}</div>
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

export default function StaffStatsCards() {
  const { data, isFetching } = useGetStaffDashboardStats();
  const staffData: any = data;

  if (isFetching)
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Skeleton className="w-full aspect-video" />
        <Skeleton className="w-full aspect-video" />
        <Skeleton className="w-full aspect-video" />
        <Skeleton className="w-full aspect-video" />
      </div>
    );

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row gap-4 ">
        {/* Property */}
        <Card className="flex-1 min-w-[280px] snap-start md:min-w-0 bg-accent border-primary">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Property
            </CardTitle>
            <Building2 className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {staffData?.property?.name}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Your assigned property
            </p>
          </CardContent>
        </Card>

        <div className="flex-1 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* My Bookings */}
          <Card className="min-w-[280px] snap-start md:min-w-0 ">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                My Bookings
              </CardTitle>
              <Calendar className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{staffData?.totalRooms}</div>
              <p className="text-xs text-muted-foreground mt-1">Total rooms</p>
            </CardContent>
          </Card>

          {/* Revenue Contribution */}
          <Card className="min-w-[280px] snap-start md:min-w-0">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Revenue Contribution
              </CardTitle>
              <DollarSign className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <FormatedAmount
                amount={staffData?.totalContribution}
                className="text-2xl font-bold"
              />
              <p className="text-xs text-muted-foreground mt-1">
                From your bookings
              </p>
            </CardContent>
          </Card>

          {/* Occupancy Rate */}
          <Card className="min-w-[280px] snap-start md:min-w-0">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Occupancy Rate
              </CardTitle>
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {staffData?.occupancyRate}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Current occupancy level
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
