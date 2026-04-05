"use client";

import React, { useState } from "react";
import { useGetStaffsForListQuery } from "@/hooks/api/use-staff";
import { Avatar } from "@/components/shared/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Users, AlertTriangle, Search, Mail, Briefcase, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const StaffsPage = () => {
  const { data, isFetching, isError, refetch } = useGetStaffsForListQuery();
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"all" | "staff" | "broker">("all");

  if (isFetching) return <div className="flex items-center justify-center py-20"><Spinner className="size-10" /></div>;

  if (isError) return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="p-4 rounded-full bg-red-50 dark:bg-red-900/20 mb-4">
        <AlertTriangle className="h-8 w-8 text-red-500" />
      </div>
      <p className="font-semibold text-lg mb-1">Failed to load staff</p>
      <p className="text-sm text-muted-foreground mb-4">Check your connection and try again</p>
      <Button onClick={() => refetch()} variant="outline" className="gap-2"><RefreshCw className="h-4 w-4" /> Retry</Button>
    </div>
  );

  const all: any[] = data || [];
  const staffMembers = all.filter((s: any) => s.role !== "BROKER");
  const brokers = all.filter((s: any) => s.role === "BROKER");

  const filtered = all.filter((s: any) => {
    const matchesTab = tab === "all" || (tab === "staff" && s.role !== "BROKER") || (tab === "broker" && s.role === "BROKER");
    const matchesSearch = !search || s.name?.toLowerCase().includes(search.toLowerCase()) || s.email?.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  if (!all.length) return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="p-5 rounded-full bg-muted mb-4">
        <Users className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-1">No staff members yet</h3>
      <p className="text-sm text-muted-foreground">Add staff from a property's staff tab.</p>
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
              <h1 className="text-xl font-bold">Staff & Brokers</h1>
              <p className="text-sm text-muted-foreground">{all.length} members total</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: "Total", value: all.length, color: "text-primary", bg: "bg-primary/10" },
            { label: "Staff", value: staffMembers.length, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
            { label: "Brokers", value: brokers.length, color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-900/20" },
          ].map(({ label, value, color, bg }) => (
            <Card key={label} className="p-4 hover:shadow-md transition-shadow">
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            </Card>
          ))}
        </div>

        {/* Search + tabs */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <div className="flex rounded-lg border border-border overflow-hidden">
            {(["all", "staff", "broker"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={cn("px-4 py-2 text-sm font-medium capitalize transition-colors",
                  tab === t ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground"
                )}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground">
            <Users className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p>No members match your search</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((staff: any) => (
              <Card key={staff.id} className="group hover:shadow-lg hover:border-primary/30 transition-all duration-200">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <Avatar name={staff.name} src={staff.image} size="lg" className="shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p className="font-semibold truncate group-hover:text-primary transition-colors">{staff.name}</p>
                        <Badge variant={staff.role === "BROKER" ? "default" : "secondary"} className="shrink-0 text-xs">
                          {staff.role === "BROKER" ? "Broker" : "Staff"}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Mail className="h-3 w-3 shrink-0" />
                          <span className="truncate">{staff.email}</span>
                        </div>
                        {staff.property?.name && (
                          <div className="flex items-center gap-1.5">
                            <Briefcase className="h-3 w-3 shrink-0" />
                            <span className="truncate">{staff.property.name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-border flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 text-xs h-8" onClick={() => window.open(`mailto:${staff.email}`)}>
                      <Mail className="h-3 w-3 mr-1" /> Email
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffsPage;
