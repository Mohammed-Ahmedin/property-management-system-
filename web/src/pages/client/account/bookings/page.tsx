"use client";

import { BookingCard } from "./booking-card";
import { useGetUserBookings } from "@/hooks/api/use-bookings";
import { Button } from "@/components/ui/button";
import { Loader2, Calendar, CheckCircle2, Clock, XCircle, Hotel } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState } from "react";

const FILTERS = [
  { label: "All", value: "all" },
  { label: "Pending", value: "PENDING" },
  { label: "Approved", value: "APPROVED" },
  { label: "Rejected", value: "REJECTED" },
  { label: "Cancelled", value: "CANCELLED" },
];

export default function BookingsPage() {
  const dataQuery = useGetUserBookings();
  const [filter, setFilter] = useState("all");

  const allBookings: any[] = dataQuery.data?.data || [];
  const filtered = filter === "all" ? allBookings : allBookings.filter((b) => b.status === filter);

  const stats = {
    total: allBookings.length,
    approved: allBookings.filter((b) => b.status === "APPROVED").length,
    pending: allBookings.filter((b) => b.status === "PENDING").length,
    cancelled: allBookings.filter((b) => b.status === "CANCELLED" || b.status === "REJECTED").length,
  };

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Hero header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 py-8 md:py-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">My Bookings</h1>
              <p className="text-primary-foreground/70 text-sm">Manage all your reservations</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Total", value: stats.total, icon: <Hotel className="w-4 h-4" /> },
              { label: "Approved", value: stats.approved, icon: <CheckCircle2 className="w-4 h-4" /> },
              { label: "Pending", value: stats.pending, icon: <Clock className="w-4 h-4" /> },
              { label: "Cancelled", value: stats.cancelled, icon: <XCircle className="w-4 h-4" /> },
            ].map(({ label, value, icon }) => (
              <div key={label} className="bg-white/10 rounded-xl px-4 py-3 flex items-center gap-3">
                <div className="opacity-70">{icon}</div>
                <div>
                  <p className="text-xl font-bold">{value}</p>
                  <p className="text-xs text-primary-foreground/70">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {FILTERS.map((f) => (
            <button key={f.value} onClick={() => setFilter(f.value)}
              className={cn("px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors border",
                filter === f.value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-muted-foreground border-border hover:border-primary hover:text-primary"
              )}>
              {f.label}
              {f.value !== "all" && (
                <span className="ml-1.5 text-xs opacity-70">
                  ({allBookings.filter((b) => b.status === f.value).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {dataQuery.isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : dataQuery.isError || !dataQuery.data?.data ? (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <p className="text-muted-foreground">Failed to load bookings.</p>
            <Button onClick={() => dataQuery.refetch()} variant="outline" size="sm">Retry</Button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
              <Calendar className="w-10 h-10 text-muted-foreground opacity-40" />
            </div>
            <h3 className="text-lg font-semibold mb-1">
              {filter === "all" ? "No bookings yet" : `No ${filter.toLowerCase()} bookings`}
            </h3>
            <p className="text-sm text-muted-foreground max-w-xs mb-4">
              {filter === "all" ? "Once you make a booking, it will appear here." : "Try a different filter."}
            </p>
            {filter === "all" && (
              <Link to="/properties">
                <Button size="sm">Browse Properties</Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((booking) => (
              <BookingCard key={booking.id} booking={booking as any} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
