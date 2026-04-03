"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { CheckCircle2, XCircle, Search, Building2, Loader2, Plus, Eye } from "lucide-react";
import { useGetPropertiesForManagmentQuery, useChangePropertyStatusMutation } from "@/hooks/api/use-property";
import LoaderState from "@/components/shared/loader-state";
import Link from "next/link";

const statusColor = (status: string) => {
  if (status === "APPROVED") return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (status === "REJECTED") return "bg-red-50 text-red-700 border-red-200";
  return "bg-amber-50 text-amber-700 border-amber-200";
};

export default function AdminPropertiesPage() {
  const { data, isFetching } = useGetPropertiesForManagmentQuery();
  const changeStatus = useChangePropertyStatusMutation();
  const [search, setSearch] = useState("");
  const [rejectDialog, setRejectDialog] = useState<{ id: string; name: string } | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const properties: any[] = data?.data || [];
  const filtered = properties.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleApprove = (id: string) => changeStatus.mutate({ id, status: "APPROVED" });

  const handleReject = () => {
    if (!rejectDialog) return;
    changeStatus.mutate(
      { id: rejectDialog.id, status: "REJECTED", reason: rejectReason || undefined },
      { onSuccess: () => { setRejectDialog(null); setRejectReason(""); } }
    );
  };

  if (isFetching) return <LoaderState />;

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Properties</h1>
          <p className="text-sm text-muted-foreground">Manage and approve all properties</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search properties..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Link href="/admin/properties/create">
            <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Add Property</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Building2 className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>No properties found</p>
          </div>
        ) : (
          filtered.map((property: any) => (
            <Card key={property.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-4 flex-1 min-w-0">
                    {property.images?.[0]?.url && (
                      <img src={property.images[0].url} alt={property.name} className="w-20 h-16 object-cover rounded-lg shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold truncate">{property.name}</h3>
                        <Badge variant="outline" className={statusColor(property.status)}>{property.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{property.address}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span>{property._count?.rooms ?? 0} rooms</span>
                        <span>·</span>
                        <span>Created {new Date(property.createdAt).toLocaleDateString()}</span>
                      </div>
                      {property.statusReason && <p className="text-xs text-red-500 mt-1">Reason: {property.statusReason}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
                    <Link href={`/admin/properties/${property.id}`}>
                      <Button size="sm" variant="outline"><Eye className="h-4 w-4 mr-1" /> View</Button>
                    </Link>
                    {property.status !== "APPROVED" && (
                      <Button size="sm" onClick={() => handleApprove(property.id)} disabled={changeStatus.isPending} className="bg-emerald-600 hover:bg-emerald-700">
                        <CheckCircle2 className="h-4 w-4 mr-1" /> Approve
                      </Button>
                    )}
                    {property.status !== "REJECTED" && (
                      <Button size="sm" variant="destructive" onClick={() => setRejectDialog({ id: property.id, name: property.name })} disabled={changeStatus.isPending}>
                        <XCircle className="h-4 w-4 mr-1" /> Reject
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={!!rejectDialog} onOpenChange={(o) => { if (!o) { setRejectDialog(null); setRejectReason(""); } }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Property</DialogTitle>
            <DialogDescription>Rejecting: <strong>{rejectDialog?.name}</strong>. Optionally provide a reason.</DialogDescription>
          </DialogHeader>
          <Textarea placeholder="Reason for rejection (optional)" value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} rows={3} className="mt-2" />
          <div className="flex gap-2 justify-end mt-4">
            <Button variant="outline" onClick={() => { setRejectDialog(null); setRejectReason(""); }}>Cancel</Button>
            <Button variant="destructive" onClick={handleReject} disabled={changeStatus.isPending}>
              {changeStatus.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null} Confirm Rejection
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const statusColor = (status: string) => {
  if (status === "APPROVED") return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (status === "REJECTED") return "bg-red-50 text-red-700 border-red-200";
  return "bg-amber-50 text-amber-700 border-amber-200";
};

export default function AdminPropertiesPage() {
  const { data, isFetching, refetch } = useGetPropertiesForManagmentQuery();
  const changeStatus = useChangePropertyStatusMutation();
  const [search, setSearch] = useState("");
  const [rejectDialog, setRejectDialog] = useState<{ id: string; name: string } | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const properties: any[] = data?.data || [];
  const filtered = properties.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleApprove = (id: string) => {
    changeStatus.mutate({ id, status: "APPROVED" });
  };

  const handleReject = () => {
    if (!rejectDialog) return;
    changeStatus.mutate(
      { id: rejectDialog.id, status: "REJECTED", reason: rejectReason || undefined },
      { onSuccess: () => { setRejectDialog(null); setRejectReason(""); } }
    );
  };

  if (isFetching) return <LoaderState />;

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Properties</h1>
          <p className="text-sm text-muted-foreground">Review and approve property submissions</p>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search properties..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Building2 className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>No properties found</p>
          </div>
        ) : (
          filtered.map((property: any) => (
            <Card key={property.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-4 flex-1 min-w-0">
                    {property.images?.[0]?.url && (
                      <img
                        src={property.images[0].url}
                        alt={property.name}
                        className="w-20 h-16 object-cover rounded-lg shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold truncate">{property.name}</h3>
                        <Badge variant="outline" className={statusColor(property.status)}>
                          {property.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{property.address}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span>{property._count?.rooms ?? 0} rooms</span>
                        <span>·</span>
                        <span>Created {new Date(property.createdAt).toLocaleDateString()}</span>
                      </div>
                      {property.statusReason && (
                        <p className="text-xs text-red-500 mt-1">Reason: {property.statusReason}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {property.status !== "APPROVED" && (
                      <Button
                        size="sm"
                        onClick={() => handleApprove(property.id)}
                        disabled={changeStatus.isPending}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        <CheckCircle2 className="h-4 w-4 mr-1" /> Approve
                      </Button>
                    )}
                    {property.status !== "REJECTED" && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setRejectDialog({ id: property.id, name: property.name })}
                        disabled={changeStatus.isPending}
                      >
                        <XCircle className="h-4 w-4 mr-1" /> Reject
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Reject Dialog */}
      <Dialog open={!!rejectDialog} onOpenChange={(o) => { if (!o) { setRejectDialog(null); setRejectReason(""); } }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Property</DialogTitle>
            <DialogDescription>
              Rejecting: <strong>{rejectDialog?.name}</strong>. Optionally provide a reason.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <Textarea
              placeholder="Reason for rejection (optional)"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => { setRejectDialog(null); setRejectReason(""); }}>Cancel</Button>
            <Button variant="destructive" onClick={handleReject} disabled={changeStatus.isPending}>
              {changeStatus.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Confirm Rejection
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
