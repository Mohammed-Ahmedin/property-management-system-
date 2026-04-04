"use client";

import { AdminHeader } from "@/components/admin-header";
import { AdminSidebar } from "@/components/admin-sidebar";
import LoaderState from "@/components/shared/loader-state";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import React, { ReactNode, useEffect, useState } from "react";

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const { data, isPending } = authClient.useSession();
  const router = useRouter();
  const userData = data?.user;
  // Give the session a grace period before redirecting
  const [grace, setGrace] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setGrace(false), 2000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (isPending || grace) return;
    if (!userData) {
      router.replace("/auth");
      return;
    }
    if ((userData as any).role === "GUEST") {
      router.replace("/auth");
    }
  }, [isPending, userData, grace]);

  // Show loader while pending or during grace period
  if (isPending || grace || (!isPending && !userData)) {
    return <LoaderState />;
  }

  return (
    <SidebarProvider>
      <AdminSidebar userData={userData as any} />
      <SidebarInset className="rounded-xl overflow-hidden min-w-0">
        <AdminHeader />
        <div className="flex flex-1 flex-col overflow-x-hidden">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminLayout;
