"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { authClient } from "@/lib/auth-client"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"
import { User } from "lucide-react"

const ADMIN_USER_KEY = "admin_session_user"

export function ProfileTab() {
  const { data, isPending } = authClient.useSession()

  // Fall back to localStorage on mobile
  const sessionUser = data?.user as any
  const localUser = (() => {
    if (typeof window === "undefined") return null
    try { const r = localStorage.getItem(ADMIN_USER_KEY); return r ? JSON.parse(r) : null } catch { return null }
  })()
  const user = sessionUser ?? localUser

  const [name, setName] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (user?.name) setName(user.name)
  }, [user?.name])

  const handleSave = async () => {
    if (!name.trim()) return
    setSaving(true)
    try {
      await authClient.updateUser({ name })
      // Update localStorage too
      if (user) {
        const updated = { ...user, name }
        localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(updated))
      }
      toast.success("Profile updated")
    } catch {
      toast.error("Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  if (isPending && !user) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner className="size-6" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-2">
        <User className="h-10 w-10 opacity-30" />
        <p className="text-sm">Could not load profile. Please refresh.</p>
      </div>
    )
  }

  const initials = user.name?.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) || "?"

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Profile Settings</h3>
        <p className="text-sm text-muted-foreground">Manage your personal information</p>
      </div>

      <div className="flex items-center gap-5">
        <Avatar className="h-20 w-20">
          <AvatarImage src={user.image || ""} alt={user.name} />
          <AvatarFallback className="text-lg font-bold bg-primary text-primary-foreground">{initials}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold text-base">{user.name}</p>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          <p className="text-xs text-muted-foreground mt-0.5 uppercase tracking-wide">{user.role}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input id="fullName" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" type="email" value={user.email || ""} disabled className="opacity-60" />
          <p className="text-xs text-muted-foreground">Email cannot be changed here</p>
        </div>

        {user.phone && (
          <div className="grid gap-2">
            <Label>Phone</Label>
            <Input value={user.phone} disabled className="opacity-60" />
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-border">
        <Button onClick={handleSave} disabled={saving || !name.trim()}>
          {saving ? <><Spinner className="mr-2 size-4" /> Saving...</> : "Save Changes"}
        </Button>
      </div>
    </div>
  )
}
