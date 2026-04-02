"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import {
  ArrowLeft, Calendar, Users, CreditCard, Download, Loader2, Package, MapPin, BedDouble,
} from "lucide-react";
import { Link } from "react-router-dom";
import { generateReceiptPDF } from "@/utils/pdf";
import FormatedAmount from "@/components/shared/formatted-amount";
import type { BookingDetailDataResponse } from "@/hooks/api/types/booking.types";

export default function DataContainer({ data }: { data: BookingDetailDataResponse }) {
  const booking = data;
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handleDownloadReceipt = async () => {
    setIsGeneratingPDF(true);
    try {
      const pdf = await generateReceiptPDF(booking);
      pdf.save(`booking-receipt-${booking.id}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const checkIn = new Date(booking.checkIn);
  const checkOut = new Date(booking.checkOut);
  const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="min-h-screen bg-muted/20 pb-12">
      <div className="max-w-5xl mx-auto px-4 pt-4">
        {/* Back */}
        <Link to="/account/bookings" className="inline-block mb-5">
          <Button variant="ghost" size="sm" className="gap-1 pl-0">
            <ArrowLeft className="w-4 h-4" /> Back to Bookings
          </Button>
        </Link>

        {/* Hero */}
        <div className="rounded-2xl bg-gradient-to-r from-primary to-primary/70 text-primary-foreground p-6 md:p-8 mb-6">
          <p className="text-primary-foreground/60 text-xs font-mono mb-1">#{booking.id.slice(0, 12)}...</p>
          <h1 className="text-2xl md:text-3xl font-bold mb-3">{booking.property?.name}</h1>
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={booking.status} />
            {booking.payment?.status && (
              <span className="text-xs bg-white/20 text-white px-2.5 py-0.5 rounded-full font-medium">
                Payment: {booking.payment.status}
              </span>
            )}
            <span className="text-xs text-primary-foreground/60">
              {booking.manualBooked ? "Manual Booking" : "Online Booking"}
            </span>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {/* Left */}
          <div className="lg:col-span-2 space-y-5">
            {/* Room */}
            <Card className="overflow-hidden">
              {booking.room?.images?.[0]?.url && (
                <div className="h-52 md:h-64 overflow-hidden">
                  <img src={booking.room.images[0].url} alt={booking.room.name} className="w-full h-full object-cover" />
                </div>
              )}
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <BedDouble className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base">{booking.room?.name}</h3>
                    {booking.room?.description && (
                      <p className="text-sm text-muted-foreground mt-0.5">{booking.room.description}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stay */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" /> Your Stay
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Check-in", value: formatDate(checkIn) },
                    { label: "Check-out", value: formatDate(checkOut) },
                    { label: "Duration", value: `${nights} night${nights !== 1 ? "s" : ""}` },
                    { label: "Guests", value: `${booking.guests} guest${booking.guests !== 1 ? "s" : ""}` },
                  ].map(({ label, value }) => (
                    <div key={label} className="p-3 rounded-xl bg-muted/40">
                      <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
                      <p className="font-semibold text-sm">{value}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Payment */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-primary" /> Payment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Base Price", value: `${booking.currency} ${booking.basePrice}` },
                    { label: "Tax", value: `${booking.currency} ${booking.taxAmount}` },
                    { label: "Discount", value: `${booking.currency} ${booking.discount}` },
                    { label: "Method", value: booking.payment?.method || "—" },
                  ].map(({ label, value }) => (
                    <div key={label} className="p-3 rounded-xl bg-muted/40">
                      <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
                      <p className="font-semibold text-sm">{value}</p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-primary/5 border border-primary/20">
                  <span className="font-semibold text-sm">Payment Status</span>
                  <StatusBadge status={booking.payment?.status} />
                </div>
                {booking.payment?.transactionRef && (
                  <div className="p-3 rounded-xl bg-muted/40">
                    <p className="text-xs text-muted-foreground mb-0.5">Transaction Ref</p>
                    <p className="font-mono text-xs">{booking.payment.transactionRef}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Additional Services */}
            {booking.additionalServices?.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Package className="w-4 h-4 text-primary" /> Additional Services
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {booking.additionalServices.map((service: any, i: number) => (
                      <li key={i} className="flex justify-between items-center text-sm py-2 border-b last:border-0">
                        <span>{service?.name}</span>
                        <FormatedAmount amount={Number(service?.price)} className="font-semibold text-sm" />
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            <Button onClick={handleDownloadReceipt} disabled={isGeneratingPDF} className="w-full gap-2" size="lg">
              {isGeneratingPDF ? <><Loader2 className="w-4 h-4 animate-spin" />Generating...</> : <><Download className="w-4 h-4" />Download Receipt</>}
            </Button>
          </div>

          {/* Right */}
          <div className="space-y-5">
            <Card className="sticky top-20">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: "Property", value: booking.property?.name },
                  { label: "Room", value: booking.room?.name },
                  { label: "Dates", value: `${nights} nights` },
                  { label: "Guests", value: booking.guests },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-semibold text-right max-w-[60%] truncate">{value}</span>
                  </div>
                ))}
                <div className="border-t pt-3 flex justify-between font-bold">
                  <span>Total</span>
                  <FormatedAmount amount={Number(booking.totalAmount)} className="text-primary font-bold" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Booking</p>
                  <StatusBadge status={booking.status} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Type</p>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-muted border">
                    {booking.manualBooked ? "Manual" : "Online"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
