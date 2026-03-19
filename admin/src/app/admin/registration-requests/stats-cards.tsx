import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetRegistrationRequestsStatsQuery } from "@/hooks/api/use-registration-request";
import {
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  Users,
  TrendingUp,
} from "lucide-react";

export function StatsCards() {
  const { data, isFetching } = useGetRegistrationRequestsStatsQuery();
  const stats: any = data;
  if (isFetching) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="w-full aspect-video" />
        ))}
      </div>
    );
  }

  if (!stats) {
    return <p className="text-muted-foreground">No stats available.</p>;
  }

  const cards = [
    {
      title: "Total Brokers",
      value: stats?.brokersCount ?? 0,
      icon: FileText,
      color: "text-blue-500",
    },
    {
      title: "Total Owners",
      value: stats?.ownersCount ?? 0,
      icon: FileText,
      color: "text-blue-500",
    },
    {
      title: "Total Requests",
      value: stats.total ?? 0,
      icon: FileText,
      color: "text-blue-500",
    },
    {
      title: "Pending",
      value: stats.pending ?? 0,
      icon: Clock,
      color: "text-yellow-500",
    },
    {
      title: "Approved",
      value: stats.approved ?? 0,
      icon: CheckCircle2,
      color: "text-green-500",
    },
    {
      title: "Rejected",
      value: stats.rejected ?? 0,
      icon: XCircle,
      color: "text-red-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(({ title, value, icon: Icon, color }) => (
        <Card key={title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className={`h-4 w-4 ${color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
