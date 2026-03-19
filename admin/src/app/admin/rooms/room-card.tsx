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
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow pt-0">
      <CardHeader className="p-0">
        <div className="relative max-h-50 min-h-50 w-full bg-muted overflow-hidden">
          {room.images[0] ? (
            <img
              src={room.images[0].url || "/placeholder.svg"}
              alt={room.name}
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No Image
            </div>
          )}
          <div className="absolute top-3 right-3">
            <Badge
              variant={room.availability ? "default" : "secondary"}
              className={
                room.availability
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-red-600 hover:bg-red-700 text-white"
              }
            >
              {room.availability ? "Available" : "Unavailable"}
            </Badge>
          </div>
          <div className="absolute top-3 left-3">
            <Badge
              variant="secondary"
              className="bg-background/90 text-foreground"
            >
              {room.type}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-foreground mb-1">
            {room.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {room.description}
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{room.maxOccupancy} guests</span>
          </div>
          <div className="flex items-center gap-1">
            <Maximize2 className="h-4 w-4" />
            <span>{room.squareMeters} m²</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-2xl font-bold text-foreground">
              <FormatedAmount amount={room.price} showSymbol suffix="/day"/>
            </span>
            {/* <span className="text-sm text-muted-foreground">/day</span> */}
          </div>
          <Badge variant="outline" className="text-xs">
            Room #{room.roomId}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button
          className="flex-1"
          disabled={!room.availability}
          onClick={() => router.push(`/admin/rooms/${room.id}`)}
        >
          View Details
        </Button>
        {role === "ADMIN" && (
          <Button variant="destructive" size="icon" onClick={() => setConfirmDelete(true)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </CardFooter>

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Room</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{room.name}"? This cannot be undone.
            </AlertDialogDescription>
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
