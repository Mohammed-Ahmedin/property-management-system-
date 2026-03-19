"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MonitorIcon, SmartphoneIcon, TabletIcon } from "lucide-react"

const sessions = [
  {
    id: 1,
    device: "MacBook Pro",
    location: "San Francisco, CA",
    lastActive: "Active now",
    current: true,
    icon: MonitorIcon,
  },
  {
    id: 2,
    device: "iPhone 14 Pro",
    location: "San Francisco, CA",
    lastActive: "2 hours ago",
    current: false,
    icon: SmartphoneIcon,
  },
  {
    id: 3,
    device: "iPad Air",
    location: "New York, NY",
    lastActive: "1 day ago",
    current: false,
    icon: TabletIcon,
  },
]

export function SessionTab() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Active Sessions</h3>
        <p className="text-sm text-muted-foreground">Manage your active sessions across different devices</p>
      </div>

      <div className="space-y-4">
        {sessions.map((session) => {
          const Icon = session.icon
          return (
            <div
              key={session.id}
              className="flex items-start justify-between p-4 rounded-lg border border-border bg-card"
            >
              <div className="flex gap-4">
                <div className="p-2 rounded-md bg-muted">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground">{session.device}</p>
                    {session.current && (
                      <Badge variant="secondary" className="text-xs">
                        Current
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{session.location}</p>
                  <p className="text-xs text-muted-foreground">{session.lastActive}</p>
                </div>
              </div>
              {!session.current && (
                <Button variant="ghost" size="sm" className="text-destructive">
                  Revoke
                </Button>
              )}
            </div>
          )
        })}
      </div>

      <div className="flex justify-end pt-4 border-t border-border">
        <Button variant="destructive">Sign Out All Devices</Button>
      </div>
    </div>
  )
}
