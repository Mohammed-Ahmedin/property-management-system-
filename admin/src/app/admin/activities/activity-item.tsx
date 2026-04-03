import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";
import {
  CheckCircle2, XCircle, AlertCircle,
  Calendar, User, Bed, Hash, Clock, MessageSquare, Info, Building2,
} from "lucide-react";
import { Avatar } from "@/components/shared/avatar";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ActivityItemProps {
  activity: any;
}

const actionMeta: Record<string, { label: string; color: string; icon: any; bg: string }> = {
  APPROVED_BOOKING:   { label: "Approved Booking",   color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20", icon: CheckCircle2 },
  REJECTED_BOOKING:   { label: "Rejected Booking",   color: "text-red-600",     bg: "bg-red-50 dark:bg-red-900/20",         icon: XCircle },
  CANCELLED_BOOKING:  { label: "Cancelled Booking",  color: "text-gray-600",    bg: "bg-gray-50 dark:bg-gray-900/20",        icon: XCircle },
  BOOKED:             { label: "New Booking",         color: "text-blue-600",    bg: "bg-blue-50 dark:bg-blue-900/20",        icon: Calendar },
  UPDATED_BOOKING:    { label: "Booking Updated",     color: "text-amber-600",   bg: "bg-amber-50 dark:bg-amber-900/20",      icon: AlertCircle },
  PAYMENT_SUCCESS:    { label: "Payment Success",     color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20", icon: CheckCircle2 },
  PAYMENT_FAILED:     { label: "Payment Failed",      color: "text-red-600",     bg: "bg-red-50 dark:bg-red-900/20",         icon: XCircle },
  CREATE_GUEST_HOUSE: { label: "Property Created",    color: "text-blue-600",    bg: "bg-blue-50 dark:bg-blue-900/20",        icon: AlertCircle },
  CREATE_ROOM:        { label: "Room Created",        color: "text-blue-600",    bg: "bg-blue-50 dark:bg-blue-900/20",        icon: Bed },
  UPDATE_ROOM:        { label: "Room Updated",        color: "text-amber-600",   bg: "bg-amber-50 dark:bg-amber-900/20",      icon: Bed },
  DELETE_ROOM:        { label: "Room Deleted",        color: "text-red-600",     bg: "bg-red-50 dark:bg-red-900/20",         icon: Bed },
};

const defaultMeta = { label: "", color: "text-muted-foreground", bg: "bg-muted/30", icon: AlertCircle };

// Parse structured info from description
function parseDescription(desc: string) {
  if (!desc) return {};
  const result: Record<string, string> = {};
  // Try to extract reason
  const reasonMatch = desc.match(/Reason:\s*(.+?)(?:\.|$)/i);
  if (reasonMatch) result.reason = reasonMatch[1].trim();
  return result;
}

export function ActivityItem({ activity }: ActivityItemProps) {
  const meta = actionMeta[activity.action] || { ...defaultMeta, label: activity.action?.replace(/_/g, " ") };
  const Icon = meta.icon;
  const parsed = parseDescription(activity.description || "");
  const [infoOpen, setInfoOpen] = useState(false);

  const isBookingAction = ["APPROVED_BOOKING", "REJECTED_BOOKING", "CANCELLED_BOOKING", "BOOKED", "UPDATED_BOOKING"].includes(activity.action);
  const actionVerb = activity.action === "APPROVED_BOOKING" ? "Approved" : activity.action === "REJECTED_BOOKING" ? "Rejected" : activity.action === "CANCELLED_BOOKING" ? "Cancelled" : null;

  return (
    <>
      {/* Info Dialog */}
      <Dialog open={infoOpen} onOpenChange={setInfoOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className={cn("p-1.5 rounded-lg", meta.bg)}>
                <Icon className={cn("h-4 w-4", meta.color)} />
              </div>
              Activity Details
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-muted/40 border border-border/50">
                <p className="text-xs text-muted-foreground mb-1">Action</p>
                <p className={cn("text-sm font-semibold", meta.color)}>{meta.label}</p>
              </div>
              <div className="p-3 rounded-xl bg-muted/40 border border-border/50">
                <p className="text-xs text-muted-foreground mb-1">Status</p>
                <Badge variant="outline" className="text-xs">{activity.status || "INFO"}</Badge>
              </div>
              <div className="p-3 rounded-xl bg-muted/40 border border-border/50 col-span-2">
                <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><Clock className="w-3 h-3" /> Timestamp</p>
                <p className="text-sm font-medium">{format(new Date(activity.timestamp || activity.createdAt), "EEEE, MMM d, yyyy 'at' h:mm:ss a")}</p>
              </div>
              {activity.user && (
                <div className="p-3 rounded-xl bg-muted/40 border border-border/50 col-span-2">
                  <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><User className="w-3 h-3" /> Performed by</p>
                  <p className="text-sm font-semibold">{activity.user.name}</p>
                  <p className="text-xs text-muted-foreground">{activity.user.email}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Role: {activity.user.role || "—"}</p>
                </div>
              )}
              {activity.bookingId && (
                <div className="p-3 rounded-xl bg-muted/40 border border-border/50">
                  <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><Hash className="w-3 h-3" /> Booking ID</p>
                  <p className="font-mono text-xs break-all">{activity.bookingId}</p>
                </div>
              )}
              {activity.roomId && (
                <div className="p-3 rounded-xl bg-muted/40 border border-border/50">
                  <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><Bed className="w-3 h-3" /> Room ID</p>
                  <p className="font-mono text-xs break-all">{activity.roomId}</p>
                </div>
              )}
              {activity.propertyId && (
                <div className="p-3 rounded-xl bg-muted/40 border border-border/50">
                  <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><Building2 className="w-3 h-3" /> Property ID</p>
                  <p className="font-mono text-xs break-all">{activity.propertyId}</p>
                </div>
              )}
              {activity.description && (
                <div className="p-3 rounded-xl bg-muted/40 border border-border/50 col-span-2">
                  <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><MessageSquare className="w-3 h-3" /> Description</p>
                  <p className="text-sm leading-relaxed">{activity.description}</p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Card className="overflow-hidden border border-border hover:shadow-sm transition-shadow">
      <div className="flex gap-0">
        {/* Left color bar */}
        <div className={cn("w-1 shrink-0", meta.bg.includes("emerald") ? "bg-emerald-500" : meta.bg.includes("red") ? "bg-red-500" : meta.bg.includes("amber") ? "bg-amber-500" : meta.bg.includes("blue") ? "bg-blue-500" : "bg-gray-300")} />

        <div className="flex-1 p-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2.5">
              <div className={cn("p-1.5 rounded-lg", meta.bg)}>
                <Icon className={cn("h-4 w-4", meta.color)} />
              </div>
              <div>
                <p className={cn("font-semibold text-sm", meta.color)}>{meta.label}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                  <Clock className="h-3 w-3" />
                  {format(new Date(activity.timestamp || activity.createdAt), "MMM d, yyyy 'at' h:mm a")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Badge variant="outline" className="text-xs">
                {activity.status || "INFO"}
              </Badge>
              <Button size="icon" variant="ghost" className="h-7 w-7 rounded-full hover:bg-primary/10" onClick={() => setInfoOpen(true)} title="View full details">
                <Info className="h-3.5 w-3.5 text-primary" />
              </Button>
            </div>
          </div>

          {/* Structured details grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            {/* Performed by */}
            {activity.user && (
              <div className="flex items-start gap-2 p-2 rounded-lg bg-muted/40">
                <User className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">{actionVerb ? `${actionVerb} by` : "Performed by"}</p>
                  <p className="font-medium text-xs truncate">{activity.user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{activity.user.email}</p>
                </div>
              </div>
            )}

            {/* Booking ID */}
            {activity.bookingId && (
              <div className="flex items-start gap-2 p-2 rounded-lg bg-muted/40">
                <Hash className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Booking ID</p>
                  <p className="font-mono text-xs">{activity.bookingId.slice(0, 12)}...</p>
                </div>
              </div>
            )}

            {/* Room */}
            {activity.roomId && (
              <div className="flex items-start gap-2 p-2 rounded-lg bg-muted/40">
                <Bed className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Room</p>
                  <p className="font-mono text-xs">{activity.roomId.slice(0, 12)}...</p>
                </div>
              </div>
            )}

            {/* Reason */}
            {(parsed.reason || activity.description?.toLowerCase().includes("reason")) && (
              <div className="flex items-start gap-2 p-2 rounded-lg bg-muted/40 sm:col-span-2">
                <MessageSquare className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Reason</p>
                  <p className="text-xs">{parsed.reason || "—"}</p>
                </div>
              </div>
            )}
          </div>

          {/* Description fallback for non-booking actions */}
          {!isBookingAction && activity.description && (
            <p className="mt-2 text-xs text-muted-foreground border-t border-border/50 pt-2">
              {activity.description}
            </p>
          )}
        </div>
      </div>
    </Card>
    </>
  );
}
