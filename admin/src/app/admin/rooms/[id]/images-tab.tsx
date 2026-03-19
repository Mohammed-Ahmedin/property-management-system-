"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, ImageIcon } from "lucide-react"
import { Empty } from "./empty"

interface RoomImage {
  id: string
  url: string
  name: string
  roomId: string
  createdAt: string
  updatedAt: string
}

interface ImagesTabProps {
  images: RoomImage[]
  roomId: string
}

export function ImagesTab({ images: initialImages, roomId }: ImagesTabProps) {
  const [images, setImages] = useState(initialImages)

  const handleDeleteImage = (id: string) => {
    setImages(images.filter((img) => img.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Room Images</h2>
          <p className="text-muted-foreground">Manage photos of this room</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Upload Image
        </Button>
      </div>

      {images.length === 0 ? (
        <Empty
          icon={ImageIcon}
          title="No images yet"
          description="Upload images to showcase this room"
          action={
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Upload First Image
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {images.map((image) => (
            <Card key={image.id} className="overflow-hidden">
              <div className="relative aspect-video">
                <img src={image.url || "/placeholder.svg"} alt={image.name}  className="object-cover" />
              </div>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium truncate">{image.name}</p>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteImage(image.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
