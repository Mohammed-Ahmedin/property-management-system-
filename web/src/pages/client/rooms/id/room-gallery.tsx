"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, X, Expand, Image as ImageIcon } from "lucide-react";

interface GalleryImage { id: string; url: string; name: string | null; }
interface RoomGalleryProps { images: GalleryImage[]; roomName: string; }

export default function RoomGallery({ images, roomName }: RoomGalleryProps) {
  const [current, setCurrent] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  if (!images?.length) {
    return (
      <div className="mb-8 h-72 rounded-2xl bg-muted flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-20" />
          <p className="text-sm">No images available</p>
        </div>
      </div>
    );
  }

  const prev = () => setCurrent(i => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setCurrent(i => (i === images.length - 1 ? 0 : i + 1));

  return (
    <>
      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center" onClick={() => setLightbox(false)}>
          <button className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full" onClick={() => setLightbox(false)}>
            <X className="w-6 h-6" />
          </button>
          <button className="absolute left-4 top-1/2 -translate-y-1/2 text-white p-3 bg-white/10 hover:bg-white/20 rounded-full" onClick={(e) => { e.stopPropagation(); prev(); }}>
            <ChevronLeft className="w-6 h-6" />
          </button>
          <img src={images[current]?.url} alt={images[current]?.name || roomName} className="max-h-[90vh] max-w-[90vw] object-contain rounded-xl" onClick={e => e.stopPropagation()} />
          <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white p-3 bg-white/10 hover:bg-white/20 rounded-full" onClick={(e) => { e.stopPropagation(); next(); }}>
            <ChevronRight className="w-6 h-6" />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">{current + 1} / {images.length}</div>
        </div>
      )}

      <div className="mb-8">
        {/* Main image */}
        <div className="relative h-[300px] md:h-[420px] w-full bg-muted rounded-2xl overflow-hidden group cursor-pointer" onClick={() => setLightbox(true)}>
          <img src={images[current]?.url || "/placeholder.svg"} alt={images[current]?.name || roomName}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* Expand button */}
          <button className="absolute top-3 right-3 p-2 bg-black/40 hover:bg-black/60 text-white rounded-xl backdrop-blur-sm transition-colors opacity-0 group-hover:opacity-100">
            <Expand className="w-4 h-4" />
          </button>

          {/* Counter */}
          <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm">
            {current + 1} / {images.length}
          </div>

          {/* Nav arrows */}
          {images.length > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/60 text-white rounded-xl backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 hover:scale-110">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/60 text-white rounded-xl backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 hover:scale-110">
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
            {images.map((img, i) => (
              <button key={img.id} onClick={() => setCurrent(i)}
                className={`shrink-0 w-20 h-14 rounded-xl overflow-hidden border-2 transition-all hover:opacity-100 ${
                  i === current ? "border-primary opacity-100 shadow-md shadow-primary/20" : "border-transparent opacity-60 hover:border-border"
                }`}>
                <img src={img.url} alt={img.name || `Image ${i + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
