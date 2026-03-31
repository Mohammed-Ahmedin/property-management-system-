"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Calendar,
  User,
  Home,
  CreditCard,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  Users,
  Bed,
  DollarSign,
  Receipt,
  FileText,
  ActivityIcon,
  Download,
  Printer,
  MoreHorizontal,
  Loader2,
  X,
} from "lucide-react";
import { BookingStatus, PaymentStatus } from "@/types/booking";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/hooks/api";
import {
  useGetBookingDetailById,
  useUpdateBookingStatusMutation,
} from "@/hooks/api/use-bookings";

interface BookingDetailModalProps {
  bookingId: string | null;
  open: boolean;
  setOpen: any;
  onOpenChange: (open: boolean) => void;
}

export function BookingDetailModal({
  bookingId,
  open,
  setOpen,
  onOpenChange,
}: BookingDetailModalProps) {
  const {
    data: booking,
    isLoading,
    isError,
    error,
    isFetching,
  } = useGetBookingDetailById({
    bookingId: bookingId || "",
  });

  const updateBookingStatus = useUpdateBookingStatusMutation();
  const disableAllButtons = updateBookingStatus.isPending;

  const handleApproveBooking = (id: string) => {
    id &&
      updateBookingStatus.mutateAsync({
        bookingId: id,
        newStatus: "APPROVED",
      });
  };
  const handleRejectBooking = (id: string) => {
    id &&
      updateBookingStatus.mutateAsync({
        bookingId: id,
        newStatus: "REJECTED",
      });
  };
  const handleCancelBooking = (id: string) => {
    id &&
      updateBookingStatus.mutateAsync({
        bookingId: id,
        newStatus: "CANCELLED",
      });
  };

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[90vw] md:min-w-[100vw] max-h-[1000vh]">
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-lg font-medium">Loading booking details...</p>
            <p className="text-sm text-muted-foreground">
              Please wait while we fetch the information
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (isError) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[90vw] md:min-w-[100vw] max-h-[1000vh]">
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <XCircle className="h-12 w-12 text-destructive" />
            <p className="text-lg font-medium">Failed to load booking</p>
            <p className="text-sm text-muted-foreground text-center max-w-md">
              {error instanceof Error
                ? error.message
                : "An error occurred while fetching booking details. Please try again."}
            </p>
            <Button onClick={() => onOpenChange(false)} variant="outline">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!booking) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[90vw] md:min-w-[100vw] max-h-[1000vh]">
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <AlertCircle className="h-12 w-12 text-muted-foreground" />
            <p className="text-lg font-medium">No booking found</p>
            <p className="text-sm text-muted-foreground">
              The requested booking could not be found
            </p>
            <Button onClick={() => onOpenChange(false)} variant="outline">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const nights = Math.ceil(
    (new Date(booking.checkOut).getTime() -
      new Date(booking.checkIn).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  const guestInfo = booking.user
    ? {
        name: booking.user.name,
        email: booking.user.email,
        phone: booking.user.phone,
      }
    : {
        name: booking.guestName,
        email: booking.guestEmail as any,
        phone: booking.guestPhone,
      };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[90vw] md:min-w-[100vw] min-h-[100vh] p-0 gap-0 overflow-hidden"
      >
        <DialogHeader className="px-6 pt-6 pb-4 border-b bg-muted/30">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3">
                <DialogTitle className="text-2xl font-bold">
                  Booking #{booking?.id}
                </DialogTitle>
                <Badge variant="outline" className={cn("gap-1.5 px-3 py-1")}>
                  {booking.status}
                </Badge>
                {booking.manualBooked && (
                  <Badge variant="secondary" className="gap-1.5">
                    <FileText className="h-3 w-3" />
                    Manual
                  </Badge>
                )}
                {isFetching && (
                  <Badge variant="outline" className="gap-1.5">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Updating...
                  </Badge>
                )}
              </div>
              <DialogDescription className="text-base">
                Created on {format(new Date(booking.createdAt), "PPP 'at' p")}
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" title="Download" onClick={() => {
                const content = `Booking #${booking.id}\nStatus: ${booking.status}\nCheck-in: ${booking.checkIn ? format(new Date(booking.checkIn), "PPP") : "—"}\nCheck-out: ${booking.checkOut ? format(new Date(booking.checkOut), "PPP") : "—"}\nGuests: ${booking.guests}\nTotal: ${booking.currency} ${booking.totalAmount}`;
                const blob = new Blob([content], { type: "text/plain" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url; a.download = `booking-${booking.id.slice(0, 8)}.txt`; a.click();
                URL.revokeObjectURL(url);
              }}>
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" title="Print" onClick={() => window.print()}>
                <Printer className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => {
                    const subject = encodeURIComponent(`Booking Confirmation #${booking.id.slice(0, 8)}`);
                    const body = encodeURIComponent(`Dear ${booking.user?.name || booking.guestName || "Guest"},\n\nYour booking is ${booking.status}.\nCheck-in: ${booking.checkIn ? format(new Date(booking.checkIn), "PPP") : "—"}\nCheck-out: ${booking.checkOut ? format(new Date(booking.checkOut), "PPP") : "—"}\n\nThank you.`);
                    window.open(`mailto:${booking.user?.email || booking.guestEmail || ""}?subject=${subject}&body=${body}`);
                  }}>Send Email</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {
                    const phone = booking.user?.phone || booking.guestPhone || "";
                    if (phone) window.open(`sms:${phone}`);
                  }}>Send SMS</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive"
                    disabled={disableAllButtons}
                    onClick={() => handleCancelBooking(booking.id)}
                  >
                    Delete Booking
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="destructive"
                size="icon"
                onClick={() => setOpen(false)}
                disabled={disableAllButtons}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>
        <ScrollArea className="flex-1 h-[calc(90vh-180px)]">
          <Tabs defaultValue="overview" className="w-full">
            <div className="sticky top-0 z-10 bg-background border-b px-6">
              <TabsList className="w-full justify-start h-12 bg-transparent p-0">
                <TabsTrigger
                  value="overview"
                  className="data-[state=active]:border-b-2 data-[state=active]:bg-accent rounded-none"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="guest"
                  className="data-[state=active]:border-b-2 data-[state=active]:bg-accent rounded-none"
                >
                  Guest Info
                </TabsTrigger>
                <TabsTrigger
                  value="payment"
                  className="data-[state=active]:border-b-2 data-[state=active]:bg-accent rounded-none"
                >
                  Payment
                </TabsTrigger>
                <TabsTrigger
                  value="activity"
                  className="data-[state=active]:border-b-2 data-[state=active]:bg-accent rounded-none"
                >
                  Activity Log
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6">
              <TabsContent value="overview" className="mt-0 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Booking Details */}
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-primary" />
                        Booking Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">
                              Check-in
                            </p>

                            <p
                              className={`text-lg font-semibold ${
                                booking.status === "CANCELLED" ||
                                booking.status === "REJECTED"
                                  ? "line-through text-red-500 underline decoration-dotted"
                                  : ""
                              }`}
                            >
                              {booking.checkIn
                                ? format(new Date(booking.checkIn), "PPP")
                                : "—"}
                            </p>

                            <p
                              className={`text-sm text-muted-foreground ${
                                booking.status === "CANCELLED" ||
                                booking.status === "REJECTED"
                                  ? "line-through text-red-400"
                                  : ""
                              }`}
                            >
                              {booking.checkIn
                                ? format(new Date(booking.checkIn), "p")
                                : ""}
                            </p>

                            {/* Optional: show old dates below if cancelled */}
                            {booking.status === "CANCELLED" &&
                              booking.cancelledCheckIn && (
                                <p className="text-xs text-muted-foreground italic mt-1">
                                  Originally:{" "}
                                  <span className="underline decoration-dotted">
                                    {format(
                                      new Date(booking.cancelledCheckIn),
                                      "PPP"
                                    )}
                                  </span>
                                </p>
                              )}
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">
                              Guests
                            </p>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <p className="text-lg font-semibold">
                                {booking.guests}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">
                              Check-out
                            </p>

                            <p
                              className={`text-lg font-semibold ${
                                booking.status === "CANCELLED" ||
                                booking.status === "REJECTED"
                                  ? "line-through text-red-500 underline decoration-dotted"
                                  : ""
                              }`}
                            >
                              {booking.checkOut
                                ? format(new Date(booking.checkOut), "PPP")
                                : "—"}
                            </p>

                            <p
                              className={`text-sm text-muted-foreground ${
                                booking.status === "CANCELLED" ||
                                booking.status === "REJECTED"
                                  ? "line-through text-red-400"
                                  : ""
                              }`}
                            >
                              {booking.checkOut
                                ? format(new Date(booking.checkOut), "p")
                                : ""}
                            </p>

                            {/* Optional: show old cancelled date */}
                            {booking.status === "CANCELLED" &&
                              booking.cancelledCheckOut && (
                                <p className="text-xs text-muted-foreground italic mt-1">
                                  Originally:{" "}
                                  <span className="underline decoration-dotted">
                                    {format(
                                      new Date(booking.cancelledCheckOut),
                                      "PPP"
                                    )}
                                  </span>
                                </p>
                              )}
                          </div>

                          <div>
                            <p className="text-sm text-muted-foreground mb-1">
                              Duration
                            </p>
                            <p className="text-lg font-semibold">
                              {nights} {nights === 1 ? "Night" : "Nights"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <Bed className="h-5 w-5 text-primary mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm text-muted-foreground">
                              Room
                            </p>
                            <p className="font-semibold text-lg">
                              {booking.room.name}
                            </p>
                            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                              <span>Room #{booking.room.roomNumber}</span>
                              <span>•</span>
                              <span>{booking.room.type}</span>
                              <span>•</span>
                              <span>Capacity: {booking.room.capacity}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Home className="h-5 w-5 text-primary mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm text-muted-foreground">
                              Property
                            </p>
                            <p className="font-semibold text-lg">
                              {booking.property.name}
                            </p>
                            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                              <MapPin className="h-3.5 w-3.5" />
                              <span>
                                {booking.property.address},{" "}
                                {booking.property.city}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {booking.approvedBy && (
                        <>
                          <Separator />
                          <div className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-sm text-muted-foreground">
                                Approved By
                              </p>
                              <p className="font-semibold">
                                {booking.approvedBy.name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {booking.approvedBy.email}
                              </p>
                            </div>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>

                  {/* Financial Summary */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Receipt className="h-5 w-5 text-primary" />
                        Financial Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            Base Price
                          </span>
                          <span className="font-medium">
                            {booking.currency} {booking?.basePrice}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            Tax
                          </span>
                          <span className="font-medium">
                            {booking.currency} {booking?.taxAmount}
                          </span>
                        </div>
                        {booking.discount > 0 && (
                          <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400">
                            <span className="text-sm">Discount</span>
                            <span className="font-medium">
                              -{booking.currency} {booking?.discount}
                            </span>
                          </div>
                        )}
                      </div>

                      <Separator />

                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Total Amount</span>
                        <span className="text-2xl font-bold text-primary">
                          {booking.currency} {booking?.totalAmount}
                        </span>
                      </div>

                      {booking.additionalServices.length > 0 && (
                        <>
                          <Separator />
                          <div className="space-y-2">
                            <p className="text-sm font-medium">
                              Additional Services
                            </p>
                            {booking.additionalServices.map((service: any) => (
                              <div
                                key={service.id}
                                className="flex justify-between items-center text-sm"
                              >
                                <span className="text-muted-foreground">
                                  {service.name} x {service.quantity}
                                </span>
                                {/* <span className="font-medium">
                                  {booking.currency}{" "}
                                  {(service.price * service.quantity)}
                                </span> */}
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="guest" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" />
                      Guest Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">
                            Full Name
                          </p>
                          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <p className="font-medium">
                              {guestInfo.name || "N/A"}
                            </p>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">
                            Email Address
                          </p>
                          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <p className="font-medium">
                              {guestInfo.email || "N/A"}
                            </p>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">
                            Phone Number
                          </p>
                          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <p className="font-medium">
                              {guestInfo.phone || "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">
                            Booking Type
                          </p>
                          <div className="p-3 rounded-lg bg-muted/50">
                            <Badge
                              variant={
                                booking.manualBooked ? "secondary" : "default"
                              }
                            >
                              {booking.manualBooked
                                ? "Manual Booking"
                                : "Online Booking"}
                            </Badge>
                          </div>
                        </div>
                        {booking.userId && (
                          <div>
                            <p className="text-sm text-muted-foreground mb-2">
                              User ID
                            </p>
                            <div className="p-3 rounded-lg bg-muted/50">
                              <p className="font-mono text-sm">
                                {booking.userId}
                              </p>
                            </div>
                          </div>
                        )}
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">
                            Number of Guests
                          </p>
                          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <p className="font-medium text-2xl">
                              {booking.guests}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        className="flex-1 bg-transparent"
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Send Email
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 bg-transparent"
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Call Guest
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="payment" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-primary" />
                      Payment Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {booking.payment ? (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div>
                              <p className="text-sm text-muted-foreground mb-2">
                                Payment Status
                              </p>
                              <Badge
                                variant="outline"
                                className={cn("text-base px-4 py-2")}
                              >
                                {booking?.payment?.status}
                              </Badge>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground mb-2">
                                Payment Method
                              </p>
                              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                                <CreditCard className="h-4 w-4 text-muted-foreground" />
                                <p className="font-medium">
                                  {booking.payment.method}
                                </p>
                              </div>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground mb-2">
                                Amount Paid
                              </p>
                              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                                <p className="font-medium text-xl">
                                  {booking?.currency}{" "}
                                  {booking.payment.amount || "0.00"}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            {booking.payment.transactionId && (
                              <div>
                                <p className="text-sm text-muted-foreground mb-2">
                                  Transaction ID
                                </p>
                                <div className="p-3 rounded-lg bg-muted/50">
                                  <p className="font-mono text-sm break-all">
                                    {booking.payment.transactionId}
                                  </p>
                                </div>
                              </div>
                            )}
                            {booking.payment.transactionRef && (
                              <div>
                                <p className="text-sm text-muted-foreground mb-2">
                                  Transaction Reference
                                </p>
                                <div className="p-3 rounded-lg bg-muted/50">
                                  <p className="font-mono text-sm break-all">
                                    {booking.payment.transactionRef}
                                  </p>
                                </div>
                              </div>
                            )}
                            {booking.payment.phoneNumber && (
                              <div>
                                <p className="text-sm text-muted-foreground mb-2">
                                  Phone Number
                                </p>
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                                  <Phone className="h-4 w-4 text-muted-foreground" />
                                  <p className="font-medium">
                                    {booking.payment.phoneNumber}
                                  </p>
                                </div>
                              </div>
                            )}
                            <div>
                              <p className="text-sm text-muted-foreground mb-2">
                                Payment Date
                              </p>
                              <div className="p-3 rounded-lg bg-muted/50">
                                <p className="text-sm">
                                  {booking?.payment?.createdAt &&
                                    format(
                                      new Date(booking?.payment?.createdAt),
                                      "PPP 'at' p"
                                    )}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* {booking.payment.status === PaymentStatus.SUCCESS && (
                          <>
                            <Separator />
                            <Button
                              variant="destructive"
                              className="w-full"
                              onClick={() => onRefund?.(booking.id)}
                            >
                              Process Refund
                            </Button>
                          </>
                        )} */}
                      </>
                    ) : (
                      <div className="text-center py-12">
                        <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-lg font-medium mb-2">
                          No Payment Information
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Payment details will appear here once processed
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ActivityIcon className="h-5 w-5 text-primary" />
                      Activity Timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {booking.activities.length > 0 ? (
                      <div className="space-y-6">
                        {booking.activities.map((activity: any, index: any) => (
                          <div key={activity.id} className="relative pl-8">
                            {index !== booking.activities.length - 1 && (
                              <div className="absolute left-2 top-8 bottom-0 w-px bg-border" />
                            )}
                            <div className="absolute left-0 top-1 h-4 w-4 rounded-full bg-primary ring-4 ring-background" />
                            <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                <p className="font-medium capitalize">{(activity.action || activity.type || "").replace(/_/g, " ").toLowerCase()}</p>
                                <p className="text-xs text-muted-foreground">
                                  {format(new Date(activity.timestamp || activity.createdAt), "PPp")}
                                </p>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {activity.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <ActivityIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-lg font-medium mb-2">
                          No Activity Yet
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Activity logs will appear here as actions are
                          performed
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </ScrollArea>
        <div className="px-6 py-4 border-t bg-muted/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            Last updated: {format(new Date(booking.updatedAt), "PPp")}
          </div>
          <div className="flex items-center gap-2">
            {booking.status === BookingStatus.PENDING && (
              <>
                <Button
                  variant="destructive"
                  onClick={() => handleRejectBooking(booking.id)}
                  disabled={disableAllButtons}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button
                  onClick={() => handleApproveBooking(booking.id)}
                  disabled={disableAllButtons}
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Approve Booking
                </Button>
              </>
            )}
            {booking.status === BookingStatus.APPROVED && (
              <Button
                variant="destructive"
                onClick={() => handleCancelBooking(booking.id)}
                disabled={disableAllButtons}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Cancel Booking
              </Button>
            )}
          </div>
        </div>{" "}
      </DialogContent>
    </Dialog>
  );
}
