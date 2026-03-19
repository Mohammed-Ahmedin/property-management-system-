import type React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  variant?: "default" | "success" | "warning";
}

export function StatsCard({
  title,
  value,
  icon,
  description,
  variant = "default",
}: StatsCardProps) {
  return (
    <Card className="hover:shadow-md transition-all">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div
          className={cn(
            "p-2 rounded-md",
            variant === "success" && "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400",
            variant === "warning" && "bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400",
            variant === "default" && "text-muted-foreground bg-muted/30"
          )}
        >
          {icon}
        </div>
      </CardHeader>

      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
