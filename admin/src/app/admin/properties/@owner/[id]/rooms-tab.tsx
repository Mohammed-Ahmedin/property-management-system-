import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Bed, Edit, Trash2 } from "lucide-react";
import { useRoomsForList } from "@/hooks/api/use-rooms"; // your hook
import React from "react";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";
import FormatedAmount from "@/components/shared/formatted-amount";

interface RoomsTabProps {
  propertyId: string;
}

const RoomsTab: React.FC<RoomsTabProps> = ({ propertyId }) => {
  const { data: rooms, isFetching, isError } = useRoomsForList({ propertyId });
  const router = useRouter();

  return (
    <TabsContent value="rooms">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Rooms</CardTitle>
              <CardDescription>Manage your property rooms</CardDescription>
            </div>
            <Button
              size="sm"
              onClick={() => {
                router.push("/admin/rooms/create");
              }}
            >
              <Bed className="h-4 w-4 mr-2" />
              Add Room
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isFetching ? (
            <div className="flex justify-center py-12">
              <Spinner />
            </div>
          ) : isError ? (
            <div className="text-center py-12 text-red-500">
              Failed to load rooms. Please try again.
            </div>
          ) : rooms && rooms.length === 0 ? (
            <div className="text-center py-12">
              <Bed className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-foreground">
                No rooms added yet
              </h3>
              <p className="text-muted-foreground mb-4">
                Add your first room to start accepting bookings
              </p>
              <Button
                variant="outline"
                onClick={() => router.push("/admin/rooms/create")}
              >
                Add Room
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rooms?.map((room) => (
                <Card key={room.id} className="pt-0">
                  {room.images && room.images.length > 0 && (
                    <img
                      src={room.images[0].url}
                      alt={room.name}
                      className="w-full h-32 object-cover rounded-t-lg"
                    />
                  )}
                  <CardHeader>
                    <CardTitle className="text-base">{room.name}</CardTitle>
                    <CardDescription>{room.type}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <FormatedAmount amount={room.price} suffix="/day" />
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default RoomsTab;
