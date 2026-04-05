"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Sparkles } from "lucide-react"
import { FeatureDialog } from "./feature-dialog"
import { Empty } from "./empty"
import { useAddRoomFeaturesMutation, useDeleteRoomFeatureMutation } from "@/hooks/api/use-rooms"
import { Spinner } from "@/components/ui/spinner"

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
  const addMutation = useAddRoomFeaturesMutation()
  const deleteMutation = useDeleteRoomFeatureMutation()

  const handleAddFeatures = async (newFeatures: Omit<Feature, "id" | "createdAt" | "updatedAt">[]) => {
    try {
      const res = await addMutation.mutateAsync({ roomId, features: newFeatures })
      // Append returned features (with real IDs) to local state
      const created: Feature[] = Array.isArray(res.data) ? res.data : [res.data]
      setFeatures(prev => [...prev, ...created])
      setDialogOpen(false)
    } catch {}
  }

  const handleDeleteFeature = async (id: string) => {
    try {
      await deleteMutation.mutateAsync({ roomId, featureId: id })
      setFeatures(prev => prev.filter(f => f.id !== id))
    } catch {}
  }

  // Group features by category
  const groupedFeatures = features.reduce((acc, feature) => {
    if (!acc[feature.category]) acc[feature.category] = []
    acc[feature.category].push(feature)
    return acc
  }, {} as Record<string, Feature[]>)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Room Features</h2>
          <p className="text-muted-foreground">Manage amenities and features for this room</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Features
        </Button>
      </div>

      {features.length === 0 ? (
        <Empty
          icon={Sparkles}
          title="No features yet"
          description="Add features to highlight what makes this room special"
          action={
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add First Feature
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
                    <div key={feature.id} className="flex items-center justify-between rounded-lg border bg-card p-4 hover:border-primary/30 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">{feature.name}</p>
                          <Badge variant="outline" className="text-xs">{feature.category}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{feature.value}</p>
                      </div>
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDeleteFeature(feature.id)}
                        disabled={deleteMutation.isPending}>
                        {deleteMutation.isPending ? <Spinner className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
                      </Button>
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
        onOpenChange={(o) => setDialogOpen(o)}
        onSubmit={handleAddFeatures}
        mode="add"
        roomId={roomId}
      />
    </div>
  )
}
