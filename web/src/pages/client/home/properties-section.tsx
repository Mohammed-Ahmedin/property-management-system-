import { useGetTrendingProperties } from "@/hooks/api/use-properties";
import SectionHeader from "./_components/section-header";
import { Skeleton } from "@/components/ui/skeleton";
import { PropertyCard } from "@/components/shared/property-card";
import { useEffect, useRef } from "react";

const CARD_WIDTH = 316; // 300px card + 16px gap

const PropertiesSection = () => {
  const dataQuery = useGetTrendingProperties();
  const trackRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const posRef = useRef(0);
  const pausedRef = useRef(false);

  const properties: any[] = dataQuery.data?.data || [];
  // Duplicate to create seamless loop: [1,2,3,4] → [1,2,3,4,1,2,3,4]
  const doubled = properties.length > 0 ? [...properties, ...properties] : [];
  const oneSetWidth = properties.length * CARD_WIDTH;

  useEffect(() => {
    if (doubled.length === 0 || oneSetWidth === 0) return;
    const speed = 0.5;

    const animate = () => {
      if (!pausedRef.current) {
        posRef.current += speed;
        // When we've scrolled one full set, jump back to start seamlessly
        if (posRef.current >= oneSetWidth) {
          posRef.current = posRef.current - oneSetWidth;
        }
        if (trackRef.current) {
          trackRef.current.style.transform = `translateX(-${posRef.current}px)`;
        }
      }
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [doubled.length, oneSetWidth]);

  return (
    <section className="c-px pb-10 overflow-hidden">
      <SectionHeader title="Trending Properties" />

      {dataQuery.isLoading ? (
        <div className="flex gap-4">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="w-[300px] h-[300px] rounded-2xl shrink-0" />)}
        </div>
      ) : dataQuery.isError || doubled.length === 0 ? (
        <p className="text-muted-foreground text-sm">No trending properties yet.</p>
      ) : (
        <div
          className="relative overflow-hidden"
          onMouseEnter={() => { pausedRef.current = true; }}
          onMouseLeave={() => { pausedRef.current = false; }}
        >
          <div ref={trackRef} className="flex gap-4 w-max will-change-transform">
            {doubled.map((d: any, i: number) => (
              <div key={`${d.id}-${i}`} className="shrink-0 w-[300px]">
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
