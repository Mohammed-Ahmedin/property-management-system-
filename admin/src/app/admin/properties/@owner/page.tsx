"use client";

import { PropertyList } from "./property-list";
import { useGetPropertiesForManagmentQuery } from "@/hooks/api/use-property";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuthSession } from "@/hooks/use-auth-session";
import PropertyStats from "../stats";

export default function PropertiesPage() {
  const router = useRouter();
  const { data, isLoading, isFetching, isError } =
    useGetPropertiesForManagmentQuery();
  const { role: userRole, isPending: userDataIsPending } = useAuthSession();

  // Show button logic:
  // ADMIN: always true
  // OWNER: only if they have no properties
  const showAddButton =
    userRole === "ADMIN" ||
    (userRole === "OWNER" && (!data || data.length === 0));

  return (
    <div className="min-h-screen bg-background">
      <div className="py-8 px-4">
        <PropertyStats />

        {!isLoading && !userDataIsPending && (
          <header className="pb-3 flex justify-end">
            {showAddButton && (
              <Button onClick={() => router.push("/admin/properties/create")}>
                Add Property
              </Button>
            )}
          </header>
        )}

        {/* List */}
        <PropertyList
          data={data}
          isLoading={isLoading || isFetching}
          error={isError}
        />
      </div>
    </div>
  );
}
