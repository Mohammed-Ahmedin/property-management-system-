"use client";

import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Activity, CheckCircle2, XCircle, Calendar, RefreshCw } from "lucide-react";
import { ActivityItem } from "./activity-item";
import { useGetActivities } from "@/hooks/api/use-bookings";
import LoaderState from "@/components/shared/loader-state";

const ITEMS_PER_PAGE = 20;

const ACTION_COLORS: Record<string, string> = {
  APPROVED_BOOKING: "bg-emerald-100 text-emerald-700 border-emerald-200",
  REJECTED_BOOKING: "bg-red-100 text-red-700 border-red-200",
  CANCELLED_BOOKING: "bg-gray-100 text-gray-700 border-gray-200",
  BOOKED: "bg-blue-100 text-blue-700 border-blue-200",
  CREATE_GUEST_HOUSE: "bg-purple-100 text-purple-700 border-purple-200",
};

export default function ActivityDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: activitiesData, isFetching, refetch } = useGetActivities();
  const activities: any[] = activitiesData?.data || [];

  const filteredActivities = useMemo(() => {
    return activities.filter((activity: any) => {
      const matchesSearch =
        searchQuery === "" ||
        activity.action?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.user?.name?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesAction = actionFilter === "all" || activity.action === actionFilter;
      const matchesStatus = statusFilter === "all" || activity.status === statusFilter;
      return matchesSearch && matchesAction && matchesStatus;
    });
  }, [activities, searchQuery, actionFilter, statusFilter]);

  const totalPages = Math.ceil(filteredActivities.length / ITEMS_PER_PAGE);
  const paginatedActivities = filteredActivities.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const uniqueActions: string[] = Array.from(new Set<string>(activities.map((a: any) => String(a.action || ""))));
  const uniqueStatuses: string[] = Array.from(new Set<string>(activities.map((a: any) => String(a.status || ""))));

  // Quick stats
  const stats = useMemo(() => ({
    total: activities.length,
    approved: activities.filter(a => a.action === "APPROVED_BOOKING").length,
    rejected: activities.filter(a => a.action === "REJECTED_BOOKING").length,
    booked: activities.filter(a => a.action === "BOOKED").length,
  }), [activities]);

  if (isFetching) return <LoaderState />;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10">
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Activity Log</h1>
              <p className="text-sm text-muted-foreground">{activities.length} total events</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-2">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </Button>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Total", value: stats.total, icon: <Activity className="w-4 h-4" />, color: "text-primary", bg: "bg-primary/10" },
            { label: "Reserved", value: stats.approved, icon: <CheckCircle2 className="w-4 h-4" />, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
            { label: "Rejected", value: stats.rejected, icon: <XCircle className="w-4 h-4" />, color: "text-red-600", bg: "bg-red-50 dark:bg-red-900/20" },
            { label: "New Bookings", value: stats.booked, icon: <Calendar className="w-4 h-4" />, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
          ].map(({ label, value, icon, color, bg }) => (
            <Card key={label} className="p-4 hover:shadow-md transition-shadow cursor-default">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${bg} ${color}`}>{icon}</div>
                <div>
                  <p className="text-2xl font-bold">{value}</p>
                  <p className="text-xs text-muted-foreground">{label}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card className="mb-5 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search activities, users, descriptions..." value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} className="pl-9" />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={actionFilter} onValueChange={(v) => { setActionFilter(v); setCurrentPage(1); }}>
                <SelectTrigger className="w-[160px]"><Filter className="mr-2 h-3.5 w-3.5" /><SelectValue placeholder="Action" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  {uniqueActions.map((action) => (
                    <SelectItem key={action} value={action}>
                      <span className="flex items-center gap-2">
                        <Badge variant="outline" className={`text-xs ${ACTION_COLORS[action] || ""}`}>{action.replace(/_/g, " ")}</Badge>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}>
                <SelectTrigger className="w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {uniqueStatuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
              {(searchQuery || actionFilter !== "all" || statusFilter !== "all") && (
                <Button variant="ghost" size="sm" onClick={() => { setSearchQuery(""); setActionFilter("all"); setStatusFilter("all"); setCurrentPage(1); }}>
                  Clear
                </Button>
              )}
            </div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{filteredActivities.length}</span> of {activities.length} activities
          </p>
        </Card>

        {/* List */}
        <div className="space-y-2.5">
          {paginatedActivities.length > 0 ? (
            paginatedActivities.map((activity: any) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))
          ) : (
            <Card className="p-16 text-center">
              <Activity className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-30" />
              <p className="text-muted-foreground font-medium">No activities found</p>
              <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters</p>
            </Card>
          )}
        </div>

        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Page {currentPage} of {totalPages}</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>Previous</Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
