"use client";

import { BookingCard } from "./booking-card";
import { useGetUserBookings } from "@/hooks/api/use-bookings";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function BookingsPage() {
  const dataQuery = useGetUserBookings();

  return (
    <div className="min-h-screen bg-background p-3 c-px">
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl font-bold tracking-tight mb-2">Your Bookings</h1>
      </div>

      {dataQuery.isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : dataQuery.isError || !dataQuery.data?.data ? (
        <div className="flex flex-col items-center gap-4 py-12 text-center">
          <p className="text-muted-foreground">Failed to load bookings.</p>
          <Button onClick={() => dataQuery.refetch()} variant="outline" size="sm">Retry</Button>
        </div>
      ) : dataQuery.data.data.length === 0 ? (
        <EmptyState
          title="No bookings yet"
          description="You don't have any bookings at the moment. Once you make a booking, it will appear here."
        />
      ) : (
        <div className="flex flex-col gap-4">
          {dataQuery.data.data.map((booking) => (
            <BookingCard key={booking.id} booking={booking as any} />
          ))}
        </div>
      )}
    </div>
  );
}
