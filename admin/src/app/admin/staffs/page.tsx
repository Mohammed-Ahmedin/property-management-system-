"use client";

import React from "react";
import { useGetStaffsForListQuery } from "@/hooks/api/use-staff";
import { Avatar } from "@/components/shared/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Users, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

const StaffsPage = () => {
  const { data, isFetching, isError, refetch } = useGetStaffsForListQuery();

  if (isFetching) return <div className="flex items-center justify-center py-20"><Spinner className="size-10" /></div>;

  if (isError) return (
    <div className="flex flex-col items-center justify-center py-20 text-center text-red-600">
      <AlertTriangle className="h-10 w-10 mb-2" />
      <p className="font-medium mb-1">Failed to load staff</p>
      <Button onClick={() => refetch()} variant="outline" className="mt-2">Retry</Button>
    </div>
  );

  if (!data?.length) return (
    <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
      <Users className="h-12 w-12 mb-4" />
      <h3 className="text-lg font-semibold mb-1 text-foreground">No staff members yet</h3>
      <p className="text-sm">Add staff from a property's staff tab.</p>
    </div>
  );

  const staffMembers = data.filter((s: any) => s.role !== "BROKER");
  const brokers = data.filter((s: any) => s.role === "BROKER");

  const renderGroup = (title: string, members: any[]) => (
    <div className="space-y-3">
      <h2 className="text-base font-semibold text-muted-foreground uppercase tracking-wider">{title}</h2>
      {members.length === 0 ? (
        <p className="text-sm text-muted-foreground italic">None assigned.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((staff: any) => (
            <Card key={staff.id}>
              <CardContent className="flex items-center gap-4 p-4">
                <Avatar name={staff.name} src={staff.image} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{staff.name}</p>
                  <p className="text-sm text-muted-foreground truncate">{staff.email}</p>
                </div>
                <Badge variant={staff.role === "BROKER" ? "default" : "secondary"}>
                  {staff.role === "BROKER" ? "Broker" : "Staff"}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-semibold">Staff Members</h1>
      {renderGroup("Staff Members", staffMembers)}
      {renderGroup("Brokers", brokers)}
    </div>
  );
};

export default StaffsPage;
