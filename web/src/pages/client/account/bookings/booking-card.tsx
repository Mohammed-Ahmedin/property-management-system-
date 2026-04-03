"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, Home, Users, Calendar, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { StatusBadge } from "@/components/status-badge";
import FormatedAmount from "@/components/shared/formatted-amount";
import type { BookingDetailDataResponse } from "@/hooks/api/types/booking.types";

interface BookingCardProps {
  booking: BookingDetailDataResponse;
}

export function BookingCard(data: BookingCardProps) {
  const booking = data.booking;
  const checkIn = new Date(booking.checkIn);
  const checkOut = new Date(booking.checkOut);
  const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

  const statusColor =
    booking.status === "APPROVED" ? "border-l-emerald-500" :
    booking.status === "REJECTED" ? "border-l-red-500" :
    booking.status === "CANCELLED" ? "border-l-gray-400" :
    "border-l-amber-500";

  return (
    <Card className={`overflow-hidden border-l-4 ${statusColor} hover:shadow-md transition-shadow`}>
      <div className="p-4 md:p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base md:text-lg truncate">{booking.property?.name || "Property"}</h3>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
              <MapPin className="w-3 h-3 shrink-0" />
              <span className="truncate">{booking.room?.name || "Room"}</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <StatusBadge status={booking.status} paymentStatus={booking.payment?.status} />
            {booking.payment?.status && booking.payment.status !== "SUCCESS" && (
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${
                booking.payment.status === "PENDING" ? "bg-amber-50 text-amber-700 border-amber-200" :
                booking.payment.status === "REFUNDED" ? "bg-blue-50 text-blue-700 border-blue-200" :
                "bg-gray-50 text-gray-600 border-gray-200"
              }`}>
                Payment: {booking.payment.status}
              </span>
            )}
          </div>
        </div>

        <div className="border-t border-border/50 my-3" />

        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="flex flex-col items-center text-center p-2 rounded-lg bg-muted/40">
            <Calendar className="w-4 h-4 text-primary mb-1" />
            <span className="font-semibold text-sm">{nights} night{nights !== 1 ? "s" : ""}</span>
            <span className="text-xs text-muted-foreground">
              {checkIn.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </span>
          </div>
          <div className="flex flex-col items-center text-center p-2 rounded-lg bg-muted/40">
            <Users className="w-4 h-4 text-primary mb-1" />
            <span className="font-semibold text-sm">{booking.guests}</span>
            <span className="text-xs text-muted-foreground">Guests</span>
          </div>
          <div className="flex flex-col items-center text-center p-2 rounded-lg bg-muted/40">
            <Home className="w-4 h-4 text-primary mb-1" />
            <FormatedAmount amount={booking.totalAmount} className="font-semibold text-sm text-primary" />
            <span className="text-xs text-muted-foreground">Total</span>
          </div>
        </div>

        <Link to={`/account/bookings/${booking.id}`} className="block">
          <Button variant="outline" size="sm" className="w-full bg-transparent hover:bg-primary hover:text-primary-foreground transition-colors">
            View Details <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </div>
    </Card>
  );
}
