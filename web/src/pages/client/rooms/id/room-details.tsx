import type React from "react";
import { Users, Maximize2, Wifi, Wind, Tv, Droplet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FormatedAmount from "@/components/shared/formatted-amount";
import RoomFeatures from "./room-features";

interface Feature {
  id: string;
  name: string;
  category: string | null;
  value: string | null;
}

interface Room {
  name: string;
  description: string | null;
  type: string;
  squareMeters: number;
  maxOccupancy: number;
  features: Feature[];
  price: any;
  availability: boolean;
}

const categoryIcons: Record<string, React.ReactNode> = {
  connectivity: <Wifi className="h-5 w-5" />,
  climate: <Wind className="h-5 w-5" />,
  entertainment: <Tv className="h-5 w-5" />,
  comfort: <Droplet className="h-5 w-5" />,
};

export default function RoomDetails({ room }: { room: Room }) {
  return (
    <div className="space-y-6">
      {/* Room Header */}
      {/* Image counter
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 rounded-full bg-black/50 px-4 py-2 text-sm text-white">
            {currentImageIndex + 1} / {images.length}
          </div>
        )} */}
      <div>
        <div className="mb-2 inline-block rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
          {room.type}
        </div>
        <h1 className="text-2xl font-bold text-foreground lg:text-4xl">
          {room.name}
        </h1>
        <FormatedAmount
          amount={room.price}
          suffix="/night"
          className="text-xl"
        />
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Maximize2 className="h-4 w-4" />
            <span>{room.squareMeters} sqm</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Up to {room.maxOccupancy} guests</span>
          </div>
          <div
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 ${
              room.availability
                ? "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200"
                : "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                room.availability ? "bg-green-600" : "bg-red-600"
              }`}
            />
            {room.availability ? "Available" : "Not Available"}
          </div>
        </div>
      </div>

      {/* Description */}
      {room.description && (
        <div className="flex flex-col gap-2">
          <h1 className="text-lg font-semibold">About this room</h1>
          <p className="leading-relaxed text-muted-foreground text-sm">
            {room.description}
          </p>
        </div>
      )}

      {/* Features */}
      <RoomFeatures features={room.features} />
    </div>
  );
}
