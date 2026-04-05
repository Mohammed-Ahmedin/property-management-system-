import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Maximize2, Trash2, Eye, ImageIcon, CheckCircle2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import FormatedAmount from "@/components/shared/formatted-amount";
import { useDeleteRoomMutation } from "@/hooks/api/use-rooms";
import { useAuthSession } from "@/hooks/use-auth-session";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Room {
  id: string; roomId: string; name: string; type: string; price: number;
  description: string; availability: boolean; squareMeters: number;
  maxOccupancy: number; images: Array<{ url: string; name: string }>;
  features: Array<{ category: string; name: string; value: string }>;
}

export function RoomCard({ room }: { room: Room }) {
  const router = useRouter();
  const { role } = useAuthSession();
  const deleteMutation = useDeleteRoomMutation();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const isAdminOrStaff = role === "STAFF";

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const hasActiveBooking = (room as any).bookings?.some(
    (b: any) => b.checkIn && b.checkOut && new Date(b.checkOut) >= today
  );
  const isAvailable = hasActiveBooking ? false : room.availability;

  const activeBookings = ((room as any).bookings || []).filter(
    (b: any) => b.checkIn && b.checkOut && new Date(b.checkOut) >= today
  );
  const latestCheckout = activeBookings.reduce((latest: Date | null, b: any) => {
    const co = new Date(b.checkOut);
    return !latest || co > latest ? co : latest;
  }, null);

  const discountPercent = (room as any).discountPercent ?? 0;
  const discountedPrice = discountPercent > 0 ? Math.round(room.price * (1 - discountPercent / 100)) : null;

  return (
    <>
      <Card className="group overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-200 pt-0 border-border">
        {/* Image */}
        <div className="relative h-48 w-full overflow-hidden bg-muted">
          {room.images[0] ? (
            <img src={room.images[0].url} alt={room.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <ImageIcon className="h-10 w-10 text-muted-foreground opacity-20" />
            </div>
          )}
          {/* Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          {/* Availability badge */}
          <div className="absolute top-3 right-3">
            <Badge className={cn("text-xs font-semibold gap-1", isAvailable ? "bg-emerald-500 hover:bg-emerald-600 text-white" : "bg-red-500 hover:bg-red-600 text-white")}>
              {isAvailable ? <><CheckCircle2 className="h-3 w-3" /> Available</> : <><XCircle className="h-3 w-3" /> Unavailable</>}
            </Badge>
          </div>
          {/* Type badge */}
          <div className="absolute top-3 left-3">
            <Badge variant="secondary" className="text-xs bg-background/90 backdrop-blur-sm">{room.type}</Badge>
          </div>
          {/* Discount badge */}
          {discountPercent > 0 && (
            <div className="absolute bottom-3 left-3">
              <span className="text-xs font-bold bg-red-500 text-white px-2 py-0.5 rounded-full">{discountPercent}% OFF</span>
            </div>
          )}
          {/* Room ID */}
          <div className="absolute bottom-3 right-3">
            <span className="text-xs text-white/80 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full">Room #{room.roomId}</span>
          </div>
        </div>

        <CardContent className="p-4">
          <h3 className="text-base font-bold mb-1 group-hover:text-primary transition-colors">{room.name}</h3>
          {!isAdminOrStaff && room.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{room.description}</p>
          )}

          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
            <div className="flex items-center gap-1 bg-muted/50 px-2 py-1 rounded-full">
              <Users className="h-3 w-3" /><span>{room.maxOccupancy} guests</span>
            </div>
            <div className="flex items-center gap-1 bg-muted/50 px-2 py-1 rounded-full">
              <Maximize2 className="h-3 w-3" /><span>{room.squareMeters} m²</span>
            </div>
          </div>

          {/* Availability info */}
          {!isAvailable && latestCheckout ? (
            <p className="text-xs text-red-500 flex items-center gap-1 mb-2">
              <XCircle className="h-3 w-3" />
              Not available until {latestCheckout.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </p>
          ) : isAvailable ? (
            <p className="text-xs text-emerald-600 flex items-center gap-1 mb-2">
              <CheckCircle2 className="h-3 w-3" /> Available now
            </p>
          ) : null}

          {/* Price */}
          <div className="flex items-end justify-between pt-2 border-t border-border/50">
            <div>
              {discountedPrice ? (
                <>
                  <p className="text-xs line-through text-muted-foreground">ETB {room.price.toLocaleString()}</p>
                  <p className="text-lg font-bold text-red-500">ETB {discountedPrice.toLocaleString()}<span className="text-xs font-normal text-muted-foreground">/night</span></p>
                </>
              ) : (
                <FormatedAmount amount={room.price} showSymbol suffix="/night" className="text-lg font-bold text-primary" />
              )}
            </div>
          </div>
        </CardContent>

        {!isAdminOrStaff && (
          <CardFooter className="p-4 pt-0 flex gap-2">
            <Button className="flex-1 h-9 gap-1.5" onClick={() => router.push(`/admin/rooms/${room.id}`)}>
              <Eye className="h-3.5 w-3.5" /> View Details
            </Button>
            {role === "OWNER" && (
              <Button variant="outline" size="icon" className="h-9 w-9 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => setConfirmDelete(true)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </CardFooter>
        )}
      </Card>

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Room</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to delete "{room.name}"? This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteMutation.mutate(room.id, { onSuccess: () => setConfirmDelete(false) })}>
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
