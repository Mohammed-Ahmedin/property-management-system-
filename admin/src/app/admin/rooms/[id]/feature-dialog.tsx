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
import { Plus, X } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Feature {
  category: string
  name: string
  value: string
  roomId: string
}

interface FeatureDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (features: Feature[]) => void
  initialData?: Array<{
    id: string
    category: string
    name: string
    value: string
    roomId: string
  }>
  mode: "add" | "edit"
  roomId: string
}

export function FeatureDialog({ open, onOpenChange, onSubmit, initialData, mode, roomId }: FeatureDialogProps) {
  const [features, setFeatures] = useState<Feature[]>([{ category: "", name: "", value: "", roomId }])

  useEffect(() => {
    if (initialData && initialData.length > 0) {
      setFeatures(
        initialData.map((f) => ({
          category: f.category,
          name: f.name,
          value: f.value,
          roomId: f.roomId,
        })),
      )
    } else {
      setFeatures([{ category: "", name: "", value: "", roomId }])
    }
  }, [initialData, open, roomId])

  const addFeature = () => {
    setFeatures([...features, { category: "", name: "", value: "", roomId }])
  }

  const removeFeature = (index: number) => {
    if (features.length > 1) {
      setFeatures(features.filter((_, i) => i !== index))
    }
  }

  const updateFeature = (index: number, field: keyof Feature, value: string) => {
    const newFeatures = [...features]
    newFeatures[index] = { ...newFeatures[index], [field]: value }
    setFeatures(newFeatures)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const validFeatures = features.filter((f) => f.category && f.name && f.value)
    if (validFeatures.length > 0) {
      onSubmit(validFeatures)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Add Features" : "Edit Feature"}</DialogTitle>
          <DialogDescription>
            {mode === "add" ? "Add one or multiple features to this room" : "Update the feature details"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <ScrollArea className="max-h-[400px] pr-4">
            <div className="space-y-4 py-4">
              {features.map((feature, index) => (
                <div key={index} className="grid gap-4 rounded-lg border p-4 relative">
                  {mode === "add" && features.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-2 h-6 w-6 p-0"
                      onClick={() => removeFeature(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                  <div className="grid gap-2">
                    <Label htmlFor={`category-${index}`}>Category</Label>
                    <Input
                      id={`category-${index}`}
                      value={feature.category}
                      onChange={(e) => updateFeature(index, "category", e.target.value)}
                      placeholder="e.g., Amenities, Entertainment"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor={`name-${index}`}>Feature Name</Label>
                    <Input
                      id={`name-${index}`}
                      value={feature.name}
                      onChange={(e) => updateFeature(index, "name", e.target.value)}
                      placeholder="e.g., WiFi, TV"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor={`value-${index}`}>Value/Description</Label>
                    <Input
                      id={`value-${index}`}
                      value={feature.value}
                      onChange={(e) => updateFeature(index, "value", e.target.value)}
                      placeholder="e.g., High-speed, 55-inch Smart TV"
                      required
                    />
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          {mode === "add" && (
            <Button type="button" variant="outline" className="w-full mt-2 bg-transparent" onClick={addFeature}>
              <Plus className="mr-2 h-4 w-4" />
              Add Another Feature
            </Button>
          )}
          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{mode === "add" ? "Add Features" : "Save Changes"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
