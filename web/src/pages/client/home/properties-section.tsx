import { useGetTrendingProperties } from "@/hooks/api/use-properties";
import SectionHeader from "./_components/section-header";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";
import { FaStar } from "react-icons/fa";

const CARD_W = 280;
const GAP = 16;
const ITEM_W = CARD_W + GAP;

const TrendingCard = ({ data }: { data: any }) => {
  const navigate = useNavigate();
  const img = data.images?.[0]?.url || data.rooms?.[0]?.images?.[0]?.url;
  const avgRating = data.reviews?.length
    ? data.reviews.reduce((s: number, r: any) => s + (r.rating ?? 0), 0) / data.reviews.length
    : 0;
  const minPrice = Math.min(...(data.rooms || []).map((r: any) => r.price).filter((p: number) => p > 0));

  return (
    <div
      onClick={() => navigate(`/properties/${data.id}`)}
      className="cursor-pointer rounded-2xl overflow-hidden border border-border bg-card hover:shadow-lg transition-shadow duration-300 shrink-0"
      style={{ width: `${CARD_W}px` }}
    >
      <div className="relative h-48 bg-muted overflow-hidden">
        {img ? (
          <img src={img} alt={data.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">No image</div>
        )}
        <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-semibold px-2 py-0.5 rounded-full">
          {data.type || "HOTEL"}
        </div>
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-sm line-clamp-1 mb-1">{data.name}</h3>
        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
          <MapPin className="w-3 h-3 shrink-0" />
          <span className="line-clamp-1">{data.location?.city || data.address}</span>
        </div>
        <div className="flex items-center justify-between">
          {avgRating > 0 && (
            <div className="flex items-center gap-1">
              <div className="bg-primary text-primary-foreground text-xs font-bold px-1.5 py-0.5 rounded">
                {avgRating.toFixed(1)}
              </div>
              <div className="flex gap-0.5">
                {Array.from({ length: Math.min(Math.round(avgRating), 5) }).map((_, i) => (
                  <FaStar key={i} className="w-2.5 h-2.5 text-yellow-400" />
                ))}
              </div>
            </div>
          )}
          {!isNaN(minPrice) && minPrice > 0 && (
            <span className="text-xs font-bold text-red-500">ETB {minPrice.toLocaleString()}/night</span>
          )}
        </div>
      </div>
    </div>
  );
};

const PropertiesSection = () => {
  const dataQuery = useGetTrendingProperties();
  const properties: any[] = dataQuery.data?.data || [];
  const doubled = properties.length > 0 ? [...properties, ...properties] : [];
  const oneSetWidth = properties.length * ITEM_W;

  const trackRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(0);
  const rafRef = useRef(0);
  const pausedRef = useRef(false);

  useEffect(() => {
    if (properties.length === 0) return;

    const tick = () => {
      if (!pausedRef.current) {
        posRef.current += 0.6;
        // Reset when we've scrolled exactly one full set
        if (posRef.current >= oneSetWidth) {
          posRef.current -= oneSetWidth; // subtract instead of reset to 0
        }
        if (trackRef.current) {
          trackRef.current.style.transform = `translateX(-${posRef.current}px)`;
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [properties.length, oneSetWidth]);

  return (
    <section className="c-px pb-10 overflow-hidden">
      <SectionHeader title="Trending Properties" />

      {dataQuery.isLoading ? (
        <div className="flex gap-4">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="w-[300px] h-[300px] rounded-2xl shrink-0" />)}
        </div>
      ) : dataQuery.isError || properties.length === 0 ? (
        <p className="text-muted-foreground text-sm">No trending properties yet.</p>
      ) : (
        <div
          className="relative overflow-hidden"
          onMouseEnter={() => { pausedRef.current = true; }}
          onMouseLeave={() => { pausedRef.current = false; }}
        >
          <div
            ref={trackRef}
            className="flex will-change-transform"
            style={{ gap: `${GAP}px`, width: "max-content" }}
          >
            {doubled.map((d: any, i: number) => (
              <TrendingCard key={`${d.id}-${i}`} data={d} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default PropertiesSection;
