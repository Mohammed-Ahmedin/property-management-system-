import { useState, useEffect } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  setValue: any;
  errors: any;
}

export default function PropertyRoomSelect({ setValue, errors }: Props) {
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>("");
  const [availableRooms, setAvailableRooms] = useState<any[]>([]);

  // Fetch property data
  const {
    data: properties,
    isFetching,
    isError,
  } = useGetProtectedPropertyForListQuery();

  // Update rooms when property changes
  const handlePropertyChange = (id: string) => {
    setSelectedPropertyId(id);
    setValue("propertyId", id);

    const selectedHouse = properties?.find((g) => g.id === id);
    setAvailableRooms(selectedHouse?.rooms || []);

    // Reset room selection if property changes
    setValue("roomId", "");
  };

  // Loading state
  if (isFetching) {
    return (
      <div className="px-4">
        <Skeleton className="w-[180px] h-[60px]" />
      </div>
    );
  }

  // Error state
  if (isError || !properties) {
    return <p className="text-destructive">Failed to load properties.</p>;
  }

  return (
    <CardContent className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Property Selection */}
        <div className="space-y-2">
          <Label htmlFor="propertyId">
            Property <span className="text-destructive">*</span>
          </Label>
          <Select
            onValueChange={handlePropertyChange}
            value={selectedPropertyId}
          >
            <SelectTrigger id="propertyId">
              <SelectValue placeholder="Select a property" />
            </SelectTrigger>
            <SelectContent>
              {properties.map((house: any) => (
                <SelectItem key={house.id} value={house.id}>
                  {house.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Room Selection */}
        <div className="space-y-2">
          <Label htmlFor="roomId">
            Room <span className="text-destructive">*</span>
          </Label>
          <Select
            onValueChange={(value) => setValue("roomId", value)}
            disabled={!availableRooms.length}
          >
            <SelectTrigger
              id="roomId"
              className={cn(errors.roomId && "border-destructive")}
            >
              <SelectValue
                placeholder={
                  availableRooms.length
                    ? "Select a room"
                    : "Select a property first"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {availableRooms.map((room) => (
                <SelectItem key={room.id} value={room.id}>
                  {room.name} - {room.roomId}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.roomId && (
            <p className="text-sm text-destructive">{errors.roomId.message}</p>
          )}
        </div>
      </div>
    </CardContent>
  );
}
