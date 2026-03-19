"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Users,
  Home,
  UserCog,
  DollarSign,
  Calendar,
  Bed,
  CreditCard,
  TrendingUp,
} from "lucide-react";
import FormatedAmount from "@/components/shared/formatted-amount";
import { useGetAdminDashboardStats } from "@/hooks/api/use-dashboard";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardStats() {
  const { data, isFetching, error } = useGetAdminDashboardStats();

  if (isFetching)
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Skeleton className="w-full aspect-video" />
        <Skeleton className="w-full aspect-video" />
        <Skeleton className="w-full aspect-video" />
        <Skeleton className="w-full aspect-video" />
      </div>
    );

  if (error) return <p>Error loading dashboard.</p>;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data?.totalUsers}</div>
          <p className="text-xs text-muted-foreground">
            <TrendingUp className="inline h-3 w-3 text-green-500" /> +12% from
            last month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Properties
          </CardTitle>
          <Home className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data?.totalProperties}</div>
          <p className="text-xs text-muted-foreground">3 new this quarter</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Admins</CardTitle>
          <UserCog className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data?.totalAdmins}</div>
          <p className="text-xs text-muted-foreground">
            {data?.activeAdmins} active now
          </p>
        </CardContent>
      </Card>

      {/* <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Transactions
          </CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <FormatedAmount
            amount={data?.totalTransactions ?? 0}
            className="text-2xl font-bold"
          />
          <p className="text-xs text-muted-foreground">
            <TrendingUp className="inline h-3 w-3 text-green-500" /> +18.2% from
            last month
          </p>
        </CardContent>
      </Card> */}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data?.totalBookings}</div>
          <p className="text-xs text-muted-foreground">+23 this week</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Rooms</CardTitle>
          <Bed className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data?.totalRooms}</div>
          <p className="text-xs text-muted-foreground">92% occupancy rate</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Success Transactions</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {data?.totalTransactions ?? 0}
          </div>
          <FormatedAmount
            amount={data?.avgPaymentValue ?? 0}
            className="text-xs text-muted"
          />
          {/* <p className="text-xs text-muted-foreground">$ avg value</p> */}
        </CardContent>
      </Card>
    </div>
  );
}
