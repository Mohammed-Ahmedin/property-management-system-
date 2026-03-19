"use client";

import { ArrowUpRightIcon, BadgeAlert, HomeIcon, Loader2 } from "lucide-react";
import { PropertyCard } from "./property-card";
import { EmptyState } from "@/components/shared/empty-state";
import LoaderState from "@/components/shared/loader-state";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuthSession } from "@/hooks/use-auth-session";

interface PropertyListProps {
  data: any;
  isLoading: boolean;
  error: any;
}

export function PropertyList({
  data,
  isLoading,
  error,
}: PropertyListProps) {
  const router = useRouter();
  const { user: userData } = useAuthSession();

  if (isLoading) {
    return <LoaderState />;
  }

  if (error) {
    return (
      <EmptyState
        icon={<BadgeAlert />}
        title="Failed to load properties"
        description="Please try again later"
      />
    );
  }

  if (data?.data?.length === 0) {
    return (
      <div className="flex justify-center items-center mt-20">
       
        <EmptyState
          icon={<HomeIcon size={40} />}
          title="No Properties Found"
          description="You haven't added any properties yet. Start by creating your first listing to welcome guests."
          primaryActions={
            <Button onClick={() => router.push("/admin/properties/create")}>
              Create Property
            </Button>
          }
          secondaryLink={{
            href: "/docs/properties",
            label: "Learn how it works",
            icon: <ArrowUpRightIcon className="ml-1 h-4 w-4" />,
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Property Cards */}
      <div className="space-y-4">
        {data?.data?.map((property: any) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
}
