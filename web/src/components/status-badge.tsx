import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  paymentStatus?: string;
}

export function StatusBadge({ status, paymentStatus }: StatusBadgeProps) {
  // If booking is APPROVED and payment is SUCCESS → show "Reserved"
  const isReserved = status === "APPROVED" && paymentStatus === "SUCCESS";

  const statusConfig: Record<string, { className: string; label: string }> = {
    PENDING: { className: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400", label: "Pending" },
    APPROVED: { className: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400", label: "Approved" },
    RESERVED: { className: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400", label: "Reserved" },
    REJECTED: { className: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400", label: "Rejected" },
    CANCELLED: { className: "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400", label: "Cancelled" },
    COMPLETED: { className: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400", label: "Completed" },
    CONFIRMED: { className: "bg-emerald-100 text-emerald-700 border-emerald-200", label: "Confirmed" },
    PENDING_OWNER_APPROVAL: { className: "bg-orange-100 text-orange-700 border-orange-200", label: "Pending Approval" },
    PENDING_OWNER_REJECTION: { className: "bg-rose-100 text-rose-700 border-rose-200", label: "Pending Rejection" },
  };

  const key = isReserved ? "RESERVED" : status;
  const config = statusConfig[key] || { className: "bg-muted text-muted-foreground border-border", label: status };

  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border", config.className)}>
      {config.label}
    </span>
  );
}
