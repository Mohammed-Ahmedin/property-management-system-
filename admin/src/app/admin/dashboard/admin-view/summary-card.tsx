"use client";

import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import FormatedAmount from "@/components/shared/formatted-amount";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Line,
  LineChart,
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useGetAdminDashboardSummary } from "@/hooks/api/use-dashboard";
import LoaderState from "@/components/shared/loader-state";

export const DashboardSummary = () => {
  // Fetch property stats
  const {
    data: propertyData = [],
    isFetching,
    error,
  } = useGetAdminDashboardSummary();

  // Generate revenue & bookings trend for last 6 months
  const revenueData: any[] = useMemo(() => {
    const months = ["Apr", "May", "Jun", "Jul", "Aug", "Sep"];
    return months.map((month) => {
      const bookings = propertyData.reduce(
        (sum, gh) => sum + Math.floor(gh.bookings / 6),
        0
      );
      const revenue = propertyData.reduce(
        (sum, gh) => sum + Math.floor(gh.revenue / 6),
        0
      );
      return { month, bookings, revenue };
    });
  }, [propertyData]);

  if (isFetching) return <LoaderState />;
  if (error)
    return (
      <div className="py-100 grid place-content-center">
        <p>Error loading dashboard.</p>;
      </div>
    );

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Revenue & Bookings Trend */}
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Revenue & Bookings Trend</CardTitle>
          <CardDescription>
            Monthly revenue and booking statistics for the last 6 months
          </CardDescription>
        </CardHeader>
        <CardContent className="p-2 sm:p-6">
          <ChartContainer
            config={{
              revenue: { label: "Revenue", color: "hsl(var(--chart-1))" },
              bookings: { label: "Bookings", color: "hsl(var(--chart-2))" },
            }}
            className="h-[260px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} width={55} tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--color-revenue)"
                  strokeWidth={2}
                  dot={{ fill: "var(--color-revenue)" }}
                />
                <Line
                  type="monotone"
                  dataKey="bookings"
                  stroke="var(--color-bookings)"
                  strokeWidth={2}
                  dot={{ fill: "var(--color-bookings)" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Property Performance */}
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Property Performance</CardTitle>
          <CardDescription>
            Top performing properties by bookings and revenue
          </CardDescription>
        </CardHeader>
        <CardContent className="p-2 sm:p-6">
          <ChartContainer
            config={{
              bookings: { label: "Bookings", color: "hsl(var(--chart-3))" },
              revenue: { label: "Revenue", color: "hsl(var(--chart-4))" },
            }}
            className="h-[260px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={propertyData} margin={{ top: 5, right: 10, left: 0, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                  angle={-35}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} width={35} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="bookings"
                  fill="var(--color-bookings)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};
