import { FilterSidebar } from "@/components/shared/filter/filter-sidebar";
import { PaginationControls } from "@/components/shared/pagination";
import { PropertyCard } from "@/components/shared/property-card";
import type { PropertyDataResponse } from "@/hooks/api/use-properties";
import { useSearchParams } from "react-router-dom";
interface Props {
  data: PropertyDataResponse[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    limit: number;
    hasMore: boolean;
    previousPage: number | null;
    nextPage: number | null;
  };
}
const DataContainer = ({ data, pagination }: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Handle page change
  const handlePageChange = (newPage: number) => {
    // Update the URL with the new page number
    setSearchParams({ page: newPage.toString() });
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (value: number) => {
    setSearchParams({ limit: value.toString() });
  };

  return (
    <div className="flex gap-10">
      <FilterSidebar />

      <div className="flex-1">
        <div className="pb-6 pt-2 ">
          <p className="text-sm ">{data.length} properties found</p>
        </div>
        <div className="grid  grid-cols-1  gap-3">
          {data.map((d, idx) => (
            <PropertyCard data={d} key={d.id + idx} />
          ))}
        </div>

        <PaginationControls
          onLimitChange={handleRowsPerPageChange}
          onPageChange={handlePageChange}
          pagination={pagination}
          className="py-10 mt-16"
          showLimitSelector
        />
      </div>
    </div>
  );
};

export default DataContainer;
