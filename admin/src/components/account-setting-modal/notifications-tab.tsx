"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

const NOTIF_KEY = "admin_notification_prefs"

const loadPrefs = () => {
  if (typeof window === "undefined") return null
  try { return JSON.parse(localStorage.getItem(NOTIF_KEY) || "null") } catch { return null }
}

export function NotificationsTab() {
  const saved = loadPrefs()
  const [emailUpdates, setEmailUpdates] = useState(saved?.emailUpdates ?? true)
  const [emailMarketing, setEmailMarketing] = useState(saved?.emailMarketing ?? false)
  const [emailSecurity, setEmailSecurity] = useState(saved?.emailSecurity ?? true)
  const [pushMessages, setPushMessages] = useState(saved?.pushMessages ?? true)
  const [pushPayments, setPushPayments] = useState(saved?.pushPayments ?? true)

  const handleSave = () => {
    localStorage.setItem(NOTIF_KEY, JSON.stringify({ emailUpdates, emailMarketing, emailSecurity, pushMessages, pushPayments }))
    toast.success("Notification preferences saved")
  }

  const handleReset = () => {
    localStorage.removeItem(NOTIF_KEY)
    setEmailUpdates(true); setEmailMarketing(false); setEmailSecurity(true)
    setPushMessages(true); setPushPayments(true)
    toast.success("Reset to defaults")
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Notification Preferences</h3>
        <p className="text-sm text-muted-foreground">Manage how you receive notifications and updates</p>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-medium mb-4">Email Notifications</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-updates">Product Updates</Label>
                <p className="text-sm text-muted-foreground">Receive emails about new features and updates</p>
              </div>
              <Switch id="email-updates" checked={emailUpdates} onCheckedChange={setEmailUpdates} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-marketing">Marketing Emails</Label>
                <p className="text-sm text-muted-foreground">Receive promotional emails and offers</p>
              </div>
              <Switch id="email-marketing" checked={emailMarketing} onCheckedChange={setEmailMarketing} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-security">Security Alerts</Label>
                <p className="text-sm text-muted-foreground">Get notified about security-related activities</p>
              </div>
              <Switch id="email-security" checked={emailSecurity} onCheckedChange={setEmailSecurity} />
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-6">
          <h4 className="text-sm font-medium mb-4">Push Notifications</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="push-messages">Messages</Label>
                <p className="text-sm text-muted-foreground">Receive push notifications for new messages</p>
              </div>
              <Switch id="push-messages" checked={pushMessages} onCheckedChange={setPushMessages} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="push-payments">Payment Updates</Label>
                <p className="text-sm text-muted-foreground">Get notified about payment transactions</p>
              </div>
              <Switch id="push-payments" checked={pushPayments} onCheckedChange={setPushPayments} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline" onClick={handleReset}>Reset to Default</Button>
        <Button onClick={handleSave}>Save Preferences</Button>
      </div>
    </div>
  )
}
