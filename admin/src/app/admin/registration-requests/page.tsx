"use client";

import { useState } from "react";
import { StatsCards } from "./stats-cards";
import { RegistrationTable } from "./registrations-table";
import { useGetRegistrationRequestsQuery } from "@/hooks/api/use-registration-request";
import LoaderState from "@/components/shared/loader-state";

export default function RegistrationRequestsPage() {
  const { data, isFetching, error } =
    useGetRegistrationRequestsQuery();

  if (isFetching) {
    return <LoaderState />;
  }

  if (error) {
    return (
      <div>
        <p>Somthing went wrong please try again</p>
      </div>
    );
  }
  return (
    <div>
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-6 py-8">
          <StatsCards />
          <div className="mt-8">
            <RegistrationTable registrations={data as any} />
          </div>
        </main>
      </div>
    </div>
  );
}
