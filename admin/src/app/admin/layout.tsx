"use client";

import { AdminHeader } from "@/components/admin-header";
import { AdminSidebar } from "@/components/admin-sidebar";
import LoaderState from "@/components/shared/loader-state";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import React, { ReactNode, useEffect, useState } from "react";

const ADMIN_TOKEN_KEY = "admin_session_token";

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const { data, isPending } = authClient.useSession();
  const router = useRouter();
  const userData = data?.user;
  const [grace, setGrace] = useState(true);
  const [hasLocalToken, setHasLocalToken] = useState(false);

  useEffect(() => {
    // Check localStorage token immediately — if present, stay on page while session loads
    const token = typeof window !== "undefined" ? localStorage.getItem(ADMIN_TOKEN_KEY) : null;
    setHasLocalToken(!!token);
    const t = setTimeout(() => setGrace(false), 3000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (isPending || grace) return;
    if (!userData && !hasLocalToken) {
      router.replace("/auth");
      return;
    }
    if (userData && (userData as any).role === "GUEST") {
      router.replace("/auth");
    }
  }, [isPending, userData, grace, hasLocalToken]);

  // Show loader while session is loading or during grace period
  if (isPending || grace) {
    return <LoaderState />;
  }

  // If no session and no local token, redirect (handled above)
  if (!userData && !hasLocalToken) {
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
