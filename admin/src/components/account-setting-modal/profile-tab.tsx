"use client"

import { useRef, useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { authClient } from "@/lib/auth-client"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"
import { User, Upload, Loader2 } from "lucide-react"

interface ProfileTabProps {
  initialUser?: any
}

export function ProfileTab({ initialUser }: ProfileTabProps) {
  const [name, setName] = useState(initialUser?.name || "")
  const [image, setImage] = useState(initialUser?.image || "")
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!initialUser) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3 text-muted-foreground">
        <User className="h-10 w-10 opacity-30" />
        <p className="text-sm">Could not load profile. Please sign out and sign in again.</p>
      </div>
    )
  }

  const initials = name?.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) || "?"

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPendingFile(file)
    const reader = new FileReader()
    reader.onload = (ev) => setImage(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  const handleSave = async () => {
    if (!name.trim()) return
    setSaving(true)
    try {
      let imageUrl = initialUser.image || ""

      // Upload image via Next.js API route (uses server-side Cloudinary)
      if (pendingFile) {
        const fd = new FormData()
        fd.append("file", pendingFile)
        const res = await fetch("/api/upload", { method: "POST", body: fd })
        if (res.ok) {
          const data = await res.json()
          imageUrl = data.secure_url || imageUrl
        } else {
          toast.error("Image upload failed — saving name only")
        }
      }

      // Update via Better Auth (name) + direct DB update (image)
      await authClient.updateUser({ name })
      // Update image directly in DB since authClient may not persist image
      const { api } = await import("@/hooks/api")
      const updateRes = await api.put("/users/me", { name, image: imageUrl || undefined })
      const updatedUser = updateRes.data?.user || { ...initialUser, name, image: imageUrl }
      // Also update Better Auth session with image
      await authClient.updateUser({ name, image: imageUrl || undefined }).catch(() => {})

      localStorage.setItem("admin_session_user", JSON.stringify({ ...initialUser, ...updatedUser }))
      setImage(updatedUser.image || imageUrl)
      setPendingFile(null)

      toast.success("Profile updated")

      // Force page reload to update all components (sidebar, header, etc.)
      setTimeout(() => window.location.reload(), 800)
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
        <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
          <Avatar className="h-20 w-20">
            <AvatarImage src={image || ""} alt={name} />
            <AvatarFallback className="text-lg font-bold bg-primary text-primary-foreground">{initials}</AvatarFallback>
          </Avatar>
          <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Upload className="w-5 h-5 text-white" />
          </div>
        </div>
        <div>
          <p className="font-semibold text-base">{name || initialUser.name}</p>
          <p className="text-sm text-muted-foreground">{initialUser.email}</p>
          {initialUser.role && <p className="text-xs text-muted-foreground mt-0.5 uppercase tracking-wide">{initialUser.role}</p>}
          <button
            type="button"
            className="text-xs text-primary hover:underline mt-1"
            onClick={() => fileInputRef.current?.click()}
          >
            {pendingFile ? `✓ ${pendingFile.name}` : "Change photo"}
          </button>
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
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
          {saving ? <><Loader2 className="mr-2 size-4 animate-spin" /> Saving...</> : "Save Changes"}
        </Button>
      </div>
    </div>
  )
}
