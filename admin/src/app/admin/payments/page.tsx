"use client";

import LoaderState from "@/components/shared/loader-state";
import { useGetPayments, useGetSubaccounts } from "@/hooks/api/use-payment";
import { PaymentTable } from "./payments-table";
import StatsCards from "./stats-cards";

export default function RegistrationRequestsPage() {
  const { data, isFetching, error } = useGetPayments();

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
    <div className="min-h-screen bg-background">
      <StatsCards />
      
      <main className="container mx-auto px-6 py-8">
        <div className="mt-8">
          <PaymentTable payments={data as any} />
        </div>
      </main>
    </div>
  );
}
