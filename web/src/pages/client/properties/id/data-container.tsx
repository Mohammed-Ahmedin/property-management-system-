import FormatedAmount from "@/components/shared/formatted-amount";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { GuestDetailHouseResponse } from "@/hooks/api/types/property.types";
import { useNavigate } from "react-router-dom";
import PropertyDetails from "./location";
import { ImageSlider } from "./images-slider";
import { ArrowLeft, Bath, BedDouble, MapPin, Phone, Mail, Wifi, Car, UtensilsCrossed, Star, Users } from "lucide-react";
import ReviewsContainer from "./reviews-container";

interface Props {
  data: GuestDetailHouseResponse;
}

const facilityIcons: Record<string, React.ReactNode> = {
  wifi: <Wifi className="w-4 h-4" />,
  parking: <Car className="w-4 h-4" />,
  breakfast: <UtensilsCrossed className="w-4 h-4" />,
};

const DataContainer = ({ data }: Props) => {
  const property = data.data;
  const navigate = useNavigate();

  const avgRating = property.reviews?.length
    ? property.reviews.reduce((sum: number, r: any) => sum + (r.rating ?? 0), 0) / property.reviews.length
    : 0;

  const ratingLabel =
    avgRating >= 4.5 ? "Exceptional"
    : avgRating >= 4 ? "Excellent"
    : avgRating >= 3.5 ? "Very Good"
    : avgRating > 0 ? "Good"
    : null;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Back */}
      <header className="py-4">
        <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2 pl-0">
          <ArrowLeft className="w-4 h-4" /> Back to results
        </Button>
      </header>

      {/* Title row */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="secondary">{property.type}</Badge>
          </div>
          <h1 className="font-bold text-2xl md:text-3xl">{property.name}</h1>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
            <MapPin className="w-4 h-4 shrink-0" />
            <span>{property.address}</span>
          </div>
        </div>

        {avgRating > 0 && (
          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <p className="text-sm font-medium">{ratingLabel}</p>
              <p className="text-xs text-muted-foreground">{property.reviews?.length ?? 0} reviews</p>
            </div>
            <div className="bg-primary text-primary-foreground font-bold text-xl px-3 py-2 rounded-lg">
              {avgRating.toFixed(1)}
            </div>
          </div>
        )}
      </div>

      {/* Images */}
      <ImageSlider images={property.images} />

      {/* Main layout */}
      <div className="mt-8 flex flex-col lg:flex-row gap-8">
        {/* Left: details */}
        <div className="flex-1 min-w-0">
          {/* About */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">About this property</h2>
            <p className="text-muted-foreground leading-relaxed">{property.about?.description}</p>
          </section>

          {/* Facilities */}
          {property.facilities?.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Facilities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {property.facilities.map((f: any) => (
                  <div key={f.id} className="flex items-center gap-2 text-sm bg-muted/50 rounded-lg px-3 py-2">
                    {facilityIcons[f.name?.toLowerCase()] ?? <Star className="w-4 h-4 text-muted-foreground" />}
                    <span>{f.name}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Rooms */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Available rooms</h2>
            <div className="flex flex-col gap-4">
              {property?.rooms?.length > 0 ? property.rooms.map((r: any) => {
                const bedrooms = r.features?.filter((f: any) => f.category?.toLowerCase() === "bedroom").length ?? 0;
                const bathrooms = r.features?.filter((f: any) => f.category?.toLowerCase() === "bathroom").length ?? 0;
                const kitchens = r.features?.filter((f: any) => f.category?.toLowerCase() === "kitchen").length ?? 0;

                return (
                  <div key={r.id} className="border rounded-xl overflow-hidden flex flex-col sm:flex-row hover:shadow-md transition-shadow">
                    <div className="sm:w-48 w-full shrink-0">
                      <img
                        src={r.images?.[0]?.url || "/placeholder.jpg"}
                        alt={r.name}
                        className="w-full h-40 sm:h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 p-4 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <Badge variant="secondary" className="mb-1 text-xs">{r.type}</Badge>
                            <h3 className="font-semibold text-base">{r.name}</h3>
                          </div>
                          <div className="text-right shrink-0">
                            <FormatedAmount amount={r.price} suffix="/night" className="font-bold text-primary" />
                          </div>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1"><BedDouble className="w-4 h-4" />{bedrooms} bed</span>
                          <span className="flex items-center gap-1"><Bath className="w-4 h-4" />{bathrooms} bath</span>
                          <span className="flex items-center gap-1"><Users className="w-4 h-4" />Max {r.maxOccupancy}</span>
                        </div>
                        {r.services?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {r.services.slice(0, 3).map((s: any) => (
                              <span key={s.id} className="text-xs bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 px-2 py-0.5 rounded-full">
                                {s.name}{s.price ? ` (+ETB ${s.price})` : " (Free)"}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <Button className="mt-3 w-full sm:w-auto" onClick={() => navigate(`/rooms/${r.id}`)}>
                        Book this room
                      </Button>
                    </div>
                  </div>
                );
              }) : (
                <p className="text-muted-foreground text-sm">No rooms available at this time.</p>
              )}
            </div>
          </section>

          {/* Location & Contact */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">Location & Contact</h2>
            <PropertyDetails
              contact={property.contact}
              facilities={property.facilities as any}
              location={property.location}
            />
          </section>

          {/* Reviews */}
          <ReviewsContainer propertyId={property.id} />
        </div>

        {/* Right: sticky contact card */}
        <div className="lg:w-72 shrink-0">
          <div className="sticky top-4 border rounded-xl p-5 bg-card shadow-sm">
            <h3 className="font-semibold text-base mb-4">Contact property</h3>
            {property.contact?.phone && (
              <a href={`tel:${property.contact.phone}`} className="flex items-center gap-3 text-sm mb-3 hover:text-primary transition-colors">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-primary" />
                </div>
                <span>{property.contact.phone}</span>
              </a>
            )}
            {property.contact?.email && (
              <a href={`mailto:${property.contact.email}`} className="flex items-center gap-3 text-sm mb-4 hover:text-primary transition-colors">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <span className="truncate">{property.contact.email}</span>
              </a>
            )}
            <Button className="w-full" onClick={() => navigate(`/properties/${property.id}#rooms`)}>
              See available rooms
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataContainer;
