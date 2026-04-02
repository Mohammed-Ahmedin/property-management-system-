"use client";
import { Button } from "@/components/ui/button";
import FormatedAmount from "@/components/shared/formatted-amount";
import { Shield, Clock, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

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

export default function BookingCard({ room, handleOpenBookingModal }: BookingCardProps) {
  return (
    <div className="sticky top-20 rounded-2xl border border-border bg-card shadow-lg overflow-hidden">
      {/* Price header */}
      <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-5">
        <p className="text-xs opacity-70 mb-1">Price per night</p>
        <FormatedAmount amount={room.price} className="text-3xl font-bold text-white" />
        <div className={cn("mt-2 inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full",
          room.availability ? "bg-green-500/20 text-green-100" : "bg-red-500/20 text-red-100")}>
          <span className={cn("w-1.5 h-1.5 rounded-full", room.availability ? "bg-green-300" : "bg-red-300")} />
          {room.availability ? "Available now" : "Not available"}
        </div>
      </div>

      <div className="p-5 space-y-4">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Max occupancy</span>
            <span className="font-medium">{room.maxOccupancy} guests</span>
          </div>
        </div>

        <Button size="lg" className="w-full rounded-xl font-bold h-11" onClick={handleOpenBookingModal}>
          Book Now
        </Button>

        <p className="text-center text-xs text-muted-foreground">You won't be charged yet</p>

        <div className="pt-3 border-t border-border space-y-2">
          {[
            { icon: <Shield className="w-3.5 h-3.5 text-primary" />, text: "Free cancellation" },
            { icon: <Clock className="w-3.5 h-3.5 text-primary" />, text: "Instant confirmation" },
            { icon: <CheckCircle2 className="w-3.5 h-3.5 text-primary" />, text: "Secure booking" },
          ].map(({ icon, text }) => (
            <div key={text} className="flex items-center gap-2 text-xs text-muted-foreground">
              {icon}<span>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
