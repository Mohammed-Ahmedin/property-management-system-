"use client";

import React, { useEffect } from "react";
import { useGetNearbyProperties } from "@/hooks/api/use-properties";
import LoaderState from "@/components/shared/loader-state";
import { ErrorState } from "@/components/shared/error-state";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PropertyCard } from "@/components/shared/property-card";
import { Spinner } from "@/components/ui/spinner";
import { NearbyEmptyState } from "./empty-view";

interface NearbyContainerProps {
  lat: number;
  lon: number;
  radius?: number;
  page?: number;
  limit?: number;
}

const NearbyContainer: React.FC<NearbyContainerProps> = ({
  lat,
  lon,
  radius = 10,
  page = 1,
  limit = 10,
}) => {
  const [searchParams] = useSearchParams();
  const currentDistance = searchParams.get("distance") || "10";

  const dataQuery = useGetNearbyProperties({
    lat,
    lon,
    radius,
    page,
    limit,
    distance: +currentDistance,
  });

  useEffect(() => {
    dataQuery.refetch();
  }, [currentDistance]);

  const navigate = useNavigate();

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
            title="Something went wrong, please try again"
            refetch={dataQuery.refetch}
          />
        </div>
      );
    }

    if (dataQuery.data?.data.length === 0) {
      return (
        <div className="h-[70dvh] flex justify-center items-center">
          <NearbyEmptyState />
        </div>
      );
    }

    if (dataQuery.data?.data) {
      return (
        <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {dataQuery.isFetching && (
            <div className="w-full h-full bg-black/10 z-[999] fixed top-0 left-0 right-0 bottom-0 backdrop-blur-sm flex justify-center items-center">
              <Spinner scale={2} className="size-12" />
            </div>
          )}

          {dataQuery.data.data.map((d) => {
            return (
              <PropertyCard
                data={d}
                key={d.id}
                view="vertical"
                distance={d.distance}
              />
            );
          })}
        </div>
      );
    }
  };

  return renderData();
};

export default NearbyContainer;
