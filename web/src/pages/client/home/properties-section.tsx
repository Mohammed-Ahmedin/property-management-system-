import { useGetTrendingProperties } from "@/hooks/api/use-properties";
import SectionHeader from "./_components/section-header";
import { Skeleton } from "@/components/ui/skeleton";
import { PropertyCard } from "@/components/shared/property-card";

const CARD_W = 300;
const GAP = 16;
const ITEM_W = CARD_W + GAP; // 316px per item

const PropertiesSection = () => {
  const dataQuery = useGetTrendingProperties();
  const properties: any[] = dataQuery.data?.data || [];

  const totalShift = properties.length * ITEM_W;
  const duration = Math.max(properties.length * 5, 15); // seconds

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
        <>
          <style>{`
            @keyframes marquee-props {
              0%   { transform: translateX(0px); }
              100% { transform: translateX(-${totalShift}px); }
            }
            .marquee-props { animation: marquee-props ${duration}s linear infinite; }
            .marquee-props-wrap:hover .marquee-props { animation-play-state: paused; }
          `}</style>

          <div
            className="marquee-props-wrap relative overflow-hidden"
            style={{ maskImage: "linear-gradient(to right, transparent, black 4%, black 96%, transparent)" }}
          >
            <div className="marquee-props flex" style={{ gap: `${GAP}px`, width: "max-content" }}>
              {[...properties, ...properties].map((d: any, i: number) => (
                <div key={`${d.id}-${i}`} className="shrink-0" style={{ width: `${CARD_W}px` }}>
                  <PropertyCard data={d} view="vertical" />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default PropertiesSection;
