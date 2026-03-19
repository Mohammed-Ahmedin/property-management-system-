"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

interface AppearanceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AppearanceDialog({ open, onOpenChange }: AppearanceDialogProps) {
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system")
  const [notifications, setNotifications] = useState(true)

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme)
    // Apply theme to document
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark")
    } else if (newTheme === "light") {
      document.documentElement.classList.remove("dark")
    } else {
      // System preference
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    }
  }

  const handleSave = () => {
    console.log("Appearance settings saved:", { theme, notifications })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Appearance</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Theme Selection */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Theme</Label>
            <div className="space-y-2">
              {(["light", "dark", "system"] as const).map((themeOption) => (
                <button
                  key={themeOption}
                  onClick={() => handleThemeChange(themeOption)}
                  className={`w-full rounded-lg border-2 p-3 text-left transition-colors ${
                    theme === themeOption
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card hover:border-primary/50"
                  }`}
                >
                  <p className="font-medium capitalize text-foreground">{themeOption}</p>
                  <p className="text-sm text-muted-foreground">
                    {themeOption === "light" && "Light mode"}
                    {themeOption === "dark" && "Dark mode"}
                    {themeOption === "system" && "Follow system preferences"}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className="flex items-center justify-between rounded-lg border border-border bg-card p-3">
            <div>
              <Label className="text-base font-semibold">Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive email notifications</p>
            </div>
            <Switch checked={notifications} onCheckedChange={setNotifications} />
          </div>

          {/* Dialog Footer */}
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
