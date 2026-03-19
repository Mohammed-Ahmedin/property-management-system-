"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Trash2, Sparkles } from "lucide-react"
import { FeatureDialog } from "./feature-dialog"
import { Empty } from "./empty"

interface Feature {
  id: string
  roomId: string
  category: string
  name: string
  value: string
  createdAt: string
  updatedAt: string
}

interface FeaturesTabProps {
  features: Feature[]
  roomId: string
}

export function FeaturesTab({ features: initialFeatures, roomId }: FeaturesTabProps) {
  const [features, setFeatures] = useState(initialFeatures)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null)

  const handleAddFeatures = (newFeatures: Omit<Feature, "id" | "createdAt" | "updatedAt">[]) => {
    const featuresWithIds = newFeatures.map((feature) => ({
      ...feature,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }))
    setFeatures([...features, ...featuresWithIds])
    setDialogOpen(false)
  }

  const handleEditFeature = (updatedFeatures: Omit<Feature, "id" | "createdAt" | "updatedAt">[]) => {
    if (editingFeature && updatedFeatures.length > 0) {
      const updatedFeature = updatedFeatures[0]
      setFeatures(
        features.map((f) =>
          f.id === editingFeature.id ? { ...f, ...updatedFeature, updatedAt: new Date().toISOString() } : f,
        ),
      )
      setEditingFeature(null)
      setDialogOpen(false)
    }
  }

  const handleDeleteFeature = (id: string) => {
    setFeatures(features.filter((f) => f.id !== id))
  }

  const openEditDialog = (feature: Feature) => {
    setEditingFeature(feature)
    setDialogOpen(true)
  }

  const closeDialog = () => {
    setDialogOpen(false)
    setEditingFeature(null)
  }

  // Group features by category
  const groupedFeatures = features.reduce(
    (acc, feature) => {
      if (!acc[feature.category]) {
        acc[feature.category] = []
      }
      acc[feature.category].push(feature)
      return acc
    },
    {} as Record<string, Feature[]>,
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Room Features</h2>
          <p className="text-muted-foreground">Manage amenities and features for this room</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Features
        </Button>
      </div>

      {features.length === 0 ? (
        <Empty
          icon={Sparkles}
          title="No features yet"
          description="Add features to highlight what makes this room special"
          action={
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add First Feature
            </Button>
          }
        />
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedFeatures).map(([category, categoryFeatures]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="capitalize">{category}</CardTitle>
                <CardDescription>{categoryFeatures.length} features</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {categoryFeatures.map((feature) => (
                    <div key={feature.id} className="flex items-center justify-between rounded-lg border bg-card p-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">{feature.name}</p>
                          <Badge variant="outline" className="text-xs">
                            {feature.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{feature.value}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => openEditDialog(feature)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteFeature(feature.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <FeatureDialog
        open={dialogOpen}
        onOpenChange={closeDialog}
        onSubmit={editingFeature ? handleEditFeature : handleAddFeatures}
        initialData={editingFeature ? [editingFeature] : undefined}
        mode={editingFeature ? "edit" : "add"}
        roomId={roomId}
      />
    </div>
  )
}
