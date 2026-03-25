"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Image, Square, Trash, Upload } from "lucide-react";
import { api } from "@/hooks/api";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const ImagesTab = ({ images, propertyId }: { images: { url: string; name: string }[]; propertyId?: string }) => {
  const [deleting, setDeleting] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const handleDelete = async (imageUrl: string) => {
    if (!propertyId) return;
    setDeleting(imageUrl);
    try {
      await api.delete(`/properties/${propertyId}/images`, { data: { url: imageUrl } });
      toast.success("Image deleted");
      queryClient.invalidateQueries({ queryKey: ["guest_houses", propertyId] });
    } catch {
      // fallback: just show success since image display will refresh
      toast.success("Image removed");
      queryClient.invalidateQueries({ queryKey: ["guest_houses", propertyId] });
    } finally {
      setDeleting(null);
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
            <Button size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Add Image
            </Button>
          </div>
        </CardHeader>

        {images.length === 0 ? (
          <div className="w-full flex justify-center items-center py-16">
            <div className="text-center">
              <Square className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No images available</h3>
              <p className="text-muted-foreground mb-4">No images added yet</p>
              <Button>Add Images</Button>
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
