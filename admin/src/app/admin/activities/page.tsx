"use client";

import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import { ActivityItem } from "./activity-item";
import { useGetActivities } from "@/hooks/api/use-bookings";
import LoaderState from "@/components/shared/loader-state";

const ITEMS_PER_PAGE = 20;

export default function ActivityDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: activitiesData, isFetching } = useGetActivities();
  const activities = activitiesData?.data || [];

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

  const uniqueActions = Array.from(new Set(activities.map((a) => a.action)));
  const uniqueStatuses = Array.from(new Set(activities.map((a) => a.status)));

  if (isFetching) return <LoaderState />;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Card className="mb-6 p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative flex-1 lg:max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search activities..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} className="pl-9" />
            </div>
            <div className="flex flex-wrap gap-3">
              <Select value={actionFilter} onValueChange={(v) => { setActionFilter(v); setCurrentPage(1); }}>
                <SelectTrigger className="w-[180px]"><Filter className="mr-2 h-4 w-4" /><SelectValue placeholder="Action" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  {uniqueActions.map((action) => (
                    <SelectItem key={action} value={action}>{action.replace(/_/g, " ")}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}>
                <SelectTrigger className="w-[180px]"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {uniqueStatuses.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {(searchQuery || actionFilter !== "all" || statusFilter !== "all") && (
                <Button variant="outline" onClick={() => { setSearchQuery(""); setActionFilter("all"); setStatusFilter("all"); setCurrentPage(1); }}>
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{filteredActivities.length}</span>
            {filteredActivities.length === 1 ? " activity" : " activities"} found
          </div>
        </Card>

        <div className="space-y-3">
          {paginatedActivities.length > 0 ? (
            paginatedActivities.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))
          ) : (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">No activities found.</p>
            </Card>
          )}
        </div>

        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Page {currentPage} of {totalPages}</p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>Previous</Button>
              <Button variant="outline" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
