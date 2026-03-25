"use client";

import { AdminHeader } from "@/components/admin-header";
import { AdminSidebar } from "@/components/admin-sidebar";
import LoaderState from "@/components/shared/loader-state";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import React, { ReactNode, useEffect } from "react";

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const { data, isPending } = authClient.useSession();
  const router = useRouter();
  const userData = data?.user;

  useEffect(() => {
    if (isPending) return;
    if (!userData) {
      router.replace("/auth");
      return;
    }
    if ((userData as any).role === "GUEST") {
      router.replace("/auth");
    }
  }, [isPending, userData]);

  // Show loader while session is being fetched
  if (isPending || (!isPending && !userData)) {
    return <LoaderState />;
  }

  return (
    <SidebarProvider>
      <AdminSidebar userData={userData as any} />
      <SidebarInset className="rounded-xl overflow">
        <AdminHeader />
        <div className="flex flex-1 flex-col">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminLayout;
