import { useState } from "react";
import { CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useGetProtectedPropertyForListQuery } from "@/hooks/api/use-property";
import { useRoomsForList } from "@/hooks/api/use-rooms";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  setValue: any;
  errors: any;
  onBookedRangesChange?: (ranges: { checkIn: Date; checkOut: Date }[]) => void;
}

export default function PropertyRoomSelect({ setValue, errors, onBookedRangesChange }: Props) {
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>("");
  const [selectedRoomId, setSelectedRoomId] = useState<string>("");

  const { data: properties, isFetching, isError } = useGetProtectedPropertyForListQuery();
  const { data: rooms, isFetching: roomsFetching } = useRoomsForList({ propertyId: selectedPropertyId });

  const handlePropertyChange = (id: string) => {
    setSelectedPropertyId(id);
    setSelectedRoomId("");
    setValue("propertyId", id);
    setValue("roomId", "");
    onBookedRangesChange?.([]);
  };

  const handleRoomChange = (roomId: string) => {
    setSelectedRoomId(roomId);
    setValue("roomId", roomId);
    const room = rooms?.find((r: any) => r.id === roomId);
    const ranges = (room?.bookings || [])
      .filter((b: any) => b.checkIn && b.checkOut && ["PENDING", "APPROVED"].includes(b.status))
      .map((b: any) => ({ checkIn: new Date(b.checkIn), checkOut: new Date(b.checkOut) }));
    onBookedRangesChange?.(ranges);
  };

  if (isFetching) {
    return <div className="px-4 py-4"><Skeleton className="w-full h-[60px]" /></div>;
  }

  if (isError || !properties) {
    return <p className="text-destructive px-4">Failed to load properties.</p>;
  }

  return (
    <CardContent className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="propertyId">
            Property <span className="text-destructive">*</span>
          </Label>
          <Select onValueChange={handlePropertyChange} value={selectedPropertyId}>
            <SelectTrigger id="propertyId">
              <SelectValue placeholder="Select a property" />
            </SelectTrigger>
            <SelectContent>
              {properties.length === 0 ? (
                <div className="px-3 py-2 text-sm text-muted-foreground">No properties assigned</div>
              ) : (
                properties.map((house: any) => (
                  <SelectItem key={house.id} value={house.id}>{house.name}</SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="roomId">
            Room <span className="text-destructive">*</span>
          </Label>
          <Select
            onValueChange={handleRoomChange}
            value={selectedRoomId}
            disabled={!selectedPropertyId || roomsFetching}
          >
            <SelectTrigger id="roomId" className={cn(errors.roomId && "border-destructive")}>
              <SelectValue placeholder={
                !selectedPropertyId ? "Select a property first"
                : roomsFetching ? "Loading rooms..."
                : rooms?.length === 0 ? "No rooms available"
                : "Select a room"
              } />
            </SelectTrigger>
            <SelectContent>
              {(rooms || []).map((room: any) => (
                <SelectItem key={room.id} value={room.id}>
                  {room.name} — {room.roomId}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.roomId && <p className="text-sm text-destructive">{errors.roomId.message}</p>}
        </div>
      </div>
    </CardContent>
  );
}
