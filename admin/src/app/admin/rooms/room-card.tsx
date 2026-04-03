import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Maximize2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import FormatedAmount from "@/components/shared/formatted-amount";
import { useDeleteRoomMutation } from "@/hooks/api/use-rooms";
import { useAuthSession } from "@/hooks/use-auth-session";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

interface Room {
  id: string;
  roomId: string;
  name: string;
  type: string;
  price: number;
  description: string;
  availability: boolean;
  squareMeters: number;
  maxOccupancy: number;
  images: Array<{
    url: string;
    name: string;
  }>;
  features: Array<{
    category: string;
    name: string;
    value: string;
  }>;
}

interface RoomCardProps {
  room: Room;
}

export function RoomCard({ room }: RoomCardProps) {
  const router = useRouter();
  const { role } = useAuthSession();
  const deleteMutation = useDeleteRoomMutation();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const isAdminOrStaff = role === "STAFF";

  // Compute real availability from bookings
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const hasActiveBooking = (room as any).bookings?.some(
    (b: any) => b.checkIn && b.checkOut && new Date(b.checkOut) >= today
  );
  const isAvailable = hasActiveBooking ? false : room.availability;

  // Next available date
  const activeBookings = ((room as any).bookings || []).filter(
    (b: any) => b.checkIn && b.checkOut && new Date(b.checkOut) >= today
  );
  const latestCheckout = activeBookings.reduce((latest: Date | null, b: any) => {
    const co = new Date(b.checkOut);
    return !latest || co > latest ? co : latest;
  }, null);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow pt-0">
      <CardHeader className="p-0">
        <div className="relative max-h-50 min-h-50 w-full bg-muted overflow-hidden">
          {room.images[0] ? (
            <img src={room.images[0].url || "/placeholder.svg"} alt={room.name} className="object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">No Image</div>
          )}
          <div className="absolute top-3 right-3">
            <Badge variant={isAvailable ? "default" : "secondary"}
              className={isAvailable ? "bg-green-600 hover:bg-green-700 text-white" : "bg-red-600 hover:bg-red-700 text-white"}>
              {isAvailable ? "Available" : "Unavailable"}
            </Badge>
          </div>
          <div className="absolute top-3 left-3">
            <Badge variant="secondary" className="bg-background/90 text-foreground">{room.type}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-foreground mb-1">{room.name}</h3>
          {!isAdminOrStaff && (
            <p className="text-sm text-muted-foreground line-clamp-2">{room.description}</p>
          )}
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-1"><Users className="h-4 w-4" /><span>{room.maxOccupancy} guests</span></div>
          <div className="flex items-center gap-1"><Maximize2 className="h-4 w-4" /><span>{room.squareMeters} m²</span></div>
        </div>
        {!isAvailable && latestCheckout && (
          <p className="text-xs text-red-500 mb-2">
            Not available until {latestCheckout.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </p>
        )}
        {isAvailable && (
          <p className="text-xs text-green-600 mb-2">Available now</p>
        )}
        <div className="flex items-center justify-between">
          <FormatedAmount amount={room.price} showSymbol suffix="/night" className="text-xl font-bold" />
          <Badge variant="outline" className="text-xs">Room #{room.roomId}</Badge>
        </div>
      </CardContent>
      {!isAdminOrStaff && (
        <CardFooter className="p-4 pt-0 flex gap-2">
          <Button className="flex-1" onClick={() => router.push(`/admin/rooms/${room.id}`)}>
            View Details
          </Button>
          {role === "OWNER" && (
            <Button variant="destructive" size="icon" onClick={() => setConfirmDelete(true)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      )}

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Room</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to delete "{room.name}"? This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteMutation.mutate(room.id, { onSuccess: () => setConfirmDelete(false) })}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
