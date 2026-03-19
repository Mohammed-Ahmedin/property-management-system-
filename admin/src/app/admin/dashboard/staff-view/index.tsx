"use client";

import { BookingsTrendChart } from "./bookings-trend-chart";
import { RevenuePerRoomChart } from "./revenue-per-room-chart";
import { RecentActivitiesTable } from "./recent-bookings-table";
import StaffStatsCards from "./stats-cards";

export default function StaffView() {
  return (
    <div className="min-h-screen bg-background">
      <div className="px-4 py-8 mx-auto max-w-7xl">
        {/* Summary Cards */}
        <StaffStatsCards />

        {/* Charts Section */}
        {/* <div className="grid gap-6 mb-8 lg:grid-cols-2">
          <BookingsTrendChart />
          <RevenuePerRoomChart />
        </div> */}

        {/* Recent Activities Table */}
        <RecentActivitiesTable />
      </div>
    </div>
  );
}
