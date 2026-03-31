"use client";

import StaffStatsCards from "./stats-cards";

export default function StaffView() {
  return (
    <div className="min-h-screen bg-background">
      <div className="px-4 py-8 mx-auto max-w-7xl">
        <StaffStatsCards />
      </div>
    </div>
  );
}
