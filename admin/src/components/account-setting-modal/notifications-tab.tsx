"use client"

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"

export function NotificationsTab() {
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
              <Switch id="email-updates" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-marketing">Marketing Emails</Label>
                <p className="text-sm text-muted-foreground">Receive promotional emails and offers</p>
              </div>
              <Switch id="email-marketing" />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-security">Security Alerts</Label>
                <p className="text-sm text-muted-foreground">Get notified about security-related activities</p>
              </div>
              <Switch id="email-security" defaultChecked />
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
              <Switch id="push-messages" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="push-payments">Payment Updates</Label>
                <p className="text-sm text-muted-foreground">Get notified about payment transactions</p>
              </div>
              <Switch id="push-payments" defaultChecked />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline">Reset to Default</Button>
        <Button>Save Preferences</Button>
      </div>
    </div>
  )
}
