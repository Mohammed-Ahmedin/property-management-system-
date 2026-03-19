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
      <Card>
        <CardHeader>
          <CardTitle>Revenue & Bookings Trend</CardTitle>
          <CardDescription>
            Monthly revenue and booking statistics for the last 6 months
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              revenue: { label: "Revenue", color: "hsl(var(--chart-1))" },
              bookings: { label: "Bookings", color: "hsl(var(--chart-2))" },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
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
      <Card>
        <CardHeader>
          <CardTitle>Property Performance</CardTitle>
          <CardDescription>
            Top performing properties by bookings and revenue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              bookings: { label: "Bookings", color: "hsl(var(--chart-3))" },
              revenue: { label: "Revenue", color: "hsl(var(--chart-4))" },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={propertyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="name"
                  className="text-xs"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis className="text-xs" />
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
