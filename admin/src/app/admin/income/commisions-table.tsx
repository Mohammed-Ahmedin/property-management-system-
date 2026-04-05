import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGetCommisionSettings } from "@/hooks/api/use-commision";
import LoaderState from "@/components/shared/loader-state";
import { UpdateCommissionModal } from "./update-commision-modal";
import { cn } from "@/lib/utils";
import { Percent, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export const BookingCommissionsTable: React.FC = () => {
  const { data, isFetching, isError, refetch } = useGetCommisionSettings();

  if (isFetching) return <LoaderState />;

  if (isError) return (
    <div className="py-12 text-center">
      <p className="text-destructive mb-3">Failed to load commissions</p>
      <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-2">
        <RefreshCw className="h-3.5 w-3.5" /> Retry
      </Button>
    </div>
  );

  if (!data?.length) return (
    <div className="py-12 text-center text-muted-foreground">
      <Percent className="h-10 w-10 mx-auto mb-3 opacity-20" />
      <p>No commissions configured yet.</p>
    </div>
  );

  return (
    <div className="space-y-3">
      {data.map((commission) => (
        <div key={commission.id}
          className={cn(
            "flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-border hover:border-primary/30 hover:shadow-sm transition-all",
            commission.type === "PLATFORM" ? "bg-purple-500/5 border-purple-500/20" : "bg-card"
          )}>
          <div className="flex items-center gap-3 min-w-0">
            <div className={cn("p-2 rounded-lg shrink-0", commission.type === "PLATFORM" ? "bg-purple-100 dark:bg-purple-900/30" : "bg-muted")}>
              <Percent className={cn("h-4 w-4", commission.type === "PLATFORM" ? "text-purple-600" : "text-muted-foreground")} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold text-sm">{(commission as any).name || "Commission"}</p>
                <Badge variant="outline" className="text-xs">{commission.type}</Badge>
                <Badge variant={commission.isActive ? "default" : "destructive"} className="text-xs">
                  {commission.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                ID: {commission.id.slice(0, 8)}... · Created {new Date(commission.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            {(commission as any).calcType === "FLAT_AMOUNT" ? (
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Flat Amount</p>
                <p className="text-lg font-bold text-primary">ETB {(commission as any).flatAmount?.toLocaleString() || 0}</p>
              </div>
            ) : (
              <>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Platform</p>
                  <p className="text-lg font-bold text-primary">{commission.platformPercent || 0}%</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Broker</p>
                  <p className="text-lg font-bold text-purple-600">{commission.brokerPercent || 0}%</p>
                </div>
              </>
            )}
            <UpdateCommissionModal commissionId={commission.id} initialData={commission as any} />
          </div>
        </div>
      ))}
    </div>
  );
};
