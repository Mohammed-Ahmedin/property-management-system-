"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetRecentBookings } from "@/hooks/api/use-bookings";

export function RecentActivitiesTable() {
  const { data: bookings, isFetching, isError, error } = useGetRecentBookings();

  if (isFetching) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent bookings</CardTitle>
          <CardDescription>
            Latest bookings and tasks you've performed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Guest</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 6 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="h-4 w-12 ml-auto" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent bookings</CardTitle>
          <CardDescription className="text-red-500">
            Failed to load recent bookings — {error.message}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent bookings</CardTitle>
          <CardDescription>No recent bookings found.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent bookings</CardTitle>
        <CardDescription>
          Latest bookings and tasks you've performed
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Guest</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking: any) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">
                    {new Date(booking.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    {booking.user?.name ?? booking.guestName ?? "N/A"}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {booking.room?.name ?? "N/A"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        booking.status === "COMPLETED"
                          ? "default"
                          : booking.status === "CANCELLED"
                          ? "destructive"
                          : "secondary"
                      }
                      className="capitalize"
                    >
                      {booking.status.toLowerCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {booking.payment
                      ? `${booking.currency} ${booking.totalAmount ?? 0}`
                      : "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
