"use client";

import React, { ReactNode } from "react";
import { useAuthSession } from "@/hooks/use-auth-session";
import LoaderState from "@/components/shared/loader-state";

const Layout = ({
  admin,
  broker,
  owner,
  staff,
}: {
  admin: ReactNode;
  broker: ReactNode;
  owner: ReactNode;
  staff: ReactNode;
}) => {
  const { role, isPending } = useAuthSession();

  if (isPending) return <LoaderState />;

  if (role === "ADMIN") return <>{admin}</>;
  if (role === "BROKER") return <>{broker}</>;
  if (role === "STAFF") return <>{staff}</>;
  return <>{owner}</>;
};

export default Layout;
