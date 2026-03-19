import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Plus } from "lucide-react";
import { Empty } from "./empty";

interface BookingTabProps {
  bookings: any[];
  room: any;
}

export function BookingTab({ bookings, room }: BookingTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Bookings</h2>
          <p className="text-muted-foreground">View and manage room bookings</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Booking
        </Button>
      </div>

      {bookings.length === 0 ? (
        <Empty
          icon={Calendar}
          title="No bookings yet"
          description="This room has no bookings at the moment"
          action={
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create First Booking
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4">
          {bookings.map((booking) => (
            <Card key={booking.id}>
              <CardHeader>
                <CardTitle>{booking.guestName}</CardTitle>
                <CardDescription>
                  {new Date(booking.checkIn).toLocaleDateString()} -{" "}
                  {new Date(booking.checkOut).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Booking details would go here</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
