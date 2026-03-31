import type React from "react";
import { Users, Maximize2, Wifi, Wind, Tv, Droplet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FormatedAmount from "@/components/shared/formatted-amount";
import RoomFeatures from "./room-features";
import { format, addDays } from "date-fns";

interface Feature {
  id: string;
  name: string;
  category: string | null;
  value: string | null;
}

interface BookedRange {
  checkIn: string | Date;
  checkOut: string | Date;
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
  bookings?: BookedRange[];
}

const categoryIcons: Record<string, React.ReactNode> = {
  connectivity: <Wifi className="h-5 w-5" />,
  climate: <Wind className="h-5 w-5" />,
  entertainment: <Tv className="h-5 w-5" />,
  comfort: <Droplet className="h-5 w-5" />,
};

export default function RoomDetails({ room }: { room: Room }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Find the next available date after all booked ranges
  const activeBookings = (room.bookings || []).filter(
    (b) => b.checkIn && b.checkOut && new Date(b.checkOut) >= today
  );

  // Sort by checkOut descending to find the latest checkout
  const latestCheckout = activeBookings.reduce<Date | null>((latest, b) => {
    const co = new Date(b.checkOut);
    return !latest || co > latest ? co : latest;
  }, null);

  const nextAvailableDate = latestCheckout ? addDays(latestCheckout, 1) : null;

  // Collect all booked ranges for display
  const bookedRangesDisplay = activeBookings.map((b) => ({
    from: format(new Date(b.checkIn), "MMM d"),
    to: format(new Date(b.checkOut), "MMM d, yyyy"),
  }));

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-2 inline-block rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
          {room.type}
        </div>
        <h1 className="text-2xl font-bold text-foreground lg:text-4xl">
          {room.name}
        </h1>
        <FormatedAmount amount={room.price} suffix="/night" className="text-xl" />
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Maximize2 className="h-4 w-4" />
            <span>{room.squareMeters} sqm</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Up to {room.maxOccupancy} guests</span>
          </div>
          <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 ${
            room.availability
              ? "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200"
              : "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200"
          }`}>
            <span className={`h-2 w-2 rounded-full ${room.availability ? "bg-green-600" : "bg-red-600"}`} />
            {room.availability ? "Available" : "Not Available"}
          </div>
        </div>

        {/* Availability details */}
        {!room.availability && bookedRangesDisplay.length > 0 && (
          <div className="mt-3 space-y-1">
            {bookedRangesDisplay.map((r, i) => (
              <p key={i} className="text-sm text-red-600 dark:text-red-400 font-medium">
                Not available: {r.from} – {r.to}
              </p>
            ))}
            {nextAvailableDate && (
              <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                Available from {format(nextAvailableDate, "MMM d, yyyy")} onwards
              </p>
            )}
          </div>
        )}
      </div>

      {room.description && (
        <div className="flex flex-col gap-2">
          <h1 className="text-lg font-semibold">About this room</h1>
          <p className="leading-relaxed text-muted-foreground text-sm">{room.description}</p>
        </div>
      )}

      <RoomFeatures features={room.features} />
    </div>
  );
}
