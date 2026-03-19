"use client";

import React from "react";
import { UsersListContainer } from "./users-list";
import { useGetUsersForManagement } from "@/hooks/api/use-users";
import LoaderState from "@/components/shared/loader-state";
import UserStatsCards from "./stats-cards";

const Page = () => {
  const { data, isFetching, error } = useGetUsersForManagement();

  if (isFetching) {
    return <LoaderState />;
  }

  if (error) {
    return (
      <div className="py-100 grid place-content-center">
        <p>Something went wrong</p>
      </div>
    );
  }
  return (
    <div>
      <UserStatsCards/>
      <UsersListContainer users={data?.data} />
    </div>
  );
};

export default Page;
