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
  discountPercent?: number;
  property?: { discountPercent?: number };
}

interface BookingCardProps {
  room: Room;
  onBookingClick: () => void;
  handleOpenBookingModal: () => void;
  isPrivate?: boolean;
}

export default function BookingCard({ room, handleOpenBookingModal, isPrivate }: BookingCardProps) {
  const pd = room.property?.discountPercent ?? 0;
  const rd = room.discountPercent ?? 0;
  const afterProp = pd > 0 ? room.price * (1 - pd / 100) : room.price;
  const effective = rd > 0 ? afterProp * (1 - rd / 100) : afterProp;
  const effectiveRounded = Math.round(effective * 100) / 100;
  const hasDiscount = effectiveRounded < room.price;
  const totalPct = pd + rd - (pd * rd / 100);

  return (
    <div className="sticky top-20 rounded-2xl border border-border bg-card shadow-lg overflow-hidden">
      <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-5">
        <p className="text-xs opacity-70 mb-1">Price per night</p>
        {hasDiscount ? (
          <div>
            <p className="text-sm line-through opacity-60">ETB {room.price.toLocaleString()}</p>
            <FormatedAmount amount={effectiveRounded} className="text-3xl font-bold text-white" />
            <span className="mt-1 inline-block text-xs bg-red-500/30 text-red-100 px-2 py-0.5 rounded-full font-semibold">
              🏷️ {Math.round(totalPct)}% off
            </span>
          </div>
        ) : (
          <FormatedAmount amount={room.price} className="text-3xl font-bold text-white" />
        )}
        <div className={cn("mt-2 inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full",
          room.availability ? "bg-green-500/20 text-green-100" : "bg-red-500/20 text-red-100")}>
          <span className={cn("w-1.5 h-1.5 rounded-full", room.availability ? "bg-green-300" : "bg-red-300")} />
          {room.availability ? "Available now" : "Not available"}
        </div>
      </div>

      <div className="p-5 space-y-4">
        <div className="space-y-2 text-sm">
          {!isPrivate && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Max occupancy</span>
              <span className="font-medium">{room.maxOccupancy} guests</span>
            </div>
          )}
          {hasDiscount && (
            <div className="flex justify-between text-emerald-600 dark:text-emerald-400 text-xs">
              <span>You save per night</span>
              <span className="font-semibold">ETB {(room.price - effectiveRounded).toLocaleString()}</span>
            </div>
          )}
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
