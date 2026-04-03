"use client";

import React from "react";
import PropertyView from "../../@owner/[id]/view";
import { useGetPropertyDetailQuery } from "@/hooks/api/use-property";
import { useParams } from "next/navigation";
import LoaderState from "@/components/shared/loader-state";

const Page = () => {
  const { id }: any = useParams();
  const { data, isError, isFetching } = useGetPropertyDetailQuery({ id });

  if (isFetching) return <LoaderState />;
  if (isError) return <div className="w-full h-[400px] grid place-content-center"><h2>Something went wrong, please try again</h2></div>;

  return <PropertyView data={data} />;
};

export default Page;
