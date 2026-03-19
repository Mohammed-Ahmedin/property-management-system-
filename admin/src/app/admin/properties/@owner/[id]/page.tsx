"use client";

import React from "react";
import PropertyView from "./view";
import { useGetPropertyDetailQuery } from "@/hooks/api/use-property";
import { useParams } from "next/navigation";
import LoaderState from "@/components/shared/loader-state";

const Page = () => {
  const { id }: any = useParams();
  const { data, isError, isFetching } =
    useGetPropertyDetailQuery({
      id: id,
    });

  if (isFetching) {
    return <LoaderState />;
  }

  if (isError) {
    return (
      <div className="w-[100%] h-[400px] grid place-content-center">
        <h2>Some error occured please try again</h2>
      </div>
    );
  }

  return <PropertyView data={data} />;
};

export default Page;
