"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { authClient } from "@/lib/auth-client"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"
import { api } from "@/hooks/api"

export function ProfileTab() {
  const { data } = authClient.useSession()
  const [user, setUser] = useState<any>(null)
  const [name, setName] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    // 1. Try live session
    const su = data?.user as any
    if (su?.id || su?.email) {
      setUser(su); setName(su.name || ""); return
    }
    // 2. Try localStorage
    try {
      const raw = localStorage.getItem("admin_session_user")
      if (raw) {
        const p = JSON.parse(raw)
        if (p?.id || p?.email) { setUser(p); setName(p.name || ""); return }
      }
    } catch {}
    // 3. Fetch from backend using stored token (mobile fallback)
    api.get("/users/me").then(res => {
      const u = res.data?.user || res.data
      if (u?.id || u?.email) {
        setUser(u); setName(u.name || "")
        localStorage.setItem("admin_session_user", JSON.stringify(u))
      }
    }).catch(() => {})
  }, [data?.user])

  const handleSave = async () => {
    if (!name.trim() || !user) return
    setSaving(true)
    try {
      await authClient.updateUser({ name })
      const updated = { ...user, name }
      localStorage.setItem("admin_session_user", JSON.stringify(updated))
      setUser(updated)
      toast.success("Profile updated")
    } catch {
      toast.error("Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3 text-muted-foreground">
        <Spinner className="size-6" />
        <p className="text-sm">Loading profile...</p>
      </div>
    )
  }

  const initials = user.name?.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) || "?"

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Profile Settings</h3>
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
          {user.role && <p className="text-xs text-muted-foreground mt-0.5 uppercase tracking-wide">{user.role}</p>}
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
