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
      <div className="py-20 flex flex-col items-center gap-4">
        <p className="text-muted-foreground">Failed to load users. Please try again.</p>
        <button onClick={() => window.location.reload()} className="text-primary underline text-sm">Retry</button>
      </div>
    );
  }
  return (
    <div>
      <UserStatsCards/>
      <UsersListContainer users={data?.data ?? []} />
    </div>
  );
};

export default Page;
