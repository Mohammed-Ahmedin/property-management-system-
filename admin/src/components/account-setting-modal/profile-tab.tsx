"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { authClient } from "@/lib/auth-client"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"
import { User } from "lucide-react"

interface ProfileTabProps {
  initialUser?: any
}

export function ProfileTab({ initialUser }: ProfileTabProps) {
  const [name, setName] = useState(initialUser?.name || "")
  const [saving, setSaving] = useState(false)

  if (!initialUser) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3 text-muted-foreground">
        <User className="h-10 w-10 opacity-30" />
        <p className="text-sm">Could not load profile. Please sign out and sign in again.</p>
      </div>
    )
  }

  const initials = initialUser.name?.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) || "?"

  const handleSave = async () => {
    if (!name.trim()) return
    setSaving(true)
    try {
      await authClient.updateUser({ name })
      const updated = { ...initialUser, name }
      localStorage.setItem("admin_session_user", JSON.stringify(updated))
      toast.success("Profile updated")
    } catch {
      toast.error("Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Profile Settings</h3>
        <p className="text-sm text-muted-foreground">Manage your personal information</p>
      </div>

      <div className="flex items-center gap-5">
        <Avatar className="h-20 w-20">
          <AvatarImage src={initialUser.image || ""} alt={initialUser.name} />
          <AvatarFallback className="text-lg font-bold bg-primary text-primary-foreground">{initials}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold text-base">{initialUser.name}</p>
          <p className="text-sm text-muted-foreground">{initialUser.email}</p>
          {initialUser.role && <p className="text-xs text-muted-foreground mt-0.5 uppercase tracking-wide">{initialUser.role}</p>}
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input id="fullName" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" type="email" value={initialUser.email || ""} disabled className="opacity-60" />
          <p className="text-xs text-muted-foreground">Email cannot be changed here</p>
        </div>
        {initialUser.phone && (
          <div className="grid gap-2">
            <Label>Phone</Label>
            <Input value={initialUser.phone} disabled className="opacity-60" />
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
