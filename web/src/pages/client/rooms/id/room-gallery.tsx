import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, X, Expand, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface GalleryImage { id: string; url: string; name: string | null; }
interface RoomGalleryProps { images: GalleryImage[]; roomName: string; }

const AUTO_SLIDE_MS = 4000;

export default function RoomGallery({ images, roomName }: RoomGalleryProps) {
  const [current, setCurrent] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setCurrent(i => (i === images.length - 1 ? 0 : i + 1)), [images.length]);
  const prev = useCallback(() => setCurrent(i => (i === 0 ? images.length - 1 : i - 1)), [images.length]);

  // Auto-slide every 4s when not paused and not in lightbox
  useEffect(() => {
    if (images.length <= 1 || paused || lightbox) return;
    const id = setInterval(next, AUTO_SLIDE_MS);
    return () => clearInterval(id);
  }, [images.length, paused, lightbox, next]);

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

  return (
    <>
      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center" onClick={() => setLightbox(false)}>
          <button className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full transition-colors z-10" onClick={() => setLightbox(false)}>
            <X className="w-6 h-6" />
          </button>
          <button className="absolute left-4 top-1/2 -translate-y-1/2 text-white p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
            onClick={(e) => { e.stopPropagation(); prev(); }}>
            <ChevronLeft className="w-6 h-6" />
          </button>
          <img src={images[current]?.url} alt={images[current]?.name || roomName}
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-xl shadow-2xl"
            onClick={e => e.stopPropagation()} />
          <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
            onClick={(e) => { e.stopPropagation(); next(); }}>
            <ChevronRight className="w-6 h-6" />
          </button>
          {/* Thumbnail strip */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-[90vw] px-2">
            {images.map((img, i) => (
              <button key={img.id} onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
                className={cn("shrink-0 w-14 h-10 rounded-lg overflow-hidden border-2 transition-all",
                  i === current ? "border-white opacity-100" : "border-transparent opacity-50 hover:opacity-80")}>
                <img src={img.url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/60 text-sm bg-black/40 px-3 py-1 rounded-full">
            {current + 1} / {images.length}
          </div>
        </div>
      )}

      <div className="mb-8" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
        {/* Main image */}
        <div className="relative h-[300px] md:h-[420px] w-full bg-muted rounded-2xl overflow-hidden group cursor-pointer"
          onClick={() => setLightbox(true)}>
          {/* Slides */}
          {images.map((img, i) => (
            <img key={img.id} src={img.url} alt={img.name || roomName}
              className={cn(
                "absolute inset-0 w-full h-full object-cover transition-all duration-700",
                i === current ? "opacity-100 scale-100" : "opacity-0 scale-[1.02]"
              )} />
          ))}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* Expand button */}
          <button className="absolute top-3 right-3 p-2 bg-black/40 hover:bg-black/60 text-white rounded-xl backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 z-10">
            <Expand className="w-4 h-4" />
          </button>

          {/* Counter */}
          <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm z-10">
            {current + 1} / {images.length}
          </div>

          {/* Auto-slide progress bar */}
          {images.length > 1 && !paused && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/20 z-10">
              <div
                key={current}
                className="h-full bg-white/70 rounded-full"
                style={{ animation: `slideProgress ${AUTO_SLIDE_MS}ms linear` }}
              />
            </div>
          )}

          {/* Nav arrows */}
          {images.length > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 bg-black/40 hover:bg-black/60 text-white rounded-xl backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 hover:scale-110 z-10">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-black/40 hover:bg-black/60 text-white rounded-xl backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 hover:scale-110 z-10">
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Dot indicators */}
          {images.length > 1 && images.length <= 8 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {images.map((_, i) => (
                <button key={i} onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
                  className={cn("rounded-full transition-all", i === current ? "w-5 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/50 hover:bg-white/80")} />
              ))}
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
            {images.map((img, i) => (
              <button key={img.id} onClick={() => setCurrent(i)}
                className={cn("shrink-0 w-20 h-14 rounded-xl overflow-hidden border-2 transition-all",
                  i === current ? "border-primary opacity-100 shadow-md shadow-primary/20 scale-105" : "border-transparent opacity-60 hover:opacity-90 hover:border-border"
                )}>
                <img src={img.url} alt={img.name || `Image ${i + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* CSS for progress bar animation */}
      <style>{`
        @keyframes slideProgress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </>
  );
}
