"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, Home, Users, Calendar } from "lucide-react";
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

  const nights = Math.ceil(
    (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base md:text-lg truncate">
              {booking.property?.name || "Property"}
            </CardTitle>
            <CardDescription className="text-xs md:text-sm mt-1">
              {booking.room?.name || "Room"}
            </CardDescription>
          </div>
          <div className="flex flex-col items-end gap-1">
            <StatusBadge status={booking.status} />
            {booking.payment?.status && (
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${
                booking.payment.status === "SUCCESS" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                booking.payment.status === "PENDING" ? "bg-amber-50 text-amber-700 border-amber-200" :
                booking.payment.status === "REFUNDED" ? "bg-blue-50 text-blue-700 border-blue-200" :
                "bg-gray-50 text-gray-600 border-gray-200"
              }`}>
                {booking.payment.status}
              </span>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Quick Info Grid */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          <div className="flex items-center gap-2 text-xs md:text-sm">
            <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <div>
              <div className="font-semibold">{nights} nights</div>
              <div className="text-muted-foreground text-xs">
                {checkIn.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs md:text-sm">
            <Users className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <div>
              <div className="font-semibold">{booking.guests}</div>
              <div className="text-muted-foreground text-xs">Guests</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs md:text-sm">
            <Home className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <div>
              <FormatedAmount
                amount={booking.totalAmount}
                className="text-xs text-primary"
              />
              <div className="text-muted-foreground text-xs">Total</div>
            </div>
          </div>
        </div>

        {/* View Details Button */}
        <Link to={`/account/bookings/${booking.id}`} className="block pt-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs md:text-sm bg-transparent"
          >
            View Details <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
