"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BookingCard } from "./booking-card";
import { mockBookings } from "@/const/mocks";
import { useGetUserBookings } from "@/hooks/api/use-bookings";
import { EmptyState } from "@/components/shared/empty-state";
// import DataContainer from "./data-container";
import { ErrorState } from "@/components/shared/error-state";
import LoaderState from "@/components/shared/loader-state";

export default function BookingsPage() {
  const dataQuery = useGetUserBookings();

  const renderData = () => {
    if (dataQuery.isLoading || dataQuery.isFetching) {
      return (
        <div className="">
          <LoaderState />
        </div>
      );
    }

    if (dataQuery.isError || !dataQuery.data?.data) {
      return (
        <div>
          <ErrorState
            title="Loading your bookings..."
            description="Please wait while we connect to the server. This may take a moment."
            refetch={dataQuery.refetch}
          />
        </div>
      );
    }

    if (dataQuery.data?.data.length === 0) {
      return (
        <div className="flex justify-center items-center h-[70dvh]">
          <EmptyState
            title="No bookings yet"
            description="You don’t have any bookings at the moment. Once you make a booking, it will appear here."
          />
        </div>
      );
    }

    return (
      <>
        {dataQuery.data.data.map((booking) => {
          return (
            <>
              <BookingCard key={booking.id} booking={booking as any} />
            </>
          );
        })}

        {/* <DataContainer data={dataQuery.data?.data} /> */}
      </>
    );
  };
  return (
    <div className="min-h-screen bg-background p-3 c-px">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl font-bold tracking-tight mb-2">Your Bookings</h1>
      </div>
      {renderData()}
    </div>
  );
}
