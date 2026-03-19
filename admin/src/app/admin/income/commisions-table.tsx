import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useGetCommisionSettings } from "@/hooks/api/use-commision";
import LoaderState from "@/components/shared/loader-state";
import { UpdateCommissionModal } from "./update-commision-modal";

export const BookingCommissionsTable: React.FC = () => {
  const { data, isFetching, isError, error, refetch } =
    useGetCommisionSettings();

  if (isFetching) return <LoaderState />;

  if (isError)
    return (
      <div className="py-20 grid place-content-center">
        <p className="text-red-500">Something went wrong, please try again</p>
      </div>
    );

  return (
    <Card>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Id</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Platform commision</TableHead>
              <TableHead className="text-right">Broker commision</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data?.map((commission) => (
              <TableRow key={commission.id} className={`${commission.type =='PLATFORM'&& 'bg-purple-400/20 rounded-b-lg overflow-hidden'}`}>
                <TableCell className="font-medium">
                  {commission.id.slice(0, 7)}...
                </TableCell>
                <TableCell>{commission.type}</TableCell>
                <TableCell>
                  {new Date(commission.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={commission.isActive ? "default" : "destructive"}
                  >
                    {commission.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {commission.platformPercent || 0}%
                </TableCell>
                <TableCell className="text-right font-medium">
                  {commission.brokerPercent || 0}%
                </TableCell>
                <TableCell className="text-right">
                  <UpdateCommissionModal
                    commissionId={commission.id}
                    initialData={commission as any}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
