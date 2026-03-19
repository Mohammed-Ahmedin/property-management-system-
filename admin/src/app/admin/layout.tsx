"use client";

import { AdminHeader } from "@/components/admin-header";
import { AdminSidebar } from "@/components/admin-sidebar";
import LoaderState from "@/components/shared/loader-state";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import React, { ReactNode, Suspense } from "react";

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const { data, isPending } = authClient.useSession();

  const userData = data?.user;

  if (isPending) {
    return <LoaderState />;
  }

  if (!isPending && !userData) {
    redirect("/auth");
  }

  if (!isPending && userData && userData.role === "GUEST") {
    redirect("/auth");
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
