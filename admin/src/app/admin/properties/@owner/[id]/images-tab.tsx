"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Square, Trash, Loader2 } from "lucide-react";
import { api } from "@/hooks/api";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { uploadToCloudinaryDirect } from "@/server/config/cloudinary";

const ImagesTab = ({ images, propertyId }: { images: { url: string; name: string }[]; propertyId?: string }) => {
  const [deleting, setDeleting] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const queryClient = useQueryClient();

  const handleDelete = async (imageUrl: string) => {
    if (!propertyId) return;
    setDeleting(imageUrl);
    try {
      await api.delete(`/properties/${propertyId}/images`, { data: { url: imageUrl } });
      toast.success("Image deleted");
      queryClient.invalidateQueries({ queryKey: ["guest_houses", propertyId] });
    } catch {
      toast.error("Failed to delete image");
    } finally {
      setDeleting(null);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !propertyId) return;
    setUploading(true);
    try {
      const res = await uploadToCloudinaryDirect(file);
      await api.post(`/properties/${propertyId}/images`, { url: res.secure_url, name: file.name });
      toast.success("Image uploaded");
      queryClient.invalidateQueries({ queryKey: ["guest_houses", propertyId] });
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <TabsContent value="images">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Images</CardTitle>
              <CardDescription>Property images</CardDescription>
            </div>
            <label className="cursor-pointer">
              <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
              <Button size="sm" asChild disabled={uploading}>
                <span>
                  {uploading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Uploading...</> : "Add Image"}
                </span>
              </Button>
            </label>
          </div>
        </CardHeader>

        {images.length === 0 ? (
          <div className="w-full flex justify-center items-center py-16">
            <div className="text-center">
              <Square className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No images available</h3>
              <p className="text-muted-foreground mb-4">No images added yet</p>
            </div>
          </div>
        ) : (
          <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-4">
            {images.map((image, i) => (
              <div key={i} className="relative group rounded-xl overflow-hidden">
                <img src={image.url} alt={image.name} className="w-full aspect-video object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
                <button
                  onClick={() => handleDelete(image.url)}
                  disabled={deleting === image.url}
                  className="absolute top-2 right-2 z-20 p-1.5 rounded-lg bg-destructive text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/90 disabled:opacity-50"
                  aria-label="Delete image"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            ))}
          </CardContent>
        )}
      </Card>
    </TabsContent>
  );
};

export default ImagesTab;
