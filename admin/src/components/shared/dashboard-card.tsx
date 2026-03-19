"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface DashboardCardProps {
  title: string
  value: string | number
  description?: string
  change?: string
  changeType?: "positive" | "negative" | "neutral"
  icon?: LucideIcon
  className?: string
  children?: React.ReactNode
}

export function DashboardCard({
  title,
  value,
  description,
  change,
  changeType = "neutral",
  icon: Icon,
  className,
  children,
}: DashboardCardProps) {
  return (
    <div className="relative group">
      <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-[2000ms] pointer-events-none">
        <div className="absolute inset-0 bg-gradient-radial from-blue-500/8 via-blue-500/3 to-transparent dark:from-blue-400/12 dark:via-blue-400/4 dark:to-transparent rounded-lg"></div>
      </div>

      <div className="absolute -inset-0.5 bg-blue-500/5 dark:bg-blue-400/10 rounded-lg blur opacity-0 group-hover:opacity-100 transition-all duration-[3000ms]"></div>

      <Card
        className={cn(
          "relative transition-all duration-[2000ms] cursor-pointer",
          "hover:shadow-lg hover:ring-1 hover:ring-blue-500/10 dark:hover:ring-blue-400/20",
          className,
        )}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground transition-colors duration-[1500ms]">
            {title}
          </CardTitle>
          {Icon && <Icon className="h-4 w-4 text-muted-foreground transition-all duration-[1500ms]" />}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold mb-1 transition-all duration-[1500ms]">{value}</div>
          {(change || description) && (
            <div className="flex items-center gap-1">
              {change && (
                <Badge
                  variant={
                    changeType === "positive" ? "default" : changeType === "negative" ? "destructive" : "secondary"
                  }
                  className="text-xs px-1.5 py-0.5 transition-all duration-[1500ms]"
                >
                  {change}
                </Badge>
              )}
              {description && (
                <p className="text-xs text-muted-foreground transition-colors duration-[1500ms]">{description}</p>
              )}
            </div>
          )}
          {children}
        </CardContent>
      </Card>
    </div>
  )
}
