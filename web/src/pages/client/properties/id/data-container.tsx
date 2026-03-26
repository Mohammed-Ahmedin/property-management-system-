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
  ChevronRight, CheckCircle2, Image as ImageIcon
} from "lucide-react";
import { FaStar } from "react-icons/fa";
import { cn } from "@/lib/utils";

interface Props { data: GuestDetailHouseResponse; }

const NAV_TABS = ["Overview", "Rooms", "Facilities", "Reviews", "Location", "Policies"];

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
  const heroRef = useRef<HTMLDivElement>(null);

  const avgRating = property.reviews?.length
    ? property.reviews.reduce((sum: number, r: any) => sum + (r.rating ?? 0), 0) / property.reviews.length
    : 0;

  const ratingLabel =
    avgRating >= 9 ? "Exceptional"
    : avgRating >= 8 ? "Excellent"
    : avgRating >= 7 ? "Very Good"
    : avgRating > 0 ? "Good" : null;

  const starCount = Math.round(avgRating / 2); // convert 10-scale to 5-star

  const allImages = property.images || [];
  const mainImg = allImages[0]?.url;

  // Collect room images for the 2x2 grid — fall back to more property images
  const roomImgs = (property.rooms || []).flatMap((r: any) => r.images || []);
  const gridSources = [...roomImgs, ...allImages.slice(1)];
  const thumbs = Array.from({ length: 4 }, (_, i) => gridSources[i] || null);

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

  return (
    <div className="max-w-7xl mx-auto">
      {/* Back */}
      <div className="py-3 px-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-primary hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to search results
        </button>
      </div>

      {/* ── Photo grid ── */}
      <div ref={heroRef} className="px-4 mb-6">
        <div className="flex gap-1 rounded-xl overflow-hidden h-[340px] md:h-[420px]">
          {/* Main large image */}
          <div className="flex-[2] relative bg-muted">
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
                <div key={i} className="relative bg-muted overflow-hidden">
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
        {allImages.length > 0 && (
          <button className="mt-2 text-xs text-primary hover:underline flex items-center gap-1">
            See all photos <ChevronRight className="w-3 h-3" />
          </button>
        )}
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
              onClick={() => { setActiveTab(tab); scrollTo(tab.toLowerCase()); }}
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

          {/* ── Facilities ── */}
          {property.facilities?.length > 0 && (
            <section id="facilities" className="mb-8">
              <h2 className="text-xl font-bold mb-4">Amenities and facilities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {property.facilities.map((f: any) => (
                  <div key={f.id} className="flex items-center gap-2 text-sm py-1.5">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    <span>{f.name}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

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

          {/* ── Reviews ── */}
          <section id="reviews" className="mb-8">
            {avgRating > 0 && (
              <div className="flex items-center gap-4 mb-6 p-4 border border-border rounded-xl">
                <div className="bg-primary text-white font-bold text-3xl w-16 h-16 flex items-center justify-center rounded-xl shrink-0">
                  {avgRating.toFixed(1)}
                </div>
                <div>
                  <p className="text-lg font-bold">{ratingLabel}</p>
                  <p className="text-sm text-muted-foreground">{property.reviews?.length ?? 0} verified reviews</p>
                  <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                    <span>Location 8.9</span>
                    <span>Cleanliness 8.8</span>
                    <span>Value 8.6</span>
                    <span>Facilities 8.5</span>
                  </div>
                </div>
              </div>
            )}
            <ReviewsContainer propertyId={property.id} />
          </section>

          {/* ── Location ── */}
          <section id="location" className="mb-8">
            <h2 className="text-xl font-bold mb-4">Location</h2>
            <PropertyDetails
              contact={property.contact}
              facilities={property.facilities as any}
              location={property.location}
            />
          </section>

          {/* ── Policies ── */}
          <section id="policies" className="mb-8">
            <h2 className="text-xl font-bold mb-4">Property policies</h2>
            <div className="border border-border rounded-xl p-4 text-sm space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Check-in</span>
                <span className="font-medium">From 15:00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Check-out</span>
                <span className="font-medium">Until 12:00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cancellation</span>
                <span className="font-medium text-green-600">Free cancellation available</span>
              </div>
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
              {property.rooms?.[0]?.price ? (
                <FormatedAmount amount={property.rooms[0].price} className="text-2xl font-bold text-red-500" />
              ) : (
                <p className="text-lg font-bold text-muted-foreground">Contact for price</p>
              )}
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
    </div>
  );
};

export default DataContainer;
