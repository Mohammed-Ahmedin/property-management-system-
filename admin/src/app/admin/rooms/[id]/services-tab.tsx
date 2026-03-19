"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, DollarSign } from "lucide-react";
import { Empty } from "./empty";
import FormatedAmount from "@/components/shared/formatted-amount";
import { AddServiceDialog } from "@/components/room-services/add-services-modal";
import { useGetRoomServicesQuery } from "@/hooks/api/use-rooms";
import LoaderState from "@/components/shared/loader-state";
import { UpdateServiceDialog } from "@/components/room-services/update-service-modal";

interface ServicesTabProps {
  roomId: string;
}

export function ServicesTab({ roomId }: ServicesTabProps) {
  const {
    data: services,
    isFetching,
    isError,
  } = useGetRoomServicesQuery({ roomId });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Room Services</h2>
          <p className="text-muted-foreground">
            Manage additional services for this room
          </p>
        </div>
        <AddServiceDialog roomId={roomId} />
      </div>

      {isFetching ? (
        <LoaderState />
      ) : isError ? (
        <div className="w-full py-40 flex justify-center items-center">
          Some error occured please try again
        </div>
      ) : services && services.length === 0 ? (
        <Empty
          icon={DollarSign}
          title="No services yet"
          description="Add services to enhance your room offerings"
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {services?.map((service) => (
            <Card key={service.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-lg">{service.name}</CardTitle>
                      <Badge
                        variant={service.isActive ? "default" : "secondary"}
                      >
                        {service.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <CardDescription>{service.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FormatedAmount amount={service.price!} />
                  </div>
                  <div className="flex gap-2">
                    <UpdateServiceDialog
                      initialData={{
                        description: service.description!,
                        isActive: service.isActive,
                        name: service.name,
                        price: service.price!,
                      }}
                      roomId={roomId}
                      serviceId={service.id}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
