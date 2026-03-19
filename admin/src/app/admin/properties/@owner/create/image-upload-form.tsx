"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { uploadToCloudinaryDirect } from "@/server/config/cloudinary";
import { toast } from "sonner";

export interface UploadedImage {
  url: string;  // cloudinary secure_url
  name: string;
}

interface ImageUploaderProps {
  onChange?: (images: UploadedImage[]) => void;
}

export default function ImageUploader({ onChange }: ImageUploaderProps) {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentFile(e.target.files?.[0] || null);
  };

  const handleAddImage = async () => {
    if (!currentFile) {
      toast.error("Please select a file first.");
      return;
    }

    setIsUploading(true);
    try {
      const res = await uploadToCloudinaryDirect(currentFile);
      const newImage: UploadedImage = {
        url: res.secure_url,
        name: currentFile.name,
      };
      const updated = [...images, newImage];
      setImages(updated);
      onChange?.(updated);
      setCurrentFile(null);
    } catch {
      toast.error("Image upload failed. Try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
    onChange?.(updated);
  };

  return (
    <div className="space-y-6">
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {images.map((img, idx) => (
            <Card key={idx} className="overflow-hidden relative group">
              <CardContent className="p-2">
                <img
                  src={img.url}
                  alt={`Uploaded image ${idx + 1}`}
                  className="rounded-lg object-cover w-full h-32"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition"
                  onClick={() => handleRemove(idx)}
                >
                  Remove
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <CardContent className="p-4 space-y-3">
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
          />
          <div className="flex justify-end">
            <Button
              variant="secondary"
              type="button"
              onClick={handleAddImage}
              disabled={isUploading || !currentFile}
            >
              {isUploading ? <><Spinner className="mr-2" /> Uploading...</> : "Add Image"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
