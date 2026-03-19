import { Badge } from "@/components/ui/badge"

export function StatusBadge({ status }: { status: string }) {
  const statusConfig: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> =
    {
      PENDING: { variant: "secondary", label: "Pending" },
      CONFIRMED: { variant: "default", label: "Confirmed" },
      CANCELLED: { variant: "destructive", label: "Cancelled" },
      COMPLETED: { variant: "outline", label: "Completed" },
    }

  const config = statusConfig[status] || { variant: "outline" as const, label: status }

  return <Badge variant={config.variant}>{config.label}</Badge>
}
