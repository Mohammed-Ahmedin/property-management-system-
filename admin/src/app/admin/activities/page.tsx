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
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: activitiesData, isFetching } = useGetActivities();
  const activities: any[] = activitiesData?.data || [];

  const filteredActivities = useMemo(() => {
    return activities.filter((activity) => {
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
                  {uniqueActions.map((action) => <SelectItem key={action} value={action}>{action.replace(/_/g, " ")}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}>
                <SelectTrigger className="w-[180px]"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {uniqueStatuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
              {(searchQuery || actionFilter !== "all" || statusFilter !== "all") && (
                <Button variant="outline" onClick={() => { setSearchQuery(""); setActionFilter("all"); setStatusFilter("all"); setCurrentPage(1); }}>Clear Filters</Button>
              )}
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{filteredActivities.length}</span> {filteredActivities.length === 1 ? "activity" : "activities"} found
          </div>
        </Card>

        <div className="space-y-3">
          {paginatedActivities.length > 0 ? (
            paginatedActivities.map((activity) => <ActivityItem key={activity.id} activity={activity} />)
          ) : (
            <Card className="p-12 text-center"><p className="text-muted-foreground">No activities found.</p></Card>
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
  {
    id: "1",
    action: "BOOKED",
    status: "INFO",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    user: { id: "u1", name: "Sarah Johnson", email: "sarah@example.com" },
    description: "New booking created for Ocean View Suite",
    bookingId: "bk_abc123def456",
    roomId: "rm_xyz789",
    ipAddress: "192.168.1.100",
  },
  {
    id: "2",
    action: "PAYMENT_SUCCESS",
    status: "INFO",
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    user: { id: "u2", name: "Michael Chen", email: "michael@example.com" },
    description: "Payment of $450.00 processed successfully",
    bookingId: "bk_def456ghi789",
    ipAddress: "192.168.1.101",
  },
  {
    id: "3",
    action: "CHECKED_IN",
    status: "INFO",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    user: { id: "u3", name: "Emma Wilson", email: "emma@example.com" },
    description: "Guest checked in to room 204",
    bookingId: "bk_ghi789jkl012",
    roomId: "rm_abc123",
    ipAddress: "192.168.1.102",
  },
  {
    id: "4",
    action: "PAYMENT_FAILED",
    status: "ERROR",
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    user: { id: "u4", name: "James Brown", email: "james@example.com" },
    description: "Payment declined - insufficient funds",
    bookingId: "bk_jkl012mno345",
    ipAddress: "192.168.1.103",
  },
  {
    id: "5",
    action: "CREATE_GUEST_HOUSE",
    status: "INFO",
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    user: { id: "u5", name: "Admin User", email: "admin@example.com" },
    description: 'New property "Sunset Villa" created',
    propertyId: "gh_pqr678",
    ipAddress: "192.168.1.104",
  },
  {
    id: "6",
    action: "CANCELLED_BOOKING",
    status: "WARN",
    timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    user: { id: "u6", name: "Olivia Martinez", email: "olivia@example.com" },
    description: "Booking cancelled by guest",
    bookingId: "bk_stu901vwx234",
    ipAddress: "192.168.1.105",
  },
  {
    id: "7",
    action: "LOGIN",
    status: "INFO",
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    user: { id: "u7", name: "David Lee", email: "david@example.com" },
    description: "User logged in successfully",
    ipAddress: "192.168.1.106",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
  },
  {
    id: "8",
    action: "UPDATE_ROOM",
    status: "INFO",
    timestamp: new Date(Date.now() - 1000 * 60 * 150).toISOString(),
    user: { id: "u5", name: "Admin User", email: "admin@example.com" },
    description: "Room details updated - price changed to $350/night",
    roomId: "rm_def456",
    ipAddress: "192.168.1.104",
  },
  {
    id: "9",
    action: "CHECKED_OUT",
    status: "INFO",
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    user: { id: "u8", name: "Sophia Taylor", email: "sophia@example.com" },
    description: "Guest checked out from room 305",
    bookingId: "bk_yza567bcd890",
    roomId: "rm_ghi789",
    ipAddress: "192.168.1.107",
  },
  {
    id: "10",
    action: "USER_BANNED",
    status: "CRITICAL",
    timestamp: new Date(Date.now() - 1000 * 60 * 210).toISOString(),
    user: { id: "u5", name: "Admin User", email: "admin@example.com" },
    description: "User banned for violating terms of service",
    ipAddress: "192.168.1.104",
  },
  {
    id: "11",
    action: "APPROVED_BOOKING",
    status: "INFO",
    timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    user: { id: "u5", name: "Admin User", email: "admin@example.com" },
    description: "Booking request approved",
    bookingId: "bk_efg123hij456",
    ipAddress: "192.168.1.104",
  },
  {
    id: "12",
    action: "PASSWORD_RESET",
    status: "WARN",
    timestamp: new Date(Date.now() - 1000 * 60 * 270).toISOString(),
    user: { id: "u9", name: "Liam Anderson", email: "liam@example.com" },
    description: "Password reset requested",
    ipAddress: "192.168.1.108",
  },
  {
    id: "13",
    action: "CREATE_ROOM",
    status: "INFO",
    timestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    user: { id: "u5", name: "Admin User", email: "admin@example.com" },
    description: 'New room "Deluxe Suite 401" added',
    roomId: "rm_klm012",
    propertyId: "gh_pqr678",
    ipAddress: "192.168.1.104",
  },
  {
    id: "14",
    action: "REPORT_SUBMITTED",
    status: "WARN",
    timestamp: new Date(Date.now() - 1000 * 60 * 330).toISOString(),
    user: { id: "u10", name: "Ava Garcia", email: "ava@example.com" },
    description: "Guest reported maintenance issue in room",
    roomId: "rm_nop345",
    ipAddress: "192.168.1.109",
  },
  {
    id: "15",
    action: "COMMISSION_UPDATED",
    status: "INFO",
    timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    user: { id: "u5", name: "Admin User", email: "admin@example.com" },
    description: "Commission rate updated to 15%",
    propertyId: "gh_pqr678",
    ipAddress: "192.168.1.104",
  },
  {
    id: "16",
    action: "UPDATED_BOOKING",
    status: "INFO",
    timestamp: new Date(Date.now() - 1000 * 60 * 390).toISOString(),
    user: { id: "u11", name: "Noah White", email: "noah@example.com" },
    description: "Booking dates modified",
    bookingId: "bk_qrs678tuv901",
    ipAddress: "192.168.1.110",
  },
  {
    id: "17",
    action: "LOGOUT",
    status: "INFO",
    timestamp: new Date(Date.now() - 1000 * 60 * 420).toISOString(),
    user: { id: "u7", name: "David Lee", email: "david@example.com" },
    description: "User logged out",
    ipAddress: "192.168.1.106",
  },
  {
    id: "18",
    action: "REJECTED_BOOKING",
    status: "WARN",
    timestamp: new Date(Date.now() - 1000 * 60 * 450).toISOString(),
    user: { id: "u5", name: "Admin User", email: "admin@example.com" },
    description: "Booking request rejected - dates unavailable",
    bookingId: "bk_wxy234zab567",
    ipAddress: "192.168.1.104",
  },
  {
    id: "19",
    action: "DELETE_ROOM",
    status: "WARN",
    timestamp: new Date(Date.now() - 1000 * 60 * 480).toISOString(),
    user: { id: "u5", name: "Admin User", email: "admin@example.com" },
    description: "Room removed from listing",
    roomId: "rm_cde890",
    ipAddress: "192.168.1.104",
  },
  {
    id: "20",
    action: "REPORT_APPROVED",
    status: "INFO",
    timestamp: new Date(Date.now() - 1000 * 60 * 510).toISOString(),
    user: { id: "u5", name: "Admin User", email: "admin@example.com" },
    description: "Maintenance report approved and assigned",
    roomId: "rm_nop345",
    ipAddress: "192.168.1.104",
  },
];

export default function ActivityDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredActivities = useMemo(() => {
    return mockActivities.filter((activity) => {
      const matchesSearch =
        searchQuery === "" ||
        activity.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.description
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        activity.user?.name.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesAction =
        actionFilter === "all" || activity.action === actionFilter;
      const matchesStatus =
        statusFilter === "all" || activity.status === statusFilter;

      return matchesSearch && matchesAction && matchesStatus;
    });
  }, [searchQuery, actionFilter, statusFilter]);

  const totalPages = Math.ceil(filteredActivities.length / ITEMS_PER_PAGE);
  const paginatedActivities = filteredActivities.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const uniqueActions = Array.from(
    new Set(mockActivities.map((a) => a.action))
  );
  const uniqueStatuses = Array.from(
    new Set(mockActivities.map((a) => a.status))
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Filters */}
        <Card className="mb-6 p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative flex-1 lg:max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search activities..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <Select
                value={actionFilter}
                onValueChange={(value) => {
                  setActionFilter(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  {uniqueActions.map((action) => (
                    <SelectItem key={action} value={action}>
                      {action.replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={statusFilter}
                onValueChange={(value) => {
                  setStatusFilter(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {uniqueStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {(searchQuery ||
                actionFilter !== "all" ||
                statusFilter !== "all") && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setActionFilter("all");
                    setStatusFilter("all");
                    setCurrentPage(1);
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">
              {filteredActivities.length}
            </span>
            {filteredActivities.length === 1 ? "activity" : "activities"} found
          </div>
        </Card>

        {/* Activity List */}
        <div className="space-y-3">
          {paginatedActivities.length > 0 ? (
            paginatedActivities.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))
          ) : (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">
                No activities found matching your filters.
              </p>
            </Card>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
