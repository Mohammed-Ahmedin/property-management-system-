"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetPropertiesForManagmentQuery } from "@/hooks/api/use-property";
import LoaderState from "@/components/shared/loader-state";
import { Building2, MapPin } from "lucide-react";
import Link from "next/link";

export default function StaffPropertiesPage() {
  const { data, isFetching } = useGetPropertiesForManagmentQuery();
  const properties: any[] = data?.data || [];

  if (isFetching) return <LoaderState />;

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Assigned Properties</h1>
        <p className="text-sm text-muted-foreground">Properties you are assigned to</p>
      </div>
      {properties.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Building2 className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p>No properties assigned to you yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {properties.map((p: any) => (
            <Card key={p.id} className="overflow-hidden">
              {p.images?.[0]?.url && (
                <img src={p.images[0].url} alt={p.name} className="w-full h-40 object-cover" />
              )}
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base">{p.name}</CardTitle>
                  <Badge variant="outline" className={p.status === "APPROVED" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"}>
                    {p.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{p.address}</span>
                </div>
                <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                  <span>{p._count?.rooms ?? 0} rooms</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
