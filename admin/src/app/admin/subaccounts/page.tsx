"use client";

import LoaderState from "@/components/shared/loader-state";
import { useGetSubaccounts } from "@/hooks/api/use-payment";
import { SubaccountTable } from "./subaccounts-table";

export default function RegistrationRequestsPage() {
  const { data, isFetching, error } = useGetSubaccounts();

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
          <div className="mt-8">
            <SubaccountTable subaccounts={data as any} />
          </div>
        </main>
      </div>
    </div>
  );
}
