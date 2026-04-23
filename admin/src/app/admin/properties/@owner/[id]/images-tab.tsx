"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Square, Trash, Loader2, MapPin, Building2 } from "lucide-react";
import { api } from "@/hooks/api";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { uploadToCloudinaryDirect } from "@/server/config/cloudinary";

type ImageItem = { url: string; name: string; category?: string };

const ImageSection = ({
  title,
  description,
  icon,
  images,
  category,
  propertyId,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  images: ImageItem[];
  category: "property" | "nearby";
  propertyId?: string;
}) => {
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
      await api.post(`/properties/${propertyId}/images`, {
        url: res.secure_url,
        name: file.name,
        category,
      });
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
    <Card className="mb-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <div>
              <CardTitle className="text-base">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
          </div>
          <label className="cursor-pointer">
            <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
            <Button size="sm" asChild disabled={uploading}>
              <span>
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Add Image"
                )}
              </span>
            </Button>
          </label>
        </div>
      </CardHeader>
      {images.length === 0 ? (
        <div className="w-full flex justify-center items-center py-10">
          <div className="text-center">
            <Square className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No {title.toLowerCase()} added yet</p>
          </div>
        </div>
      ) : (
        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-0">
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
                {deleting === image.url ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash className="w-4 h-4" />
                )}
              </button>
            </div>
          ))}
        </CardContent>
      )}
    </Card>
  );
};

const ImagesTab = ({
  images,
  propertyId,
}: {
  images: ImageItem[];
  propertyId?: string;
}) => {
  const propertyImages = images.filter((img) => !img.category || img.category === "property");
  const nearbyImages = images.filter((img) => img.category === "nearby");

  return (
    <TabsContent value="images">
      <ImageSection
        title="Property Images"
        description="Main images shown in the property gallery"
        icon={<Building2 className="w-5 h-5 text-muted-foreground" />}
        images={propertyImages}
        category="property"
        propertyId={propertyId}
      />
      <ImageSection
        title="Nearby Attractions"
        description="Images of nearby places and attractions"
        icon={<MapPin className="w-5 h-5 text-muted-foreground" />}
        images={nearbyImages}
        category="nearby"
        propertyId={propertyId}
      />
    </TabsContent>
  );
};

export default ImagesTab;
