"use client";

import { type ReactNode } from "react";
import { useLocation, useParams } from "react-router-dom";

interface IProps {
  children: ReactNode;
  blackListPathNames?: string[];
}

const ClientFooterProvider = ({ children, blackListPathNames }: IProps) => {
  const location = useLocation();
  if (blackListPathNames?.includes(location.pathname)) {
    return <div className="h-16" />;
  }

  return children;
};

export default ClientFooterProvider;
