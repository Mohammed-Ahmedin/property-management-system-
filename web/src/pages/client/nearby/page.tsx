"use client";

import React, { useEffect, useState } from "react";
import NearbyContainer from "./data-container";
import { EmptyState } from "@/components/shared/empty-state";
import { useNavigate } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";
import { Select, SelectTrigger } from "@/components/ui/select";
import { DistanceSelect } from "./distance-select";

const NearbyPage = () => {
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        });
      },
      (err) => {
        console.error(err);
        setError("Unable to retrieve your location.");
      }
    );
  }, []);

  return (
    <main className="mt-6 md:mt-16 px-4 sm:px-14 md:px-24">
      <div className="flex  sm:items-center justify-between mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Nearby Properties</h1>
        <DistanceSelect />
      </div>

      {error && (
        <div className="py-32 w-full flex justify-center items-center">
          <EmptyState
            title="Location Access Needed"
            description="We need access to your location to show nearby properties. Please enable location services in your browser or device settings and refresh the page."
          />
        </div>
      )}

      {!location && !error && (
        <div className="w-full h-full bg-black/10 z-[999] fixed top-0 left-0 right-0 bottom-0 backdrop-blur-sm flex justify-center items-center">
          <Spinner scale={2} className="size-12" />
        </div>
      )}

      {location && (
        <>
          <NearbyContainer lat={location.lat} lon={location.lon} radius={10} />
        </>
      )}
    </main>
  );
};

export default NearbyPage;
