"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface GalleryImage {
  id: string;
  url: string;
  name: string | null;
}

interface RoomGalleryProps {
  images: GalleryImage[];
  roomName: string;
}

export default function RoomGallery({ images, roomName }: RoomGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const currentImage = images[currentImageIndex];

  return (
    <div className="mb-8 h-fit">
      {/* Main image */}
      <div className="relative h-[300px] md:h-[400px] w-full bg-muted rounded-lg ">
        <img
          src={currentImage?.url || "/placeholder.svg"}
          alt={currentImage?.name || roomName}
          className="object-cover h-full w-full absolute inset-0 rounded-lg overflow-hidden"
        />
      </div>

      <div className='flex gap-2 mt-2'>

      {/* Thumbnail gallery */}
      {images.length > 1 && (
        <div className="flex gap-2 ">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setCurrentImageIndex(index)}
              className={`relative aspect-video w-20 h-16 overflow-hidden rounded-lg transition-all ${
                index === currentImageIndex
                  ? "ring-2 "
                  : ""
              }`}
              aria-label={`View image ${index + 1}`}
            >
              <img
                src={image.url || "/placeholder.svg"}
                alt={image.name || `Gallery image ${index + 1}`}
                className="object-cover h-full w-full"
              />
            </button>
          ))}
        </div>
      )}
</div>
    </div>
  );
}
