"use client";
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, Home, UserCog, Calendar, Bed, CreditCard, TrendingUp, ArrowUpRight } from "lucide-react";
import FormatedAmount from "@/components/shared/formatted-amount";
import { useGetAdminDashboardStats } from "@/hooks/api/use-dashboard";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const STAT_CARDS = [
  {
    key: "totalUsers",
    label: "Total Users",
    icon: Users,
    gradient: "from-blue-500 to-blue-600",
    bg: "bg-blue-50 dark:bg-blue-900/20",
    text: "text-blue-600 dark:text-blue-400",
    sub: (d: any) => `+12% from last month`,
    trend: true,
  },
  {
    key: "totalProperties",
    label: "Properties",
    icon: Home,
    gradient: "from-emerald-500 to-emerald-600",
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    text: "text-emerald-600 dark:text-emerald-400",
    sub: () => "3 new this quarter",
    trend: false,
  },
  {
    key: "totalAdmins",
    label: "Admins",
    icon: UserCog,
    gradient: "from-purple-500 to-purple-600",
    bg: "bg-purple-50 dark:bg-purple-900/20",
    text: "text-purple-600 dark:text-purple-400",
    sub: (d: any) => `${d?.activeAdmins ?? 0} active now`,
    trend: false,
  },
  {
    key: "totalBookings",
    label: "Bookings",
    icon: Calendar,
    gradient: "from-amber-500 to-orange-500",
    bg: "bg-amber-50 dark:bg-amber-900/20",
    text: "text-amber-600 dark:text-amber-400",
    sub: () => "+23 this week",
    trend: true,
  },
  {
    key: "totalRooms",
    label: "Rooms",
    icon: Bed,
    gradient: "from-pink-500 to-rose-500",
    bg: "bg-pink-50 dark:bg-pink-900/20",
    text: "text-pink-600 dark:text-pink-400",
    sub: () => "92% occupancy rate",
    trend: false,
  },
  {
    key: "totalTransactions",
    label: "Transactions",
    icon: CreditCard,
    gradient: "from-indigo-500 to-indigo-600",
    bg: "bg-indigo-50 dark:bg-indigo-900/20",
    text: "text-indigo-600 dark:text-indigo-400",
    sub: (d: any) => `ETB ${(d?.avgPaymentValue ?? 0).toLocaleString()} avg`,
    trend: false,
    isAmount: false,
  },
];

export default function DashboardStats() {
  const { data, isFetching, error } = useGetAdminDashboardStats();

  if (isFetching) return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-28 w-full rounded-2xl" />)}
    </div>
  );

  if (error) return <p className="text-sm text-destructive">Error loading stats.</p>;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {STAT_CARDS.map(({ key, label, icon: Icon, gradient, bg, text, sub, trend }) => (
        <Card key={key} className="group relative overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 border border-border">
          {/* Gradient accent top bar */}
          <div className={cn("absolute top-0 left-0 right-0 h-1 bg-gradient-to-r", gradient)} />
          <CardContent className="p-5 pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium mb-1">{label}</p>
                <p className="text-3xl font-bold tracking-tight">{(data as any)?.[key] ?? 0}</p>
              </div>
              <div className={cn("p-2.5 rounded-xl", bg)}>
                <Icon className={cn("h-5 w-5", text)} />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
              {trend && <TrendingUp className="h-3 w-3 text-emerald-500" />}
              <span>{sub(data)}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
