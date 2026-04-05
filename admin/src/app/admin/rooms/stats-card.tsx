import type React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  variant?: "default" | "success" | "warning" | "danger";
}

const variantStyles = {
  default: { icon: "bg-primary/10 text-primary", bar: "bg-primary" },
  success: { icon: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400", bar: "bg-emerald-500" },
  warning: { icon: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400", bar: "bg-amber-500" },
  danger:  { icon: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400", bar: "bg-red-500" },
};

export function StatsCard({ title, value, icon, description, variant = "default" }: StatsCardProps) {
  const styles = variantStyles[variant];
  return (
    <Card className="relative overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      <div className={cn("absolute top-0 left-0 right-0 h-0.5", styles.bar)} />
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className={cn("p-2 rounded-xl", styles.icon)}>{icon}</div>
        </div>
        <p className="text-3xl font-bold tracking-tight">{value}</p>
        {description && <p className="text-xs text-muted-foreground mt-1.5">{description}</p>}
      </CardContent>
    </Card>
  );
}
