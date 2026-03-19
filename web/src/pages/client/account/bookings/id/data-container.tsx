"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/status-badge";
import {
  ArrowLeft,
  Calendar,
  Users,
  CreditCard,
  Download,
  Loader2,
  Package,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { generateReceiptPDF } from "@/utils/pdf";
import FormatedAmount from "@/components/shared/formatted-amount";
import type { BookingDetailDataResponse } from "@/hooks/api/types/booking.types";

export default function DataContainer({
  data,
}: {
  data: BookingDetailDataResponse;
}) {
  const params = useParams();
  //   const bookingId = params.id as string;
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
  const nights = Math.ceil(
    (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
  );

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background pt-4">
      {/* Back Button */}
      <Link to="/account/bookings" className="inline-block mb-6">
        <Button
          variant="outline"
          size="sm"
          className="text-xs md:text-sm bg-transparent"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Bookings
        </Button>
      </Link>

      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-4xl font-bold tracking-tight mb-2">
          {booking.property?.name}
        </h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Booking ID: {booking.id}
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-4 md:gap-6 lg:grid-cols-3">
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          {/* Room Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base md:text-lg">Your Room</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {booking.room?.images && booking.room.images.length > 0 && (
                <div className="rounded-lg overflow-hidden bg-muted h-48 md:h-64 w-full">
                  <img
                    src={booking.room.images[0].url || "/placeholder.svg"}
                    alt={booking.room.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div>
                <h3 className="font-semibold text-sm md:text-base mb-1">
                  {booking.room?.name}
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground">
                  {booking.room?.description}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Dates & Guests Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base md:text-lg">Your Stay</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs md:text-sm text-muted-foreground mb-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                  Check-in
                </p>
                <p className="font-semibold text-xs md:text-sm">
                  {formatDate(checkIn)}
                </p>
              </div>
              <div>
                <p className="text-xs md:text-sm text-muted-foreground mb-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                  Check-out
                </p>
                <p className="font-semibold text-xs md:text-sm">
                  {formatDate(checkOut)}
                </p>
              </div>
              <div>
                <p className="text-xs md:text-sm text-muted-foreground mb-1">
                  Duration
                </p>
                <p className="font-semibold text-xs md:text-sm">
                  {nights} night{nights !== 1 ? "s" : ""}
                </p>
              </div>
              <div>
                <p className="text-xs md:text-sm text-muted-foreground mb-1 flex items-center gap-1">
                  <Users className="w-3 h-3 md:w-4 md:h-4" />
                  Guests
                </p>
                <p className="font-semibold text-xs md:text-sm">
                  {booking.guests}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Payment Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base md:text-lg flex items-center gap-2">
                <CreditCard className="w-4 h-4 md:w-5 md:h-5" />
                Payment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground mb-1">
                    Base Price
                  </p>
                  <p className="font-semibold text-xs md:text-sm">
                    {booking.currency} {booking.basePrice}
                  </p>
                </div>
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground mb-1">
                    Tax
                  </p>
                  <p className="font-semibold text-xs md:text-sm">
                    {booking.currency} {booking.taxAmount}
                  </p>
                </div>
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground mb-1">
                    Discount
                  </p>
                  <FormatedAmount
                    amount={Number(booking.discount)}
                    className="font-semibold text-xs md:text-sm"
                  />
                </div>
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground mb-1">
                    Total Amount
                  </p>
                  <FormatedAmount
                    amount={Number(booking.totalAmount)}
                    className="font-semibold text-base text-primary"
                  />
                </div>
              </div>

              <div className="pt-3 border-t space-y-3">
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground mb-1">
                    Payment Status
                  </p>
                  <p>status: {booking.payment?.status}</p>
                  <StatusBadge status={booking.payment?.status} />
                </div>
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground mb-1">
                    Payment Method
                  </p>
                  <p className="font-semibold text-xs md:text-sm">
                    {booking.payment?.method}
                  </p>
                </div>
                {booking.payment?.transactionRef && (
                  <div>
                    <p className="text-xs md:text-sm text-muted-foreground mb-1">
                      Transaction Reference
                    </p>
                    <p className="font-mono text-xs md:text-sm">
                      {booking.payment.transactionRef}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Additional Services Section */}
          {booking.additionalServices &&
            booking.additionalServices.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base md:text-lg flex items-center gap-2">
                    <Package className="w-4 h-4 md:w-5 md:h-5" />
                    Additional Services
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {booking.additionalServices.map((service, index) => (
                      <li
                        key={index}
                        className="flex justify-between items-center text-sm pb-2 border-b last:border-b-0"
                      >
                        <span>{service?.name}</span>
                        <FormatedAmount
                          amount={Number(service?.price)}
                          className="font-semibold text-sm"
                        />
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

          <div className="flex gap-3">
            <Button
              onClick={handleDownloadReceipt}
              disabled={isGeneratingPDF}
              className="flex-1 gap-2"
              size="lg"
            >
              {isGeneratingPDF ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Download Receipt
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Right Column - Summary */}
        <div className="space-y-4 md:space-y-6">
          {/* Quick Summary */}
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="text-sm md:text-base">
                Booking Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-xs md:text-sm">
                <span className="text-muted-foreground">Property</span>
                <span className="font-semibold text-right">
                  {booking.property?.name}
                </span>
              </div>
              <div className="flex justify-between text-xs md:text-sm">
                <span className="text-muted-foreground">Room</span>
                <span className="font-semibold text-right">
                  {booking.room?.name}
                </span>
              </div>
              <div className="flex justify-between text-xs md:text-sm">
                <span className="text-muted-foreground">Dates</span>
                <span className="font-semibold text-right">
                  {nights} nights
                </span>
              </div>
              <div className="flex justify-between text-xs md:text-sm">
                <span className="text-muted-foreground">Guests</span>
                <span className="font-semibold text-right">
                  {booking.guests}
                </span>
              </div>
              <div className="border-t pt-3 flex justify-between text-xs md:text-sm font-semibold">
                <span>Total</span>
                <FormatedAmount
                  amount={Number(booking.totalAmount)}
                  className="font-semibold text-sm text-primary"
                />
              </div>
            </CardContent>
          </Card>

          {/* Booking Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm md:text-base">Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs md:text-sm text-muted-foreground mb-2">
                  Booking Status
                </p>
                <StatusBadge status={booking.status} />
              </div>
              <div>
                <p className="text-xs md:text-sm text-muted-foreground mb-1">
                  Booking Type
                </p>
                <Badge variant="outline" className="text-xs">
                  {booking.manualBooked ? "Manual" : "Online"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
