import { useState, useRef, useEffect } from "react";
import FormatedAmount from "@/components/shared/formatted-amount";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { GuestDetailHouseResponse } from "@/hooks/api/types/property.types";
import { useNavigate } from "react-router-dom";
import PropertyDetails from "./location";
import ReviewsContainer from "./reviews-container";
import {
  ArrowLeft, Bath, BedDouble, MapPin, Phone, Mail,
  Wifi, Car, UtensilsCrossed, Star, Users, Heart,
  ChevronRight, CheckCircle2, Image as ImageIcon, X, ChevronLeft,
  Plane, CarFront
} from "lucide-react";
import { FaStar } from "react-icons/fa";
import { cn } from "@/lib/utils";

interface Props { data: GuestDetailHouseResponse; }

const NAV_TABS = ["Overview", "Rooms", "Trip recommendations", "Facilities", "Reviews", "Location", "Policies"];
const PANEL_TABS = ["Facilities", "Reviews", "Location", "Policies"];

const facilityIcons: Record<string, React.ReactNode> = {
  wifi: <Wifi className="w-4 h-4" />,
  parking: <Car className="w-4 h-4" />,
  breakfast: <UtensilsCrossed className="w-4 h-4" />,
};

const DataContainer = ({ data }: Props) => {
  const property = data.data;
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("Overview");
  const [stickyNav, setStickyNav] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryFilter, setGalleryFilter] = useState<"all" | "rooms" | "property" | "nearby">("all");
  const [galleryStartIdx, setGalleryStartIdx] = useState(0);
  const [panelTab, setPanelTab] = useState<string | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const avgRating = property.reviews?.length
    ? property.reviews.reduce((sum: number, r: any) => sum + (r.rating ?? 0), 0) / property.reviews.length
    : 0;

  const ratingLabel =
    avgRating >= 4.5 ? "Exceptional"
    : avgRating >= 4 ? "Excellent"
    : avgRating >= 3.5 ? "Very Good"
    : avgRating > 0 ? "Good" : null;

  const starCount = Math.round(avgRating); // reviews are already 1-5 scale

  const allImages = (property.images || []).filter((img: any) => !img.category || img.category === "property");
  const nearbyImgs = (property.images || []).filter((img: any) => img.category === "nearby");
  const mainImg = allImages[0]?.url;

  // Collect room images for the 2x2 grid — fall back to more property images
  const roomImgs = (property.rooms || []).flatMap((r: any) => r.images || []);
  const gridSources = [...roomImgs, ...allImages.slice(1)];
  const thumbs = Array.from({ length: 4 }, (_, i) => gridSources[i] || null);

  // All images for lightbox (combined)
  const lightboxImages = [...allImages, ...roomImgs, ...nearbyImgs];

  // Filtered images based on gallery tab
  const filteredGalleryImages =
    galleryFilter === "rooms" ? roomImgs
    : galleryFilter === "property" ? allImages
    : galleryFilter === "nearby" ? nearbyImgs
    : lightboxImages;

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const obs = new IntersectionObserver(([e]) => setStickyNav(!e.isIntersecting), { threshold: 0 });
    obs.observe(hero);
    return () => obs.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    if (PANEL_TABS.includes(tab)) {
      setPanelTab(tab);
    } else {
      scrollTo(tab.toLowerCase().replace(" ", "-"));
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Gallery Modal — Agoda style, overlays the page (not full screen) */}
      {galleryOpen && lightboxImages.length > 0 && (
        <div className="fixed inset-0 z-[9998] flex items-start justify-center pt-8 px-4" onClick={() => { setGalleryOpen(false); setGalleryStartIdx(0); setGalleryFilter("all"); }}>
          <div className="absolute inset-0 bg-black/60" />
          <div
            className="relative bg-white rounded-xl shadow-2xl flex w-full max-w-5xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Main area */}
            <div className="flex-1 flex flex-col overflow-hidden min-w-0">
              {/* Header */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 shrink-0">
                {galleryStartIdx > 0 && (
                  <button onClick={() => setGalleryStartIdx(0)} className="p-1.5 hover:bg-gray-100 rounded-full">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                )}
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 border-primary text-primary text-sm font-medium">
                  <ImageIcon className="w-4 h-4" /> Property Images
                </button>
                <button onClick={() => { setGalleryOpen(false); setGalleryStartIdx(0); setGalleryFilter("all"); }} className="ml-auto p-1.5 hover:bg-gray-100 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Category tabs */}
              <div className="flex gap-0 px-4 border-b border-gray-100 shrink-0 overflow-x-auto">
                {[
                  { label: `All (${lightboxImages.length})`, key: "all" as const },
                  ...(roomImgs.length > 0 ? [{ label: `Rooms (${roomImgs.length})`, key: "rooms" as const }] : []),
                  ...(allImages.length > 0 ? [{ label: `Property views (${allImages.length})`, key: "property" as const }] : []),
                  ...(nearbyImgs.length > 0 ? [{ label: `Nearby attractions (${nearbyImgs.length})`, key: "nearby" as const }] : []),
                ].map((tab) => (
                  <button key={tab.key}
                    onClick={() => { setGalleryFilter(tab.key); setGalleryStartIdx(0); }}
                    className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${galleryFilter === tab.key ? "border-primary text-primary" : "border-transparent text-gray-600 hover:text-gray-900"}`}>
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Content */}
              {galleryStartIdx > 0 ? (
                /* Single image view */
                <div className="flex-1 flex flex-col overflow-hidden">
                  <div className="flex-1 relative bg-black flex items-center justify-center min-h-0">
                    <button className="absolute left-3 top-1/2 -translate-y-1/2 text-white p-2.5 bg-black/40 hover:bg-black/60 rounded-full z-10"
                      onClick={() => setGalleryStartIdx(i => Math.max(1, i - 1))}>
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <img src={(filteredGalleryImages[galleryStartIdx - 1] as any)?.url} alt="" className="max-h-full max-w-full object-contain" />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-white p-2.5 bg-black/40 hover:bg-black/60 rounded-full z-10"
                      onClick={() => setGalleryStartIdx(i => Math.min(filteredGalleryImages.length, i + 1))}>
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                  {/* Thumbnail strip */}
                  <div className="h-[72px] bg-black flex items-center gap-1 px-2 overflow-x-auto shrink-0">
                    <button onClick={() => setGalleryStartIdx(0)} className="flex flex-col items-center gap-0.5 px-2 py-1 text-white text-xs shrink-0">
                      <div className="w-7 h-7 bg-white/20 rounded flex items-center justify-center">
                        <ImageIcon className="w-3.5 h-3.5" />
                      </div>
                      Gallery
                    </button>
                    {filteredGalleryImages.map((img, i) => (
                      <button key={i} onClick={() => setGalleryStartIdx(i + 1)}
                        className={`shrink-0 h-[56px] w-[72px] rounded overflow-hidden border-2 transition-colors ${galleryStartIdx === i + 1 ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"}`}>
                        <img src={(img as any).url} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                /* Grid view */
                <div className="flex-1 overflow-y-auto p-3">
                  <div className="grid grid-cols-3 gap-1.5">
                    {filteredGalleryImages.map((img, i) => (
                      <button key={i} onClick={() => setGalleryStartIdx(i + 1)}
                        className="aspect-video rounded-lg overflow-hidden hover:opacity-90 transition-opacity">
                        <img src={(img as any).url} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                  {filteredGalleryImages.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                      <ImageIcon className="w-12 h-12 mb-2 opacity-30" />
                      <p className="text-sm">No images in this category</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right sidebar */}
            <div className="w-[220px] shrink-0 border-l border-gray-200 flex flex-col p-4 overflow-y-auto">
              <h3 className="font-bold text-sm mb-3">Things you'll love</h3>
              <ul className="space-y-2 mb-6 flex-1">
                {property.facilities?.slice(0, 4).map((f: any) => (
                  <li key={f.id} className="flex items-center gap-2 text-xs text-gray-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                    {f.name}
                  </li>
                ))}
                {property.location?.city && (
                  <li className="flex items-center gap-2 text-xs text-gray-700">
                    <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                    Located in {property.location.city}
                  </li>
                )}
              </ul>
              <Button className="w-full rounded-full text-sm" onClick={() => { setGalleryOpen(false); setGalleryFilter("all"); scrollTo("rooms"); }}>
                Check availability
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Back */}
      <div className="py-3 px-4">
        <button
          onClick={() => {
            if (window.history.length > 2) {
              navigate(-1);
            } else {
              navigate("/properties");
            }
          }}
          className="flex items-center gap-1 text-sm text-primary hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Back to search results
        </button>
      </div>

      {/* ── Photo grid ── */}
      <div ref={heroRef} className="px-4 mb-6">
        <div className="flex gap-1 rounded-xl overflow-hidden h-[340px] md:h-[420px]">
          {/* Main large image */}
          <div className="flex-[2] relative bg-muted cursor-pointer" onClick={() => { setGalleryStartIdx(0); setGalleryOpen(true); }}>
            {mainImg ? (
              <img src={mainImg} alt={property.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                <ImageIcon className="w-16 h-16 opacity-20" />
              </div>
            )}
            <button
              onClick={() => setSaved(s => !s)}
              className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white shadow"
            >
              <Heart className={cn("w-5 h-5", saved ? "fill-red-500 text-red-500" : "text-gray-600")} />
            </button>
          </div>
          {/* 2x2 thumbnail grid */}
          <div className="flex-1 grid grid-cols-2 gap-1">
            {thumbs.map((img, i) => {
              const isLast = i === 3;
              const totalExtra = gridSources.length - 4;
              return (
                <div key={i} className="relative bg-muted overflow-hidden cursor-pointer" onClick={() => { if (img) { setGalleryStartIdx(i + 1); setGalleryOpen(true); } }}>
                  {img ? (
                    <>
                      <img src={(img as any).url} alt="" className="w-full h-full object-cover" />
                      {isLast && totalExtra > 0 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer">
                          <span className="text-white text-sm font-bold">+{totalExtra} photos</span>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted">
                      <ImageIcon className="w-8 h-8 text-muted-foreground opacity-20" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <button onClick={() => { setGalleryStartIdx(0); setGalleryOpen(true); }} className="mt-2 text-xs text-primary hover:underline flex items-center gap-1">
          See all photos <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* ── Sticky nav tabs ── */}
      <div className={cn(
        "bg-white dark:bg-zinc-900 border-b border-border transition-all duration-300 z-30",
        stickyNav ? "fixed top-16 left-0 right-0 shadow-md" : "relative"
      )}>
        <div className="max-w-7xl mx-auto px-4 flex overflow-x-auto">
          {NAV_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabClick(tab)}
              className={cn(
                "px-5 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors shrink-0",
                activeTab === tab
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      {stickyNav && <div className="h-[49px]" />}

      {/* ── Main layout ── */}
      <div className="flex flex-col lg:flex-row gap-8 px-4 py-6">
        {/* Left column */}
        <div className="flex-1 min-w-0">

          {/* ── Overview ── */}
          <section id="overview" className="mb-8">
            {/* Name + stars + address */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="secondary" className="text-xs">{property.type}</Badge>
                </div>
                <h1 className="font-bold text-2xl md:text-3xl mb-1">{property.name}</h1>
                {/* Stars */}
                {starCount > 0 && (
                  <div className="flex items-center gap-0.5 mb-2">
                    {Array.from({ length: Math.min(starCount, 5) }).map((_, i) => (
                      <FaStar key={i} className="w-4 h-4 text-yellow-400" />
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-sm text-primary">
                  <MapPin className="w-4 h-4 shrink-0" />
                  <span>{property.address}</span>
                  <span className="text-muted-foreground cursor-pointer hover:underline">· SEE MAP</span>
                </div>
              </div>
              {avgRating > 0 && (
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <p className="text-base font-bold">{ratingLabel}</p>
                    <p className="text-xs text-muted-foreground">{property.reviews?.length ?? 0} reviews</p>
                  </div>
                  <div className="bg-primary text-white font-bold text-xl w-12 h-12 flex items-center justify-center rounded-lg">
                    {avgRating.toFixed(1)}
                  </div>
                </div>
              )}
            </div>

            {/* Highlights */}
            {property.facilities?.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                {property.facilities.slice(0, 3).map((f: any) => (
                  <div key={f.id} className="border border-border rounded-xl p-3 flex flex-col gap-2">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      {facilityIcons[f.name?.toLowerCase()] ?? <Star className="w-5 h-5 text-primary" />}
                    </div>
                    <p className="text-sm font-semibold">{f.name}</p>
                  </div>
                ))}
              </div>
            )}

            {/* About */}
            {property.about?.description && (
              <div className="mb-6">
                <h2 className="text-lg font-bold mb-2">About us</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{property.about.description}</p>
              </div>
            )}
          </section>

          {/* ── Rooms ── */}
          <section id="rooms" className="mb-8">
            <h2 className="text-xl font-bold mb-4">Select your room</h2>
            <div className="flex flex-col gap-4">
              {property?.rooms?.length > 0 ? property.rooms.map((r: any) => {
                const bedrooms = r.features?.filter((f: any) => f.category?.toLowerCase() === "bedroom").length ?? 0;
                const bathrooms = r.features?.filter((f: any) => f.category?.toLowerCase() === "bathroom").length ?? 0;
                return (
                  <div key={r.id} className="border border-border rounded-xl overflow-hidden flex flex-col sm:flex-row hover:shadow-md transition-shadow">
                    {/* Room image */}
                    <div className="sm:w-52 w-full shrink-0 bg-muted">
                      {r.images?.[0]?.url ? (
                        <img src={r.images[0].url} alt={r.name} className="w-full h-44 sm:h-full object-cover" />
                      ) : (
                        <div className="w-full h-44 sm:h-full flex items-center justify-center">
                          <ImageIcon className="w-10 h-10 text-muted-foreground opacity-30" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 p-4 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <Badge variant="secondary" className="mb-1 text-xs">{r.type}</Badge>
                            <h3 className="font-bold text-base text-primary hover:underline cursor-pointer" onClick={() => navigate(`/rooms/${r.id}`)}>
                              {r.name}
                            </h3>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-xs text-muted-foreground">per night</p>
                            <FormatedAmount amount={r.price} className="font-bold text-lg text-red-500" />
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                          {bedrooms > 0 && <span className="flex items-center gap-1"><BedDouble className="w-4 h-4" />{bedrooms} bed</span>}
                          {bathrooms > 0 && <span className="flex items-center gap-1"><Bath className="w-4 h-4" />{bathrooms} bath</span>}
                          <span className="flex items-center gap-1"><Users className="w-4 h-4" />Max {r.maxOccupancy}</span>
                        </div>
                        {r.services?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {r.services.slice(0, 4).map((s: any) => (
                              <span key={s.id} className="text-xs bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 px-2 py-0.5 rounded-full border border-green-100 dark:border-green-800">
                                {s.name}{s.price ? ` (+ETB ${s.price})` : " (Free)"}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <Button className="mt-2 w-full sm:w-auto sm:self-end" onClick={() => navigate(`/rooms/${r.id}`)}>
                        Book this room
                      </Button>
                    </div>
                  </div>
                );
              }) : (
                <div className="border border-border rounded-xl p-8 text-center text-muted-foreground">
                  <BedDouble className="w-10 h-10 mx-auto mb-2 opacity-20" />
                  <p className="text-sm">No rooms available at this time.</p>
                </div>
              )}
            </div>
          </section>

          {/* ── Trip Recommendations ── */}
          <section id="trip-recommendations" className="mb-8">
            <h2 className="text-xl font-bold mb-2">Plan your journey to your hotel</h2>
            <p className="text-sm text-muted-foreground mb-4">Book your ride in advance for a hassle-free trip</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border border-border rounded-xl p-4 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center shrink-0">
                    <Plane className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Book your airport transfer</p>
                    <p className="text-xs text-muted-foreground mt-1">Get to your hotel easily and securely</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full"
                  onClick={() => window.open("https://www.ethiopianairlines.com/en-ke/", "_blank")}>
                  Search
                </Button>
              </div>
              <div className="border border-border rounded-xl p-4 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center shrink-0">
                    <CarFront className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Rent a car</p>
                    <p className="text-xs text-muted-foreground mt-1">Find an ideal ride for your trip</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full" onClick={() => window.open("https://ride8294.com/", "_blank")}>
                  Search
                </Button>
              </div>
            </div>
          </section>

          {/* ── Services & Facilities ── */}
          {(() => {
            const propFacilities = property.facilities || [];
            const allRoomServices = Array.from(new Map(
              (property.rooms || []).flatMap((r: any) => r.services || []).map((s: any) => [s.name, s])
            ).values());
            if (propFacilities.length === 0 && allRoomServices.length === 0) return null;
            return (
              <section id="facilities" className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">Services & Facilities</h2>
                  <button onClick={() => setPanelTab("Facilities")} className="text-sm text-primary hover:underline flex items-center gap-1">
                    See all <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                {/* Facilities */}
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Facilities</p>
                {propFacilities.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-5">
                    {propFacilities.slice(0, 6).map((f: any) => (
                      <div key={f.id} className="flex items-center gap-2 bg-primary/5 border border-primary/10 rounded-lg px-3 py-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                        <span className="font-medium">{f.name}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic mb-5">No facilities available at the moment.</p>
                )}
                {/* Services */}
                {(() => {
                  const allRoomServices = Array.from(new Map(
                    (property.rooms || []).flatMap((r: any) => r.services || []).map((s: any) => [s.name, s])
                  ).values());
                  return (
                    <>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 mt-1">Room Services</p>
                      {allRoomServices.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {allRoomServices.slice(0, 10).map((s: any) => (
                            <span key={s.id} className="inline-flex items-center gap-1.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 rounded-full px-3 py-1 text-xs font-medium">
                              <CheckCircle2 className="w-3 h-3 shrink-0" />
                              {s.name}{s.price ? ` · ETB ${s.price}` : " · Free"}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground italic">No services available at the moment.</p>
                      )}
                    </>
                  );
                })()}
                {(propFacilities.length > 6 || allRoomServices.length > 10) && (
                  <button onClick={() => setPanelTab("Facilities")} className="mt-3 text-sm text-primary hover:underline">
                    See all services & facilities
                  </button>
                )}
              </section>
            );
          })()}

          {/* ── Reviews ── */}
          <section id="reviews" className="mb-8">
            {avgRating > 0 && (
              <div className="flex items-center gap-4 mb-4 p-4 border border-border rounded-xl cursor-pointer hover:bg-muted/30 transition-colors" onClick={() => setPanelTab("Reviews")}>
                <div className="bg-primary text-white font-bold text-2xl w-14 h-14 flex items-center justify-center rounded-xl shrink-0">
                  {avgRating.toFixed(1)}
                </div>
                <div className="flex-1">
                  <p className="text-lg font-bold">{ratingLabel}</p>
                  <p className="text-sm text-muted-foreground">{property.reviews?.length ?? 0} verified reviews</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            )}
            <button onClick={() => setPanelTab("Reviews")} className="text-sm text-primary hover:underline flex items-center gap-1">
              Read all reviews <ChevronRight className="w-4 h-4" />
            </button>
          </section>

          {/* ── Location ── */}
          <section id="location" className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Location</h2>
              <button onClick={() => setPanelTab("Location")} className="text-sm text-primary hover:underline flex items-center gap-1">
                View map <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <MapPin className="w-4 h-4 text-primary shrink-0" />
              <span>{property.address}</span>
            </div>
            <button onClick={() => setPanelTab("Location")} className="text-sm text-primary hover:underline">
              See full location details
            </button>
          </section>

          {/* ── Policies ── */}
          <section id="policies" className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Property policies</h2>
              <button onClick={() => setPanelTab("Policies")} className="text-sm text-primary hover:underline flex items-center gap-1">
                See all <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="border border-border rounded-xl p-4 text-sm space-y-3">
              <div className="flex justify-between"><span className="text-muted-foreground">Check-in</span><span className="font-medium">From 15:00</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Check-out</span><span className="font-medium">Until 12:00</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Cancellation</span><span className="font-medium text-green-600">Free cancellation available</span></div>
            </div>
          </section>
        </div>

        {/* ── Right sticky booking card ── */}
        <div className="lg:w-[300px] shrink-0">
          <div className="sticky top-24 border border-border rounded-xl p-5 bg-card shadow-sm">
            {/* Rating */}
            {avgRating > 0 && (
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
                <div className="bg-primary text-white font-bold text-lg w-10 h-10 flex items-center justify-center rounded-lg shrink-0">
                  {avgRating.toFixed(1)}
                </div>
                <div>
                  <p className="text-sm font-bold">{ratingLabel}</p>
                  <p className="text-xs text-muted-foreground">{property.reviews?.length ?? 0} reviews</p>
                </div>
              </div>
            )}

            {/* Price */}
            <div className="mb-4">
              <p className="text-xs text-muted-foreground mb-1">Avg price per night</p>
              {(() => {
                const prices = (property.rooms || []).map((r: any) => r.price).filter((p: number) => p > 0);
                const avg = prices.length ? Math.round(prices.reduce((a: number, b: number) => a + b, 0) / prices.length) : null;
                return avg
                  ? <p className="text-2xl font-bold text-red-500">ETB {avg.toLocaleString()}</p>
                  : <p className="text-lg font-bold text-muted-foreground">Contact for price</p>;
              })()}
            </div>

            <Button className="w-full mb-3 font-bold" onClick={() => scrollTo("rooms")}>
              Check availability
            </Button>

            {/* Contact */}
            <div className="space-y-2 pt-3 border-t border-border">
              {property.contact?.phone && (
                <a href={`tel:${property.contact.phone}`} className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
                  <Phone className="w-4 h-4 text-primary shrink-0" />
                  <span>{property.contact.phone}</span>
                </a>
              )}
              {property.contact?.email && (
                <a href={`mailto:${property.contact.email}`} className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
                  <Mail className="w-4 h-4 text-primary shrink-0" />
                  <span className="truncate">{property.contact.email}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* ── Slide-in Panel ── */}
      {panelTab && (
        <div className="fixed inset-0 z-[9998]" onClick={() => setPanelTab(null)}>
          <div className="absolute inset-0 bg-black/40" />
          <div
            className="absolute right-0 top-0 h-full w-full max-w-2xl bg-background shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Panel header with tabs */}
            <div className="border-b border-border">
              <div className="flex items-center justify-between px-6 pt-4 pb-0">
                <h2 className="text-lg font-bold">Property Information</h2>
                <button onClick={() => setPanelTab(null)} className="p-2 hover:bg-muted rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex overflow-x-auto">
                {PANEL_TABS.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setPanelTab(tab)}
                    className={cn(
                      "px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors shrink-0",
                      panelTab === tab ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Panel content */}
            <div className="flex-1 overflow-y-auto p-6">
              {panelTab === "Facilities" && (
                <div>
                  <h3 className="text-lg font-bold mb-5">Services & Facilities</h3>

                  {/* Facilities */}
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Facilities</p>
                  {(property.facilities?.length > 0) ? (
                    <div className="grid grid-cols-2 gap-2 mb-6">
                      {property.facilities.map((f: any) => (
                        <div key={f.id} className="flex items-center gap-2 bg-primary/5 border border-primary/10 rounded-lg px-3 py-2.5 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                          <span className="font-medium">{f.name}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic mb-6">No facilities available at the moment.</p>
                  )}

                  {/* Room Services */}
                  {(() => {
                    const allServices = Array.from(new Map(
                      (property.rooms || []).flatMap((r: any) => r.services || []).map((s: any) => [s.name, s])
                    ).values());
                    return (
                      <>
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Room Services</p>
                        {allServices.length > 0 ? (
                          <div className="flex flex-col gap-2">
                            {allServices.map((s: any) => (
                              <div key={s.id} className="flex items-center justify-between py-2.5 px-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                                <div className="flex items-center gap-2">
                                  <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                                  <span className="text-sm font-medium text-green-800 dark:text-green-300">{s.name}</span>
                                </div>
                                <span className="text-xs font-semibold text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/40 px-2 py-0.5 rounded-full">
                                  {s.price ? `ETB ${s.price}` : "Free"}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground italic">No services available at the moment.</p>
                        )}
                      </>
                    );
                  })()}
                </div>
              )}

              {panelTab === "Reviews" && (
                <div>
                  {avgRating > 0 && (
                    <div className="flex items-center gap-4 mb-6 p-4 bg-muted/30 rounded-xl">
                      <div className="bg-primary text-white font-bold text-xl w-12 h-12 flex items-center justify-center rounded-xl shrink-0">
                        {avgRating.toFixed(1)}
                      </div>
                      <div>
                        <p className="font-bold">{ratingLabel}</p>
                        <p className="text-sm text-muted-foreground">{property.reviews?.length ?? 0} verified reviews</p>
                      </div>
                    </div>
                  )}
                  <ReviewsContainer propertyId={property.id} />
                </div>
              )}

              {panelTab === "Location" && (
                <div>
                  <h3 className="text-lg font-bold mb-4">Location</h3>
                  <PropertyDetails
                    contact={property.contact}
                    facilities={property.facilities as any}
                    location={property.location}
                  />
                </div>
              )}

              {panelTab === "Policies" && (
                <div>
                  <h3 className="text-lg font-bold mb-4">Property policies</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between py-3 border-b border-border">
                      <span className="text-muted-foreground">Check-in</span>
                      <span className="font-medium">From 15:00</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-border">
                      <span className="text-muted-foreground">Check-out</span>
                      <span className="font-medium">Until 12:00</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-border">
                      <span className="text-muted-foreground">Cancellation</span>
                      <span className="font-medium text-green-600">Free cancellation available</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-border">
                      <span className="text-muted-foreground">Children</span>
                      <span className="font-medium">All children welcome</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-border">
                      <span className="text-muted-foreground">Pets</span>
                      <span className="font-medium">Not allowed</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataContainer;
