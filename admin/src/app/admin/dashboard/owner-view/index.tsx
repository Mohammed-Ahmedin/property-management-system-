"use client";

import DashboardStats from "./stats-card";

export default function OwnerView() {
  return (
    <div className="flex flex-col gap-6 p-6 px-4">
      <DashboardStats />
    </div>
  );
}
