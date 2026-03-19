import React from "react";
import { Spinner } from "../ui/spinner";

const LoaderState = () => {
  return (
    <div className="h-[60dvh] grid place-content-center">
      <Spinner className="size-10" />
    </div>
  );
};

export default LoaderState;
