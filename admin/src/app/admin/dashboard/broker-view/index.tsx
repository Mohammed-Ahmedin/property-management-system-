"use client";

import React from "react";
import { useGetBrokerDashboardStats } from "@/hooks/api/use-dashboard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Hotel, Bed, Calendar } from "lucide-react";

const BrokerView = () => {
  const { data, isFetching, error } = useGetBrokerDashboardStats();

  if (isFetching) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="w-full aspect-video" />
          <Skeleton className="w-full aspect-video" />
          <Skeleton className="w-full aspect-video" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <p className="text-muted-foreground">Failed to load dashboard.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 px-4">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Properties</CardTitle>
            <Hotel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.propertiesCount ?? 0}</div>
            <p className="text-xs text-muted-foreground">Assigned properties</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rooms</CardTitle>
            <Bed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.roomsCount ?? 0}</div>
            <p className="text-xs text-muted-foreground">Total rooms</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.bookingsCount ?? 0}</div>
            <p className="text-xs text-muted-foreground">Total bookings</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BrokerView;
