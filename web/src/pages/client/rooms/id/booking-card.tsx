"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FormatedAmount from "@/components/shared/formatted-amount";

interface Room {
  id: string;
  name: string;
  price: number;
  availability: boolean;
  maxOccupancy: number;
}

interface BookingCardProps {
  room: Room;
  onBookingClick: () => void;
  handleOpenBookingModal: () => void;
}

export default function BookingCard({
  room,
  onBookingClick,
  handleOpenBookingModal,
}: BookingCardProps) {
  return (
    <Card className="sticky top-20">
      <CardHeader>
        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <FormatedAmount
              amount={room.price}
              suffix="/night"
              className="text-2xl font-bold "
            />
            <span className="text-muted-foreground">/night</span>
          </div>
          <p className="text-sm text-green-600 dark:text-green-400">
            {room.availability ? "✓ Available" : "✗ Not Available"}
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="text-sm">
            <span className="text-muted-foreground">Max Occupancy:</span>
            <span className="ml-2 font-medium">{room.maxOccupancy} Guests</span>
          </div>
        </div>

        <Button
          size="lg"
          className="w-full"
          onClick={() => handleOpenBookingModal()}
          disabled={!room.availability}
        >
          Book Now
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          You won't be charged yet
        </p>
      </CardContent>
    </Card>
  );
}
