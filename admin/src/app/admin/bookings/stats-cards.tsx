"use client";

import FormatedAmount from "@/components/shared/formatted-amount";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetBookingsStats } from "@/hooks/api/use-bookings";
import { Building2, Calendar, DollarSign, TrendingUp } from "lucide-react";

export default function StaffStatsCards() {
  const { data, isFetching } = useGetBookingsStats();

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
        <div className="flex-1 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Total Bookings */}
          <Card className="min-w-[280px] snap-start md:min-w-0 ">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Bookings
              </CardTitle>
              <Calendar className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data?.totalBookings}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Total bookings recorded
              </p>
            </CardContent>
          </Card>

          {/* Upcoming Bookings */}
          <Card className="min-w-[280px] snap-start md:min-w-0">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Upcoming Bookings
              </CardTitle>
              <Calendar className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data?.upcomingBookings}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Bookings starting soon
              </p>
            </CardContent>
          </Card>

          {/* Past Bookings */}
          <Card className="min-w-[280px] snap-start md:min-w-0">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Past Bookings
              </CardTitle>
              <Calendar className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data?.pastBookings}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Completed bookings
              </p>
            </CardContent>
          </Card>

          {/* Total Guests */}
          <Card className="min-w-[280px] snap-start md:min-w-0">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Guests
              </CardTitle>
              <Building2 className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data?.totalGuests}</div>
              <p className="text-xs text-muted-foreground mt-1">
                All guests across bookings
              </p>
            </CardContent>
          </Card>

          {/* Total Revenue */}
          <Card className="min-w-[280px] snap-start md:min-w-0">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Revenue
              </CardTitle>
              <DollarSign className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <FormatedAmount
                amount={data?.totalRevenue as any}
                className="text-2xl font-bold"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Generated from bookings
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
