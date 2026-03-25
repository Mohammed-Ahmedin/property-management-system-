"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, ImageIcon, Loader2 } from "lucide-react"
import { Empty } from "./empty"
import { useAddRoomImageMutation, useDeleteRoomImageMutation } from "@/hooks/api/use-rooms"
import { uploadToCloudinaryDirect } from "@/server/config/cloudinary"
import { toast } from "sonner"

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

export function ImagesTab({ images, roomId }: ImagesTabProps) {
  const [uploading, setUploading] = useState(false)
  const addMutation = useAddRoomImageMutation()
  const deleteMutation = useDeleteRoomImageMutation()

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const res = await uploadToCloudinaryDirect(file)
      await addMutation.mutateAsync({ roomId, url: res.secure_url, name: file.name })
      toast.success("Image uploaded")
    } catch {
      toast.error("Upload failed")
    } finally {
      setUploading(false)
      e.target.value = ""
    }
  }

  const handleDelete = (imageId: string) => {
    deleteMutation.mutate({ roomId, imageId })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Room Images</h2>
          <p className="text-muted-foreground">Manage photos of this room</p>
        </div>
        <label className="cursor-pointer">
          <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
          <Button asChild disabled={uploading}>
            <span>
              {uploading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...</> : "Upload Image"}
            </span>
          </Button>
        </label>
      </div>

      {images.length === 0 ? (
        <Empty
          icon={ImageIcon}
          title="No images yet"
          description="Upload images to showcase this room"
          action={
            <label className="cursor-pointer">
              <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
              <Button asChild disabled={uploading}><span>Upload First Image</span></Button>
            </label>
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {images.map((image) => (
            <Card key={image.id} className="overflow-hidden">
              <div className="relative aspect-video">
                <img src={image.url} alt={image.name} className="w-full h-full object-cover" />
              </div>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium truncate">{image.name}</p>
                  <Button
                    variant="ghost" size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDelete(image.id)}
                    disabled={deleteMutation.isPending}
                  >
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
