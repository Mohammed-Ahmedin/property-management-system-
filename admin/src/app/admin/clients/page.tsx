"use client";

import React, { useState, useMemo } from "react";
import { useGetClientsQuery } from "@/hooks/api/use-users";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/shared/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Mail, Phone, Calendar, User } from "lucide-react";
import { formatDate } from "date-fns";
import LoaderState from "@/components/shared/loader-state";

export default function ClientsPage() {
  const { data, isFetching, isError, refetch } = useGetClientsQuery();
  const [search, setSearch] = useState("");

  const clients = useMemo(() => {
    const all = Array.isArray(data) ? data : [];
    if (!search) return all;
    return all.filter(
      (u: any) =>
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  if (isFetching) return <LoaderState />;
  if (isError) return (
    <div className="py-20 text-center">
      <p className="text-destructive font-medium">Failed to load clients</p>
      <Button variant="outline" className="mt-4" onClick={() => refetch()}>Retry</Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Clients</h1>
          <p className="text-sm text-muted-foreground mt-1">{clients.length} guest{clients.length !== 1 ? "s" : ""} registered</p>
        </div>
      </div>

      <div className="relative max-w-md mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {clients.length === 0 ? (
        <div className="py-20 text-center">
          <User className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="text-lg font-medium">No clients found</h3>
          <p className="text-sm text-muted-foreground mt-1">No guest accounts registered yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {clients.map((client: any) => (
            <Card key={client.id} className="hover:border-accent/50 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar src={client.image} alt={client.name} fallback={client.name} size="lg" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium truncate">{client.name}</p>
                      <Badge variant={client.banned ? "destructive" : "outline"} className="shrink-0 text-xs">
                        {client.banned ? "Banned" : "Active"}
                      </Badge>
                    </div>
                    <div className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Mail className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{client.email}</span>
                      </div>
                      {client.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-3.5 w-3.5 shrink-0" />
                          <span>{client.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 shrink-0" />
                        <span>Joined {formatDate(client.createdAt, "MMM d, yyyy")}</span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3 w-full"
                      onClick={() => window.open(`mailto:${client.email}`)}
                    >
                      <Mail className="h-3.5 w-3.5 mr-2" />
                      Contact
                    </Button>
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
