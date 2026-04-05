"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Search, Building2, Plus, Eye, Clock, XCircle, Bed, Calendar, MapPin, Home } from "lucide-react";
import { useGetPropertiesForManagmentQuery, useChangePropertyStatusMutation } from "@/hooks/api/use-property";
import LoaderState from "@/components/shared/loader-state";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const statusConfig: Record<string, { label: string; color: string; bg: string; bar: string; icon: any }> = {
  APPROVED: { label: "Approved", color: "text-emerald-700 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200", bar: "bg-emerald-500", icon: CheckCircle2 },
  PENDING:  { label: "Pending",  color: "text-amber-700 dark:text-amber-400",   bg: "bg-amber-50 dark:bg-amber-900/20 border-amber-200",   bar: "bg-amber-500",   icon: Clock },
  REJECTED: { label: "Rejected", color: "text-red-700 dark:text-red-400",       bg: "bg-red-50 dark:bg-red-900/20 border-red-200",         bar: "bg-red-500",     icon: XCircle },
};

export default function AdminPropertiesPage() {
  const { data, isFetching } = useGetPropertiesForManagmentQuery();
  const changeStatus = useChangePropertyStatusMutation();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "APPROVED" | "PENDING" | "REJECTED">("all");

  const properties: any[] = data?.data || [];
  const filtered = properties.filter((p) => {
    const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase()) || p.address?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const counts = {
    all: properties.length,
    APPROVED: properties.filter(p => p.status === "APPROVED").length,
    PENDING: properties.filter(p => p.status === "PENDING").length,
    REJECTED: properties.filter(p => p.status === "REJECTED").length,
  };

  if (isFetching) return <LoaderState />;

  return (
    <div className="min-h-screen bg-background">
      <div className="px-4 py-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Properties</h1>
              <p className="text-sm text-muted-foreground">Manage and approve all properties</p>
            </div>
          </div>
          <Link href="/admin/properties/create">
            <Button className="gap-2 shrink-0"><Plus className="h-4 w-4" /> Add Property</Button>
          </Link>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {(["all", "APPROVED", "PENDING", "REJECTED"] as const).map((s) => {
            const cfg = s === "all" ? null : statusConfig[s];
            const Icon = cfg?.icon ?? Home;
            return (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={cn(
                  "relative overflow-hidden p-4 rounded-xl border text-left hover:shadow-md transition-all select-none",
                  statusFilter === s ? "ring-2 ring-primary border-primary/30" : "border-border bg-card hover:border-primary/20"
                )}>
                {cfg && <div className={cn("absolute top-0 left-0 right-0 h-0.5", cfg.bar)} />}
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs text-muted-foreground capitalize">{s === "all" ? "All" : cfg?.label}</p>
                  <Icon className={cn("h-3.5 w-3.5", cfg?.color ?? "text-primary")} />
                </div>
                <p className="text-2xl font-bold">{counts[s]}</p>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by name or address..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Building2 className="w-14 h-14 mx-auto mb-4 opacity-20" />
            <p className="text-lg font-medium">No properties found</p>
            <p className="text-sm mt-1">Try adjusting your search or filter</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((property: any) => {
              const status = statusConfig[property.status] || statusConfig.PENDING;
              const StatusIcon = status.icon;
              return (
                <div key={property.id}
                  className="group relative overflow-hidden rounded-2xl border border-border bg-card hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
                  {/* Color bar */}
                  <div className={cn("absolute top-0 left-0 right-0 h-0.5", status.bar)} />

                  {/* Image */}
                  <div className="relative h-44 overflow-hidden bg-muted">
                    {property.images?.[0]?.url ? (
                      <img src={property.images[0].url} alt={property.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Building2 className="w-12 h-12 text-muted-foreground opacity-20" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    {/* Status badge on image */}
                    <div className="absolute top-3 right-3">
                      <Badge variant="outline" className={cn("text-xs gap-1 backdrop-blur-sm bg-background/80", status.bg, status.color)}>
                        <StatusIcon className="h-3 w-3" />{status.label}
                      </Badge>
                    </div>
                    {/* Type badge */}
                    <div className="absolute top-3 left-3">
                      <Badge className="text-xs bg-primary/90 backdrop-blur-sm">{property.type || "Property"}</Badge>
                    </div>
                    {/* Image count */}
                    {property.images?.length > 1 && (
                      <div className="absolute bottom-2 right-2 text-xs text-white bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-full">
                        +{property.images.length - 1} photos
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-bold text-base mb-1 group-hover:text-primary transition-colors line-clamp-1">{property.name}</h3>
                    {property.address && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                        <MapPin className="h-3 w-3 text-primary shrink-0" />
                        <span className="line-clamp-1">{property.address}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                      <div className="flex items-center gap-1 bg-muted/50 px-2 py-1 rounded-full">
                        <Bed className="h-3 w-3" />{property._count?.rooms ?? 0} rooms
                      </div>
                      <div className="flex items-center gap-1 bg-muted/50 px-2 py-1 rounded-full">
                        <Calendar className="h-3 w-3" />{format(new Date(property.createdAt), "MMM d, yyyy")}
                      </div>
                    </div>

                    {property.statusReason && (
                      <p className="text-xs text-red-500 mb-3 bg-red-50 dark:bg-red-900/10 px-2 py-1 rounded">
                        Reason: {property.statusReason}
                      </p>
                    )}

                    <div className="flex gap-2">
                      <Link href={`/admin/properties/${property.id}`} className="flex-1">
                        <Button size="sm" variant="outline" className="w-full gap-1.5 h-8 text-xs">
                          <Eye className="h-3.5 w-3.5" /> View Details
                        </Button>
                      </Link>
                      {property.status !== "APPROVED" && (
                        <Button size="sm" onClick={() => changeStatus.mutate({ id: property.id, status: "APPROVED" })}
                          disabled={changeStatus.isPending}
                          className="gap-1.5 h-8 text-xs bg-emerald-600 hover:bg-emerald-700">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
