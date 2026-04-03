import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, X, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

interface GalleryImage { id: string; url: string; name: string | null; }
interface RoomGalleryProps { images: GalleryImage[]; roomName: string; services?: any[]; }

const AUTO_SLIDE_MS = 4000;

export default function RoomGallery({ images, roomName, services }: RoomGalleryProps) {
  const [current, setCurrent] = useState(0);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIdx, setGalleryIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setCurrent(i => (i === images.length - 1 ? 0 : i + 1)), [images.length]);
  const prev = useCallback(() => setCurrent(i => (i === 0 ? images.length - 1 : i - 1)), [images.length]);

  useEffect(() => {
    if (images.length <= 1 || paused || galleryOpen) return;
    const id = setInterval(next, AUTO_SLIDE_MS);
    return () => clearInterval(id);
  }, [images.length, paused, galleryOpen, next]);

  const openGallery = (idx: number) => { setGalleryIdx(idx + 1); setGalleryOpen(true); };

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
      {/* Gallery Modal — same style as property page, only "All" tab */}
      {galleryOpen && (
        <div className="fixed inset-0 z-[9998] flex items-start justify-center pt-8 px-4"
          onClick={() => { setGalleryOpen(false); setGalleryIdx(0); }}>
          <div className="absolute inset-0 bg-black/70" />
          <div className="relative bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl flex w-full max-w-5xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex-1 flex flex-col overflow-hidden min-w-0">
              {/* Header */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-zinc-700 shrink-0">
                {galleryIdx > 0 && (
                  <button onClick={() => setGalleryIdx(0)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                )}
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 border-primary text-primary text-sm font-medium">
                  <ImageIcon className="w-4 h-4" /> Room Images
                </button>
                <span className="text-xs text-muted-foreground ml-1">All ({images.length})</span>
                <button onClick={() => { setGalleryOpen(false); setGalleryIdx(0); }}
                  className="ml-auto p-1.5 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              {galleryIdx > 0 ? (
                <div className="flex-1 flex flex-col overflow-hidden">
                  <div className="flex-1 relative bg-black flex items-center justify-center min-h-0">
                    <button className="absolute left-3 top-1/2 -translate-y-1/2 text-white p-2.5 bg-black/40 hover:bg-black/60 rounded-full z-10"
                      onClick={() => setGalleryIdx(i => Math.max(1, i - 1))}>
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <img src={images[galleryIdx - 1]?.url} alt="" className="max-h-full max-w-full object-contain" />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-white p-2.5 bg-black/40 hover:bg-black/60 rounded-full z-10"
                      onClick={() => setGalleryIdx(i => Math.min(images.length, i + 1))}>
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="h-[72px] bg-black flex items-center gap-1 px-2 overflow-x-auto shrink-0">
                    <button onClick={() => setGalleryIdx(0)} className="flex flex-col items-center gap-0.5 px-2 py-1 text-white text-xs shrink-0">
                      <div className="w-7 h-7 bg-white/20 rounded flex items-center justify-center">
                        <ImageIcon className="w-3.5 h-3.5" />
                      </div>
                      Gallery
                    </button>
                    {images.map((img, i) => (
                      <button key={img.id} onClick={() => setGalleryIdx(i + 1)}
                        className={`shrink-0 h-[56px] w-[72px] rounded overflow-hidden border-2 transition-colors ${galleryIdx === i + 1 ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"}`}>
                        <img src={img.url} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto p-3">
                  <div className="grid grid-cols-3 gap-1.5">
                    {images.map((img, i) => (
                      <button key={img.id} onClick={() => setGalleryIdx(i + 1)}
                        className="aspect-video rounded-lg overflow-hidden hover:opacity-90 transition-opacity">
                        <img src={img.url} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right sidebar */}
            <div className="w-[220px] shrink-0 border-l border-gray-200 dark:border-zinc-700 flex flex-col p-4 overflow-y-auto">
              <h3 className="font-bold text-sm mb-3">Room highlights</h3>
              <ul className="space-y-2 mb-6 flex-1">
                <li className="flex items-center gap-2 text-xs text-gray-700 dark:text-zinc-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />{roomName}
                </li>
                {services?.slice(0, 4).map((s: any) => (
                  <li key={s.id} className="flex items-center gap-2 text-xs text-gray-700 dark:text-zinc-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                    {s.name}{s.price ? ` (+ETB ${s.price})` : " (Free)"}
                  </li>
                ))}
              </ul>
              <Button className="w-full rounded-full text-sm" onClick={() => setGalleryOpen(false)}>
                Back to room
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main gallery */}
      <div className="mb-8" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
        <div className="relative h-[300px] md:h-[420px] w-full bg-muted rounded-2xl overflow-hidden group cursor-pointer"
          onClick={() => openGallery(current)}>
          {images.map((img, i) => (
            <img key={img.id} src={img.url} alt={img.name || roomName}
              className={cn("absolute inset-0 w-full h-full object-cover transition-all duration-700",
                i === current ? "opacity-100 scale-100" : "opacity-0 scale-[1.02]")} />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm z-10 flex items-center gap-1.5">
            <ImageIcon className="w-3 h-3" /> {current + 1} / {images.length}
          </div>
          {images.length > 1 && !paused && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/20 z-10">
              <div key={current} className="h-full bg-white/70 rounded-full" style={{ animation: `slideProgress ${AUTO_SLIDE_MS}ms linear` }} />
            </div>
          )}
          {images.length > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 bg-black/40 hover:bg-black/60 text-white rounded-xl backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 z-10">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-black/40 hover:bg-black/60 text-white rounded-xl backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 z-10">
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
          {images.length > 1 && images.length <= 8 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {images.map((_, i) => (
                <button key={i} onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
                  className={cn("rounded-full transition-all", i === current ? "w-5 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/50 hover:bg-white/80")} />
              ))}
            </div>
          )}
        </div>
        {images.length > 1 && (
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
            {images.map((img, i) => (
              <button key={img.id} onClick={() => setCurrent(i)}
                className={cn("shrink-0 w-20 h-14 rounded-xl overflow-hidden border-2 transition-all",
                  i === current ? "border-primary opacity-100 shadow-md shadow-primary/20 scale-105" : "border-transparent opacity-60 hover:opacity-90 hover:border-border")}>
                <img src={img.url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
      <style>{`@keyframes slideProgress { from { width: 0% } to { width: 100% } }`}</style>
    </>
  );
}
