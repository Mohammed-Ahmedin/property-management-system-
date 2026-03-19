"use client";

import { useGetSingleBookingDetail } from "@/hooks/api/use-bookings";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import LoaderState from "@/components/shared/loader-state";
import { useParams } from "react-router-dom";
import DataContainer from "./data-container";

export default function BookingDetailPage() {
  const { id } = useParams();
  const dataQuery = useGetSingleBookingDetail({ id: id as any });

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
            title="Somthing went wrong please try again"
            refetch={dataQuery.refetch}
          />
        </div>
      );
    }

    if (!dataQuery.data) {
      return (
        <>
          <EmptyState title="Booking not found" description="" />
        </>
      );
    }

    return <DataContainer data={dataQuery.data?.data} />;
  };
  return (
    <div className="min-h-screen bg-background p-3 c-px">{renderData()}</div>
  );
}
