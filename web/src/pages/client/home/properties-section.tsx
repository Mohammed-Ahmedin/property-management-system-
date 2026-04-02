import { useGetTrendingProperties } from "@/hooks/api/use-properties";
import SectionHeader from "./_components/section-header";
import { Skeleton } from "@/components/ui/skeleton";
import { PropertyCard } from "@/components/shared/property-card";
import { useEffect, useRef } from "react";

const CARD_W = 300;
const GAP = 16;
const ITEM_W = CARD_W + GAP;

const PropertiesSection = () => {
  const dataQuery = useGetTrendingProperties();
  const properties: any[] = dataQuery.data?.data || [];
  // Repeat enough times to fill viewport (1200px) + one extra set for seamless loop
  const minCopies = properties.length > 0 ? Math.ceil(2400 / (properties.length * ITEM_W)) + 1 : 0;
  const repeated = properties.length > 0
    ? Array.from({ length: Math.max(minCopies, 3) }, () => properties).flat()
    : [];
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
        if (posRef.current >= oneSetWidth) {
          posRef.current -= oneSetWidth;
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
          style={{ maskImage: "linear-gradient(to right, transparent, black 3%, black 97%, transparent)" }}
          onMouseEnter={() => { pausedRef.current = true; }}
          onMouseLeave={() => { pausedRef.current = false; }}
        >
          <div
            ref={trackRef}
            className="flex will-change-transform"
            style={{ gap: `${GAP}px`, width: "max-content" }}
          >
            {repeated.map((d: any, i: number) => (
              <div key={`${d.id}-${i}`} className="shrink-0" style={{ width: `${CARD_W}px` }}>
                <PropertyCard data={d} view="vertical" />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default PropertiesSection;
