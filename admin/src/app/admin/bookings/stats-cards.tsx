"use client";

import FormatedAmount from "@/components/shared/formatted-amount";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetBookingsStats } from "@/hooks/api/use-bookings";
import { Calendar, Users, DollarSign, Clock, CheckCircle2, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const STAT_CONFIG = [
  { key: "totalBookings", label: "Total Bookings", sub: "Total bookings recorded", icon: Calendar, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20", bar: "bg-blue-500" },
  { key: "upcomingBookings", label: "Upcoming Bookings", sub: "Bookings starting soon", icon: Clock, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20", bar: "bg-amber-500" },
  { key: "pastBookings", label: "Past Bookings", sub: "Completed bookings", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20", bar: "bg-emerald-500" },
  { key: "totalGuests", label: "Total Guests", sub: "All guests across bookings", icon: Users, color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-900/20", bar: "bg-purple-500" },
  { key: "totalRevenue", label: "Total Revenue", sub: "Generated from bookings", icon: DollarSign, color: "text-rose-600", bg: "bg-rose-50 dark:bg-rose-900/20", bar: "bg-rose-500", isAmount: true },
];

export default function StaffStatsCards() {
  const { data, isFetching } = useGetBookingsStats();

  if (isFetching) return (
    <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 mb-6">
      {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-2xl" />)}
    </div>
  );

  return (
    <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 mb-6">
      {STAT_CONFIG.map(({ key, label, sub, icon: Icon, color, bg, bar, isAmount }) => (
        <Card key={key} className="relative overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
          <div className={cn("absolute top-0 left-0 right-0 h-0.5", bar)} />
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <p className="text-xs text-muted-foreground font-medium leading-tight">{label}</p>
              <div className={cn("p-1.5 rounded-lg shrink-0", bg)}>
                <Icon className={cn("h-3.5 w-3.5", color)} />
              </div>
            </div>
            {isAmount ? (
              <FormatedAmount amount={(data as any)?.[key] ?? 0} className="text-lg font-bold" />
            ) : (
              <p className="text-2xl font-bold">{(data as any)?.[key] ?? 0}</p>
            )}
            <p className="text-xs text-muted-foreground mt-1">{sub}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
