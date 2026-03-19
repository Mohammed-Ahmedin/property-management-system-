"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

type UserRole = "GUEST" | "STAFF" | "ADMIN" | "OWNER" | "BROKER"

type User = {
  id: string
  name: string
  email: string
  emailVerified: boolean
  image: string | null
  role: UserRole
  banned: boolean
  banReason: string | null
  banExpires: Date | null
  createdAt: Date
  updatedAt: Date
}

type EditUserModalProps = {
  user: User
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (user: User) => void
}

export function EditUserModal({ user, open, onOpenChange, onSave }: EditUserModalProps) {
  const [formData, setFormData] = useState<User>(user)

  useEffect(() => {
    setFormData(user)
  }, [user])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...formData,
      updatedAt: new Date(),
    })
  }

  const handleBannedChange = (checked: boolean) => {
    setFormData({
      ...formData,
      banned: checked,
      banReason: checked ? formData.banReason : null,
      banExpires: checked ? formData.banExpires : null,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>Update user information and permissions</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value: UserRole) => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger id="role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GUEST">Guest</SelectItem>
                  <SelectItem value="STAFF">Staff</SelectItem>
                  <SelectItem value="OWNER">Owner</SelectItem>
                  <SelectItem value="BROKER">Broker</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="emailVerified" className="cursor-pointer">
                Email Verified
              </Label>
              <Switch
                id="emailVerified"
                checked={formData.emailVerified}
                onCheckedChange={(checked) => setFormData({ ...formData, emailVerified: checked })}
              />
            </div>

            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="banned" className="cursor-pointer">
                Banned
              </Label>
              <Switch id="banned" checked={formData.banned} onCheckedChange={handleBannedChange} />
            </div>

            {formData.banned && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="banReason">Ban Reason</Label>
                  <Textarea
                    id="banReason"
                    value={formData.banReason || ""}
                    onChange={(e) => setFormData({ ...formData, banReason: e.target.value })}
                    placeholder="Enter reason for ban..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="banExpires">Ban Expires</Label>
                  <Input
                    id="banExpires"
                    type="date"
                    value={formData.banExpires ? new Date(formData.banExpires).toISOString().split("T")[0] : ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        banExpires: e.target.value ? new Date(e.target.value) : null,
                      })
                    }
                  />
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
