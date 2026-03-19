"use client";

import Link from "next/link";
import { BookingsTable } from "./booking-table";
import { Button } from "@/components/ui/button";
import { useGetBookings } from "@/hooks/api/use-bookings";
import LoaderState from "@/components/shared/loader-state";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import StaffStatsCards from "./stats-cards";
import { ArrowUpRightIcon, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BookingsPage() {
  const bookingsQuery = useGetBookings();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-4 ">
        <StaffStatsCards />

        <header className=" flex justify-end w-full px-4 py-4">
          <Link href={"/admin/bookings/manual-booking"}>
            <Button>Manual booking</Button>
          </Link>
        </header>
        {bookingsQuery.isLoading ? (
          <LoaderState />
        ) : bookingsQuery?.data?.length === 0 ? (
          <div className="flex justify-center items-center mt-20">
            <EmptyState
              icon={<Calendar size={40} />}
              title="No Bookings Found"
              description="You don't have any bookings yet. Start by creating a booking to see it here."
              primaryActions={
                <Button onClick={() => router.push("/admin/bookings/create")}>
                  Create Booking
                </Button>
              }
              secondaryLink={{
                href: "/docs/bookings",
                label: "Learn how it works",
                icon: <ArrowUpRightIcon className="ml-1 h-4 w-4" />,
              }}
            />
          </div>
        ) : bookingsQuery.isError || !bookingsQuery?.data ? (
          <ErrorState
            title="Some error occur please try again"
            primaryActions={
              <Button onClick={() => bookingsQuery.refetch()}>Refresh</Button>
            }
          />
        ) : (
          bookingsQuery?.data && (
            <>
              <BookingsTable bookings={bookingsQuery?.data} />
            </>
          )
        )}
      </main>
    </div>
  );
}
