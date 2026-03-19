import { useGetTrendingProperties } from "@/hooks/api/use-properties";
import SectionHeader from "./_components/section-header";
import { Skeleton } from "@/components/ui/skeleton";
import { PropertyCard } from "@/components/shared/property-card";

const PropertiesSection = () => {
  const dataQuery = useGetTrendingProperties();
  return (
    <section className="c-px">
      <SectionHeader title="Trending Properties" />

      {dataQuery.isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          <Skeleton className="w-full h-[300px] rounded-" />
          <Skeleton className="w-full h-[300px] rounded-" />
          <Skeleton className="w-full h-[300px] rounded-lg" />
        </div>
      ) : dataQuery.isError ? (
        ""
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {dataQuery.data?.data &&
              dataQuery.data?.data.map((d: any) => {
                return <PropertyCard data={d} key={d.id} view="vertical" />;
              })}
          </div>
        </>
      )}
    </section>
  );
};

export default PropertiesSection;
