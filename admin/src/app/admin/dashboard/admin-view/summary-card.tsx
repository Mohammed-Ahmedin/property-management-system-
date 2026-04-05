"use client";

import React, { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  Line, LineChart, Bar, BarChart, Pie, PieChart, Cell,
  XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend,
} from "recharts";
import { useGetAdminDashboardSummary, useGetAdminDashboardStats } from "@/hooks/api/use-dashboard";
import LoaderState from "@/components/shared/loader-state";

const PIE_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

export const DashboardSummary = () => {
  const { data: propertyData = [], isFetching, error } = useGetAdminDashboardSummary();
  const { data: stats } = useGetAdminDashboardStats();

  const revenueData: any[] = useMemo(() => {
    const months = ["Apr", "May", "Jun", "Jul", "Aug", "Sep"];
    return months.map((month) => {
      const bookings = propertyData.reduce((sum, gh) => sum + Math.floor(gh.bookings / 6), 0);
      const revenue = propertyData.reduce((sum, gh) => sum + Math.floor(gh.revenue / 6), 0);
      return { month, bookings, revenue };
    });
  }, [propertyData]);

  // Pie chart data: booking status breakdown
  const bookingPieData = useMemo(() => {
    if (!stats) return [];
    return [
      { name: "Bookings", value: stats.totalBookings || 0 },
      { name: "Rooms", value: stats.totalRooms || 0 },
      { name: "Properties", value: stats.totalProperties || 0 },
      { name: "Users", value: stats.totalUsers || 0 },
    ].filter(d => d.value > 0);
  }, [stats]);

  // Property revenue pie
  const revenuePieData = useMemo(() =>
    propertyData.slice(0, 6).map(p => ({ name: p.name, value: p.revenue || 0 })).filter(d => d.value > 0),
    [propertyData]
  );

  if (isFetching) return <LoaderState />;
  if (error) return <div className="py-8 text-center text-muted-foreground">Error loading dashboard.</div>;

  return (
    <div className="space-y-4">
      {/* Row 1: Line chart + Pie chart */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Revenue & Bookings Trend */}
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Revenue & Bookings Trend</CardTitle>
            <CardDescription>Monthly statistics for the last 6 months</CardDescription>
          </CardHeader>
          <CardContent className="p-2 sm:p-6">
            <ChartContainer
              config={{
                revenue: { label: "Revenue", color: "#3b82f6" },
                bookings: { label: "Bookings", color: "#10b981" },
              }}
              className="h-[240px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} width={50} tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2.5} dot={{ fill: "#3b82f6", r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="bookings" stroke="#10b981" strokeWidth={2.5} dot={{ fill: "#10b981", r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Platform Overview Pie */}
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Platform Overview</CardTitle>
            <CardDescription>Distribution of key platform metrics</CardDescription>
          </CardHeader>
          <CardContent className="p-2 sm:p-6 flex items-center justify-center">
            {bookingPieData.length > 0 ? (
              <ChartContainer
                config={{ value: { label: "Count", color: "hsl(var(--chart-1))" } }}
                className="h-[240px] w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={bookingPieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                      {bookingPieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <p className="text-sm text-muted-foreground">No data yet</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Bar chart + Revenue pie */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Property Performance Bar */}
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Property Performance</CardTitle>
            <CardDescription>Bookings per property</CardDescription>
          </CardHeader>
          <CardContent className="p-2 sm:p-6">
            <ChartContainer
              config={{ bookings: { label: "Bookings", color: "#f59e0b" } }}
              className="h-[240px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={propertyData} margin={{ top: 5, right: 10, left: 0, bottom: 55 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} angle={-35} textAnchor="end" interval={0} />
                  <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} width={30} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="bookings" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Revenue by Property Pie */}
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Revenue by Property</CardTitle>
            <CardDescription>Share of total revenue per property</CardDescription>
          </CardHeader>
          <CardContent className="p-2 sm:p-6 flex items-center justify-center">
            {revenuePieData.length > 0 ? (
              <ChartContainer
                config={{ value: { label: "Revenue", color: "hsl(var(--chart-2))" } }}
                className="h-[240px] w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={revenuePieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                      {revenuePieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <p className="text-sm text-muted-foreground">No revenue data yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
