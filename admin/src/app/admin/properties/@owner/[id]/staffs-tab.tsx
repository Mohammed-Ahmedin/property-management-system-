import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  useGetGhStaffsQuery,
  useRemoveStaffFromGHMutation,
} from "@/hooks/api/use-staff";
import { AlertTriangle, Trash2, Users } from "lucide-react";
import React from "react";
import { AddStaffModal } from "./add-staff-modal";
import { Spinner } from "@/components/ui/spinner";
import { Avatar } from "@/components/shared/avatar";

const StaffsTab = ({ propertyId }: { propertyId: string }) => {
  const { isFetching, isError, data, refetch } = useGetGhStaffsQuery(
    {
      propertyId,
    }
  );
  const removeStaffMutation = useRemoveStaffFromGHMutation();

  return (
    <TabsContent value="staff">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Staff Members</CardTitle>
              <CardDescription>Manage your property staff</CardDescription>
            </div>
            <AddStaffModal propertyId={propertyId} />
          </div>
        </CardHeader>
        <CardContent>
          {/* 🔄 Loading State */}
          {isFetching ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <Spinner className="size-10" />
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-red-600">
              <AlertTriangle className="h-10 w-10 mb-2" />
              <p className="font-medium mb-1">Failed to load staff members</p>
              <p className="text-sm mb-4 text-muted-foreground">
                {"An unexpected error occurred."}
              </p>
              <Button onClick={() => refetch()} variant="outline">
                Retry
              </Button>
            </div>
          ) : data?.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-foreground">
                No staff members yet
              </h3>
              <p className="text-muted-foreground mb-4">
                Add your first staff member to get started
              </p>
              <AddStaffModal propertyId={propertyId} />
            </div>
          ) : (
            <div className="space-y-3">
              {data?.filter((staff: any) => staff.role !== "BROKER").map((staff: any) => (
                <div
                  key={staff.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg"
                >
                  <div className="flex gap-3 items-center">
                    <Avatar name={staff.name} fallback={staff.name?.[0]} src={staff?.image} />
                    <div>
                      <p className="font-medium text-foreground">{staff.name}</p>
                      <p className="text-sm text-muted-foreground">{staff.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={staff.role === "BROKER" ? "default" : "secondary"}>
                      {staff.role === "BROKER" ? "Broker" : "Staff"}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeStaffMutation.mutate({ propertyId, userId: staff.id })}
                      disabled={removeStaffMutation.isPending}
                    >
                      {removeStaffMutation.isPending ? <Spinner /> : <Trash2 className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default StaffsTab;
