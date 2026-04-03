"use client";

import React, { useEffect, useState } from "react";
import { useGetNearbyProperties } from "@/hooks/api/use-properties";
import LoaderState from "@/components/shared/loader-state";
import { ErrorState } from "@/components/shared/error-state";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PropertyCard } from "@/components/shared/property-card";
import { Spinner } from "@/components/ui/spinner";
import { NearbyEmptyState } from "./empty-view";
import { MapPin, List, Map as MapIcon, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";

interface NearbyContainerProps {
  lat: number;
  lon: number;
  radius?: number;
  page?: number;
  limit?: number;
}

const NearbyContainer: React.FC<NearbyContainerProps> = ({ lat, lon, radius = 10, page = 1, limit = 10 }) => {
  const [searchParams] = useSearchParams();
  const [view, setView] = useState<"list" | "map">("list");
  const currentDistance = searchParams.get("distance") || "10";

  const dataQuery = useGetNearbyProperties({ lat, lon, radius, page, limit, distance: +currentDistance });

  useEffect(() => { dataQuery.refetch(); }, [currentDistance]);

  const properties = dataQuery.data?.data || [];
  // Properties that have lat/lon
  const mappable = properties.filter((p: any) => p.location?.latitude && p.location?.longitude);

  if (dataQuery.isLoading) return <LoaderState />;
  if (dataQuery.isError || !dataQuery.data?.data) return <ErrorState title="Something went wrong" refetch={dataQuery.refetch} />;
  if (properties.length === 0) return <div className="h-[70dvh] flex justify-center items-center"><NearbyEmptyState /></div>;

  return (
    <div>
      {dataQuery.isFetching && (
        <div className="w-full h-full bg-black/10 z-[999] fixed inset-0 backdrop-blur-sm flex justify-center items-center">
          <Spinner scale={2} className="size-12" />
        </div>
      )}

      {/* View toggle + count */}
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{properties.length}</span> properties within {currentDistance}km
          {mappable.length > 0 && <span className="ml-2 text-primary">· {mappable.length} on map</span>}
        </p>
        {mappable.length > 0 && (
          <div className="flex items-center gap-1 bg-muted rounded-xl p-1">
            <button onClick={() => setView("list")}
              className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                view === "list" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}>
              <List className="w-3.5 h-3.5" /> List
            </button>
            <button onClick={() => setView("map")}
              className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                view === "map" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}>
              <MapIcon className="w-3.5 h-3.5" /> Map
            </button>
          </div>
        )}
      </div>

      {/* Map view */}
      {view === "map" && mappable.length > 0 && (
        <div className="mb-6 rounded-2xl overflow-hidden border border-border shadow-lg">
          <div className="bg-muted/50 p-3 border-b border-border flex items-center gap-2">
            <Navigation className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Properties near you</span>
            <span className="text-xs text-muted-foreground ml-auto">Your location: {lat.toFixed(4)}, {lon.toFixed(4)}</span>
          </div>
          {/* OpenStreetMap embed via iframe */}
          <iframe
            title="Nearby Properties Map"
            className="w-full h-[400px]"
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.1},${lat - 0.1},${lon + 0.1},${lat + 0.1}&layer=mapnik&marker=${lat},${lon}`}
            style={{ border: 0 }}
          />
          {/* Property pins list below map */}
          <div className="p-3 bg-background border-t border-border">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {mappable.map((p: any) => (
                <a key={p.id} href={`/properties/${p.id}`}
                  className="shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl bg-muted hover:bg-primary/10 hover:text-primary border border-border transition-colors text-sm">
                  <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span className="font-medium truncate max-w-[120px]">{p.name}</span>
                  {p.distance && <span className="text-xs text-muted-foreground">{p.distance}km</span>}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* List view */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {properties.map((d: any) => (
          <div key={d.id} className="relative">
            <PropertyCard data={d} view="vertical" distance={d.distance} />
            {d.location?.latitude && d.location?.longitude && (
              <div className="absolute top-2 left-2 z-10">
                <span className="flex items-center gap-1 bg-primary text-white text-xs px-2 py-0.5 rounded-full font-medium shadow">
                  <MapPin className="w-2.5 h-2.5" /> On map
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NearbyContainer;
