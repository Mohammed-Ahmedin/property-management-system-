"use client";

import { RecentActivitiesTable } from "./recent-bookings-table";
import DashboardStats from "./stats-card";
import { DashboardSummary } from "./summary-card";

export default function OwnerView() {
  return (
    <div className="flex flex-col gap-6 p-6 px-4">
      <DashboardStats />

      {/* <DashboardSummary /> */}
      <RecentActivitiesTable />
    </div>
  );
}
