import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetRegistrationRequestsStatsQuery } from "@/hooks/api/use-registration-request";
import { FileText, CheckCircle2, XCircle, Clock, Users, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

const CARDS = [
  { key: "brokersCount", label: "Total Brokers", icon: Briefcase, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20", bar: "bg-blue-500" },
  { key: "ownersCount", label: "Total Owners", icon: Users, color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-900/20", bar: "bg-purple-500" },
  { key: "total", label: "Total Requests", icon: FileText, color: "text-indigo-600", bg: "bg-indigo-50 dark:bg-indigo-900/20", bar: "bg-indigo-500" },
  { key: "pending", label: "Pending", icon: Clock, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20", bar: "bg-amber-500" },
  { key: "approved", label: "Approved", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20", bar: "bg-emerald-500" },
  { key: "rejected", label: "Rejected", icon: XCircle, color: "text-red-600", bg: "bg-red-50 dark:bg-red-900/20", bar: "bg-red-500" },
];

export function StatsCards() {
  const { data, isFetching } = useGetRegistrationRequestsStatsQuery();
  const stats: any = data;

  if (isFetching) return (
    <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 mb-6">
      {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-2xl" />)}
    </div>
  );

  if (!stats) return null;

  return (
    <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 mb-6">
      {CARDS.map(({ key, label, icon: Icon, color, bg, bar }) => (
        <Card key={key} className="relative overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
          <div className={cn("absolute top-0 left-0 right-0 h-0.5", bar)} />
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <p className="text-xs text-muted-foreground font-medium leading-tight">{label}</p>
              <div className={cn("p-1.5 rounded-lg shrink-0", bg)}>
                <Icon className={cn("h-3.5 w-3.5", color)} />
              </div>
            </div>
            <p className="text-2xl font-bold">{stats[key] ?? 0}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
