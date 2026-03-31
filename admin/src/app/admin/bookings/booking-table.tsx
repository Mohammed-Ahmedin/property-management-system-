"use client";

import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import FormatedAmount from "@/components/shared/formatted-amount";
import { BookingDetailModal } from "@/components/booking-detail-modal";

const ITEMS_PER_PAGE = 10;

export function BookingsTable({ bookings }: { bookings: any }) {
  console.log({bookings})
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [bookingDetailOpen, setBookingDetailOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null
  );
  // Filter and search logic
  const filteredBookings = useMemo(() => {
    return bookings.filter((booking: any) => {
      const matchesSearch =
        searchQuery === "" ||
        booking.guestEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.guestName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || booking.status === statusFilter;
      const matchesPayment =
        paymentFilter === "all" || booking.payment.status === paymentFilter;

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [searchQuery, statusFilter, paymentFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredBookings.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentBookings = filteredBookings.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  const handleFilterChange =
    (setter: (value: string) => void) => (value: string) => {
      setter(value);
      setCurrentPage(1);
    };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED": return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "PENDING": return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case "CANCELLED": return "bg-gray-500/10 text-gray-600 border-gray-500/20";
      case "REJECTED": return "bg-red-500/10 text-red-600 border-red-500/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "SUCCESS": return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "PENDING": return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case "FAILED": return "bg-red-500/10 text-red-600 border-red-500/20";
      case "CANCELLED": return "bg-gray-500/10 text-gray-600 border-gray-500/20";
      case "REFUNDED": return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleApprove = (bookingId: string) => {
    console.log("Approving booking:", bookingId);
    // Add your approval logic here
  };

  const handleReject = (bookingId: string) => {
    console.log("Rejecting booking:", bookingId);
    // Add your rejection logic here
  };

  const handleCancel = (bookingId: string) => {
    console.log("Cancelling booking:", bookingId);
    // Add your cancellation logic here
  };

  const handleRefund = (bookingId: string) => {
    console.log("Processing refund for booking:", bookingId);
    // Add your refund logic here
  };

  return (
    <>
      <Card className="border-border bg-card">
        <div className="p-6">
          {/* Filters and Search */}
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1 md:max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by guest, email, room, or ID..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9"
              />
            </div>
            {/* <div className="flex flex-wrap gap-2">
              <Select
                value={statusFilter}
                onValueChange={handleFilterChange(setStatusFilter)}
              >
                <SelectTrigger className="w-[160px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={paymentFilter}
                onValueChange={handleFilterChange(setPaymentFilter)}
              >
                <SelectTrigger className="w-[160px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Payment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payments</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="PAID">Paid</SelectItem>
                  <SelectItem value="FAILED">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div> */}
          </div>

          {/* Results count */}
          <div className="mb-4 text-sm text-muted-foreground">
            Showing {startIndex + 1}-
            {Math.min(endIndex, filteredBookings.length)} of{" "}
            {filteredBookings.length} bookings
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-semibold">Booking ID</TableHead>
                  <TableHead className="font-semibold">Guest</TableHead>
                  <TableHead className="font-semibold">Property</TableHead>
                  <TableHead className="font-semibold">Room</TableHead>
                  <TableHead className="font-semibold">Check In</TableHead>
                  <TableHead className="font-semibold">Check Out</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Payment</TableHead>
                  <TableHead className="font-semibold">Booking Type</TableHead>
                  <TableHead className="font-semibold text-right">Amount</TableHead>
                  <TableHead className="font-semibold text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentBookings.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="h-32 text-center text-muted-foreground"
                    >
                      No bookings found
                    </TableCell>
                  </TableRow>
                ) : (
                  currentBookings.map((booking: any) => (
                    <TableRow key={booking.id} className="group">
                      <TableCell className="font-mono text-xs">
                        {booking.id.slice(0, 8)}...
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">
                            {booking.guestName || booking?.user?.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {booking.guestEmail || booking?.user?.email}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-medium">{booking.property?.name || "—"}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">
                            {booking.room.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Room {booking.room.roomId}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDate(booking.checkIn)}
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDate(booking.checkOut)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getStatusColor(booking.status)}
                        >
                          {booking.status}
                        </Badge>
                      </TableCell>

                      {booking?.payment ? (
                        <TableCell>
                          <Badge variant="outline" className={getPaymentStatusColor(booking?.payment?.status)}>
                            {booking?.payment?.status}
                          </Badge>
                        </TableCell>
                      ) : (
                        <TableCell><Badge variant="outline">—</Badge></TableCell>
                      )}

                      <TableCell>
                        <Badge variant={booking.manualBooked ? "secondary" : "default"}>
                          {booking.manualBooked ? "Broker" : "Online"}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-right font-semibold">
                        {booking.totalAmount ? (
                          <FormatedAmount amount={booking.totalAmount} />
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          onClick={() => {
                            setSelectedBookingId(booking.id);
                            setBookingDetailOpen(true);
                          }}
                          size={"sm"}
                          variant={"outline"}
                        >
                          View Detail
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {selectedBookingId && (
        <BookingDetailModal
          bookingId={selectedBookingId}
          open={bookingDetailOpen}
          setOpen={setBookingDetailOpen}
          onOpenChange={setBookingDetailOpen}
        />
      )}
    </>
  );
}
