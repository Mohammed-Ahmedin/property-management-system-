"use client";

import { StatsCards } from "./stats-cards";
import { RegistrationTable } from "./registrations-table";
import { useGetRegistrationRequestsQuery } from "@/hooks/api/use-registration-request";
import LoaderState from "@/components/shared/loader-state";

export default function RegistrationRequestsPage() {
  const { data, isFetching, error, refetch } = useGetRegistrationRequestsQuery();

  if (isFetching) return <LoaderState />;

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-6 py-8">
        <StatsCards />
        <div className="mt-8">
          <RegistrationTable registrations={Array.isArray(data) ? data as any : []} />
        </div>
      </main>
    </div>
  );
}
