"use client";

import { useState } from "react";
import { useGetSingleRoom } from "@/hooks/api/use-rooms";
import { useParams } from "react-router-dom";
import DataContainer from "./data-container";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import LoaderState from "@/components/shared/loader-state";

export default function RoomPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { id } = useParams();
  const dataQuery = useGetSingleRoom({ roomId: id! });

  const renderData = () => {
    if (dataQuery.isLoading) {
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

    if (!dataQuery.data?.data) {
      return <EmptyState title="No property available yet" description="" />;
    }

    return (
      <DataContainer
        data={dataQuery.data}
        setIsDialogOpen={setIsDialogOpen}
        isDialogOpen={isDialogOpen}
      />
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {renderData()}

      {/* Padding for fixed button on mobile */}
      <div className="h-20 lg:hidden" />
    </div>
  );
}
