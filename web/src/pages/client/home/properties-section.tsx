import { useGetTrendingProperties } from "@/hooks/api/use-properties";
import SectionHeader from "./_components/section-header";
import { Skeleton } from "@/components/ui/skeleton";
import { PropertyCard } from "@/components/shared/property-card";

const PropertiesSection = () => {
  const dataQuery = useGetTrendingProperties();
  const properties: any[] = dataQuery.data?.data || [];
  // Duplicate for seamless loop
  const doubled = properties.length > 0 ? [...properties, ...properties] : [];

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
          className="relative overflow-hidden group"
          style={{ maskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)" }}
        >
          <div
            className="flex gap-4 w-max"
            style={{
              animation: `scroll-x ${properties.length * 6}s linear infinite`,
            }}
          >
            {doubled.map((d: any, i: number) => (
              <div key={`${d.id}-${i}`} className="shrink-0 w-[300px]">
                <PropertyCard data={d} view="vertical" />
              </div>
            ))}
          </div>

          <style>{`
            @keyframes scroll-x {
              0% { transform: translateX(0); }
              100% { transform: translateX(-${properties.length * 316}px); }
            }
            .group:hover > div {
              animation-play-state: paused;
            }
          `}</style>
        </div>
      )}
    </section>
  );
};

export default PropertiesSection;
