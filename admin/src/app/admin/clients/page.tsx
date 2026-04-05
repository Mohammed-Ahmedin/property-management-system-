"use client";

import React, { useState, useMemo } from "react";
import { useGetClientsQuery } from "@/hooks/api/use-users";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/shared/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Mail, Phone, Calendar, User, Users, CheckCircle2, Ban, RefreshCw } from "lucide-react";
import { formatDate } from "date-fns";
import LoaderState from "@/components/shared/loader-state";
import { cn } from "@/lib/utils";

export default function ClientsPage() {
  const { data, isFetching, isError, refetch } = useGetClientsQuery();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "banned">("all");

  const clients = useMemo(() => {
    const all = Array.isArray(data) ? data : [];
    return all.filter((u: any) => {
      const matchesSearch = !search || u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === "all" || (filter === "active" && !u.banned) || (filter === "banned" && u.banned);
      return matchesSearch && matchesFilter;
    });
  }, [data, search, filter]);

  const all = Array.isArray(data) ? data : [];
  const activeCount = all.filter((u: any) => !u.banned).length;
  const bannedCount = all.filter((u: any) => u.banned).length;

  if (isFetching) return <LoaderState />;
  if (isError) return (
    <div className="py-20 text-center">
      <div className="p-4 rounded-full bg-red-50 dark:bg-red-900/20 w-fit mx-auto mb-4">
        <User className="h-8 w-8 text-red-500" />
      </div>
      <p className="font-semibold text-lg mb-1">Failed to load clients</p>
      <Button variant="outline" className="mt-2 gap-2" onClick={() => refetch()}><RefreshCw className="h-4 w-4" /> Retry</Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="px-4 py-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Clients</h1>
              <p className="text-sm text-muted-foreground">{all.length} registered guests</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: "Total", value: all.length, color: "text-primary", bg: "bg-primary/10", onClick: () => setFilter("all") },
            { label: "Active", value: activeCount, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20", onClick: () => setFilter("active") },
            { label: "Banned", value: bannedCount, color: "text-red-600", bg: "bg-red-50 dark:bg-red-900/20", onClick: () => setFilter("banned") },
          ].map(({ label, value, color, bg, onClick }) => (
            <Card key={label} className={cn("p-4 cursor-pointer hover:shadow-md transition-all", filter === label.toLowerCase() && "ring-2 ring-primary")} onClick={onClick}>
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            </Card>
          ))}
        </div>

        {/* Search + filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <div className="flex rounded-lg border border-border overflow-hidden">
            {(["all", "active", "banned"] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={cn("px-4 py-2 text-sm font-medium capitalize transition-colors",
                  filter === f ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground"
                )}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {clients.length === 0 ? (
          <div className="py-20 text-center">
            <div className="p-5 rounded-full bg-muted w-fit mx-auto mb-4">
              <User className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No clients found</h3>
            <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filter.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {clients.map((client: any) => (
              <Card key={client.id} className="group hover:shadow-lg hover:border-primary/30 transition-all duration-200">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3 mb-4">
                    <Avatar src={client.image} alt={client.name} fallback={client.name} size="lg" className="shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p className="font-semibold truncate group-hover:text-primary transition-colors">{client.name}</p>
                        <Badge variant={client.banned ? "destructive" : "outline"}
                          className={cn("shrink-0 text-xs gap-1", !client.banned && "border-emerald-300 text-emerald-700 bg-emerald-50 dark:bg-emerald-900/20")}>
                          {client.banned ? <><Ban className="h-2.5 w-2.5" /> Banned</> : <><CheckCircle2 className="h-2.5 w-2.5" /> Active</>}
                        </Badge>
                      </div>
                      {client.emailVerified && (
                        <span className="text-xs text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Verified
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground mb-4">
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
                  <Button variant="outline" size="sm" className="w-full text-xs h-8 gap-1.5" onClick={() => window.open(`mailto:${client.email}`)}>
                    <Mail className="h-3 w-3" /> Send Email
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
