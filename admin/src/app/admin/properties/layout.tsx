import { UserRoleType } from "@/types";
import React from "react";
import { ReactNode } from "react";

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
  const currentUserRole: UserRoleType = UserRoleType.OWNER;

  if (currentUserRole === UserRoleType.OWNER) return owner;
  if (currentUserRole === UserRoleType.ADMIN) return owner;
  if (currentUserRole === UserRoleType.STAFF) return owner;
  if (currentUserRole === UserRoleType.BROKER) return owner;
};
export default Layout;
