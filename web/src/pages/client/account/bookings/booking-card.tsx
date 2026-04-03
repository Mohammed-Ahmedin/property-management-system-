"use client";

import { Button } from "@/components/ui/button";
import { ChevronRight, Users, Calendar, MapPin, BedDouble, Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { StatusBadge } from "@/components/status-badge";
import FormatedAmount from "@/components/shared/formatted-amount";
import type { BookingDetailDataResponse } from "@/hooks/api/types/booking.types";
import { cn } from "@/lib/utils";

interface BookingCardProps {
  booking: BookingDetailDataResponse;
}

const statusMeta: Record<string, { gradient: string; icon: React.ReactNode; accent: string }> = {
  APPROVED: {
    gradient: "from-emerald-500/10 to-transparent",
    icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
    accent: "border-l-emerald-500",
  },
  REJECTED: {
    gradient: "from-red-500/10 to-transparent",
    icon: <XCircle className="w-4 h-4 text-red-500" />,
    accent: "border-l-red-500",
  },
  CANCELLED: {
    gradient: "from-zinc-500/10 to-transparent",
    icon: <XCircle className="w-4 h-4 text-zinc-400" />,
    accent: "border-l-zinc-400",
  },
  PENDING: {
    gradient: "from-amber-500/10 to-transparent",
    icon: <Clock className="w-4 h-4 text-amber-500" />,
    accent: "border-l-amber-500",
  },
};

export function BookingCard({ booking }: BookingCardProps) {
  const checkIn = new Date(booking.checkIn);
  const checkOut = new Date(booking.checkOut);
  const nights = Math.max(1, Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)));
  const meta = statusMeta[booking.status] || statusMeta.PENDING;
  const roomImg = (booking.room as any)?.images?.[0]?.url;

  const formatShort = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const formatYear = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div className={cn(
      "group rounded-2xl border border-border bg-card overflow-hidden hover:shadow-xl hover:shadow-black/5 transition-all duration-300 border-l-4",
      meta.accent
    )}>
      <div className={cn("bg-gradient-to-r p-0.5", meta.gradient)} />

      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        {roomImg && (
          <div className="sm:w-44 w-full h-36 sm:h-auto shrink-0 overflow-hidden bg-muted">
            <img src={roomImg} alt={booking.room?.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>
        )}

        <div className="flex-1 p-4 md:p-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                {meta.icon}
                <h3 className="font-bold text-base truncate">{booking.property?.name || "Property"}</h3>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <BedDouble className="w-3 h-3 shrink-0" />
                <span className="truncate">{booking.room?.name || "Room"}</span>
                {(booking as any).property?.location?.city && (
                  <>
                    <span>·</span>
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span>{(booking as any).property.location.city}</span>
                  </>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end gap-1.5 shrink-0">
              <StatusBadge status={booking.status} paymentStatus={booking.payment?.status} />
              {booking.payment?.status && booking.payment.status !== "SUCCESS" && (
                <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium border",
                  booking.payment.status === "PENDING" ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400" :
                  "bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400"
                )}>
                  {booking.payment.status}
                </span>
              )}
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="flex flex-col items-center text-center p-2.5 rounded-xl bg-muted/50 border border-border/50">
              <Calendar className="w-3.5 h-3.5 text-primary mb-1" />
              <span className="font-bold text-sm">{nights}n</span>
              <span className="text-xs text-muted-foreground">{formatShort(checkIn)} – {formatShort(checkOut)}</span>
            </div>
            <div className="flex flex-col items-center text-center p-2.5 rounded-xl bg-muted/50 border border-border/50">
              <Users className="w-3.5 h-3.5 text-primary mb-1" />
              <span className="font-bold text-sm">{booking.guests}</span>
              <span className="text-xs text-muted-foreground">Guests</span>
            </div>
            <div className="flex flex-col items-center text-center p-2.5 rounded-xl bg-muted/50 border border-border/50">
              <span className="text-xs text-muted-foreground mb-1">Total</span>
              <FormatedAmount amount={booking.totalAmount} className="font-bold text-sm text-primary" />
              <span className="text-xs text-muted-foreground">ETB</span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Booked {formatYear(new Date((booking as any).createdAt || booking.checkIn))}
            </p>
            <Link to={`/account/bookings/${booking.id}`}>
              <Button size="sm" className="rounded-full gap-1 text-xs h-8 px-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors" variant="outline">
                View Details <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
