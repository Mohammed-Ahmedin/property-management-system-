"use client";

import { BookingCard } from "./booking-card";
import { useGetUserBookings } from "@/hooks/api/use-bookings";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Loader2, Calendar } from "lucide-react";

export default function BookingsPage() {
  const dataQuery = useGetUserBookings();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Your Bookings</h1>
            <p className="text-sm text-muted-foreground">Manage all your reservations</p>
          </div>
        </div>

        {dataQuery.isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : dataQuery.isError || !dataQuery.data?.data ? (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <p className="text-muted-foreground">Failed to load bookings.</p>
            <Button onClick={() => dataQuery.refetch()} variant="outline" size="sm">Retry</Button>
          </div>
        ) : dataQuery.data.data.length === 0 ? (
          <div className="flex flex-col items-center py-16">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
              <Calendar className="w-10 h-10 text-muted-foreground opacity-40" />
            </div>
            <h3 className="text-lg font-semibold mb-1">No bookings yet</h3>
            <p className="text-sm text-muted-foreground text-center max-w-xs">
              Once you make a booking, it will appear here.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {dataQuery.data.data.map((booking) => (
              <BookingCard key={booking.id} booking={booking as any} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
