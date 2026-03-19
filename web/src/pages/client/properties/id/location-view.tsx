"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MapPin } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface LocationData {
  continent: string;
  country: string;
  city: string;
  subcity: string;
  nearby?: string;
  latitude?: string;
  longitude?: string;
}

interface LocationCardProps {
  location: LocationData;
}

export function LocationCard({ location }: LocationCardProps) {
  const [open, setOpen] = useState(false);

  const hasCoords =
    location.latitude &&
    location.longitude &&
    !isNaN(Number(location.latitude)) &&
    !isNaN(Number(location.longitude));

  return (
    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" /> Location
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        <p>
          <span className="font-medium">Continent - </span>{" "}
          {location.continent}
        </p>
        <p>
          <span className="font-medium">Country - </span> {location.country}
        </p>
        <p>
          <span className="font-medium">City - </span> {location.city}
        </p>
        <p>
          <span className="font-medium">Subcity - </span> {location.subcity}
        </p>
        {location.nearby && (
          <p>
            <span className="font-medium">Nearby - </span> {location.nearby}
          </p>
        )}

        {hasCoords && (
          <div className="pt-3">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                  View on Map
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>
                    Map View — {location.city || location.country}
                  </DialogTitle>
                </DialogHeader>

                <div className="h-[400px] w-full rounded-lg overflow-hidden">
                  <MapContainer
                    center={[
                      parseFloat(location.latitude!),
                      parseFloat(location.longitude!),
                    ]}
                    zoom={13}
                    scrollWheelZoom={true}
                    className="h-full w-full z-0"
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                    />
                    <Marker
                      position={[
                        parseFloat(location.latitude!),
                        parseFloat(location.longitude!),
                      ]}
                    >
                      <Popup>
                        {location.city}, {location.country}
                      </Popup>
                    </Marker>
                  </MapContainer>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
