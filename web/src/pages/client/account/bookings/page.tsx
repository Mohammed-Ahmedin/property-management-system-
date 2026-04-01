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

  const renderData = () => {
    if (dataQuery.isLoading || dataQuery.isFetching || dataQuery.isRefetching) {
      return (
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
          <LoaderState />
          <p className="text-sm text-muted-foreground">Loading your bookings, please wait...</p>
        </div>
      );
    }

    if (dataQuery.isError || !dataQuery.data?.data) {
      return (
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4 text-center px-4">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-1">Connecting to server...</h3>
            <p className="text-sm text-muted-foreground mb-4">
              The server is waking up. This usually takes 30-60 seconds.
            </p>
            {countdown > 0 ? (
              <p className="text-sm text-primary font-medium">Retrying in {countdown}s...</p>
            ) : (
              <Button onClick={() => { setCountdown(10); dataQuery.refetch(); }} variant="default">
                Retry now
              </Button>
            )}
          </div>
        </div>
      );
    }

    if (dataQuery.data?.data.length === 0) {
      return (
        <div className="flex justify-center items-center h-[70dvh]">
          <EmptyState
            title="No bookings yet"
            description="You don't have any bookings at the moment. Once you make a booking, it will appear here."
          />
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-4">
        {dataQuery.data.data.map((booking) => (
          <BookingCard key={booking.id} booking={booking as any} />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background p-3 c-px">
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl font-bold tracking-tight mb-2">Your Bookings</h1>
      </div>
      {renderData()}
    </div>
  );
}
