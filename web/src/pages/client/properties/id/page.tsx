import { ErrorState } from "@/components/shared/error-state";
import LoaderState from "@/components/shared/loader-state";
import { useGetSingleProperty } from "@/hooks/api/use-properties";
import { useParams } from "react-router-dom";
import DataContainer from "./data-container";

const SingleProperty = () => {
  const { id } = useParams();
  const dataQuery = useGetSingleProperty({ propertyId: id! });

  const renderData = () => {
    if (dataQuery.isLoading) {
      return (
        <div className="">
          <LoaderState />
        </div>
      );
    }

    if (dataQuery.isError || !dataQuery.data?.success || !dataQuery.data.data) {
      return (
        <div>
          <ErrorState
            title="Somthing went wrong please try again"
            refetch={dataQuery.refetch}
          />
        </div>
      );
    }

    return <DataContainer data={dataQuery.data} />;
  };

  return <div className="px-4 md:px-24 lg:px-40 pt-4 md:pt-8">{renderData()}</div>;
};

export default SingleProperty;
