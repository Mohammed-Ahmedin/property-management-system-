import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import {
  Calendar,
  CheckCircle2,
  XCircle,
  AlertCircle,
  AlertTriangle,
  User,
  MapPin,
  Clock,
} from "lucide-react";
import { Avatar } from "@/components/shared/avatar";

interface ActivityItemProps {
  activity: any;
}

const statusConfig: any = {
  INFO: {
    color: "bg-primary/10 text-primary border-primary/20",
    icon: AlertCircle,
  },
  WARN: {
    color: "bg-warning/10 text-warning border-warning/20",
    icon: AlertTriangle,
  },
  ERROR: {
    color: "bg-destructive/10 text-destructive border-destructive/20",
    icon: XCircle,
  },
  CRITICAL: {
    color: "bg-destructive text-destructive-foreground border-destructive",
    icon: AlertTriangle,
  },
};

const actionConfig: Record<string, { icon: any; color: string }> = {
  BOOKED: { icon: Calendar, color: "bg-success/10 text-success" },
  CHECKED_IN: { icon: CheckCircle2, color: "bg-success/10 text-success" },
  CHECKED_OUT: { icon: CheckCircle2, color: "bg-primary/10 text-primary" },
  PAYMENT_SUCCESS: { icon: CheckCircle2, color: "bg-success/10 text-success" },
  PAYMENT_FAILED: {
    icon: XCircle,
    color: "bg-destructive/10 text-destructive",
  },
  LOGIN: { icon: User, color: "bg-primary/10 text-primary" },
  LOGOUT: { icon: User, color: "bg-muted text-muted-foreground" },
};

export function ActivityItem({ activity }: ActivityItemProps) {
  const StatusIcon = (statusConfig[activity?.status as any] as any)?.icon;
  const ActionIcon = actionConfig[activity.action]?.icon || AlertCircle;
  const actionColor =
    actionConfig[activity.action]?.color || "bg-muted text-muted-foreground";

  return (
    <Card className="group transition-all hover:shadow-md">
      <div className="flex items-start gap-4 p-4">
        {/* Action Icon */}
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${actionColor}`}
        >
          <ActionIcon className="h-5 w-5" />
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-mono text-sm font-medium text-foreground">
                  {activity.action.replace(/_/g, " ")}
                </h3>
                <Badge
                  variant="outline"
                  className={statusConfig[activity.status].color}
                >
                  <StatusIcon className="mr-1 h-3 w-3" />
                  {activity.status}
                </Badge>
              </div>
              {activity.description && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {activity.description}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {formatDistanceToNow(new Date(activity.timestamp), {
                addSuffix: true,
              })}
            </div>
          </div>

          {/* Metadata */}
          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            {activity.user && (
              <div className="flex items-center gap-2">
                <Avatar
                  title={activity.user.name}
                  fallback={activity.user.name}
                  className="h-6 w-6"
                />
                <span>{activity.user.name}</span>
              </div>
            )}

            {activity.ipAddress && (
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span className="font-mono">{activity.ipAddress}</span>
              </div>
            )}

            {activity.bookingId && (
              <Badge variant="secondary" className="font-mono text-[10px]">
                Booking: {activity.bookingId.slice(0, 8)}
              </Badge>
            )}

            {activity.roomId && (
              <Badge variant="secondary" className="font-mono text-[10px]">
                Room: {activity.roomId.slice(0, 8)}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
