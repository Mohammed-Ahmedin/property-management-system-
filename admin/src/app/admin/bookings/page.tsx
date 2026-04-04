"use client";

import Link from "next/link";
import { BookingsTable } from "./booking-table";
import { Button } from "@/components/ui/button";
import { useGetBookings } from "@/hooks/api/use-bookings";
import LoaderState from "@/components/shared/loader-state";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import StaffStatsCards from "./stats-cards";
import { Calendar } from "lucide-react";
import { useAuthSession } from "@/hooks/use-auth-session";

export default function BookingsPage() {
  const bookingsQuery = useGetBookings();
  const { role } = useAuthSession();
  const isAdmin = role === "ADMIN";

  return (
    <div className="min-h-screen bg-background">
      <main className="w-full px-3 sm:px-4 py-4">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h1 className="text-xl font-bold">Bookings</h1>
          {!isAdmin && (
            <Link href={"/admin/bookings/manual-booking"}>
              <Button size="sm">Manual booking</Button>
            </Link>
          )}
        </div>
        <StaffStatsCards />
        {bookingsQuery.isLoading ? (
          <LoaderState />
        ) : bookingsQuery?.data?.length === 0 ? (
          <div className="flex justify-center items-center mt-20">
            <EmptyState icon={<Calendar size={40} />} title="No Bookings Found" description="No bookings yet." />
          </div>
        ) : bookingsQuery.isError || !bookingsQuery?.data ? (
          <ErrorState title="Something went wrong" primaryActions={<Button onClick={() => bookingsQuery.refetch()}>Refresh</Button>} />
        ) : (
          bookingsQuery?.data && <BookingsTable bookings={bookingsQuery?.data} />
        )}
      </main>
    </div>
  );
}
