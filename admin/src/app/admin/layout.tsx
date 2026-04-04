"use client";

import { AdminHeader } from "@/components/admin-header";
import { AdminSidebar } from "@/components/admin-sidebar";
import LoaderState from "@/components/shared/loader-state";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import React, { ReactNode, useEffect, useState } from "react";

const ADMIN_TOKEN_KEY = "admin_session_token";
const ADMIN_USER_KEY = "admin_session_user";

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const { data, isPending } = authClient.useSession();
  const router = useRouter();
  const [grace, setGrace] = useState(true);
  const [localUser, setLocalUser] = useState<any>(null);

  useEffect(() => {
    // Restore user from localStorage immediately on mount
    try {
      const raw = localStorage.getItem(ADMIN_USER_KEY);
      if (raw) setLocalUser(JSON.parse(raw));
    } catch {}
    const t = setTimeout(() => setGrace(false), 3000);
    return () => clearTimeout(t);
  }, []);

  // Prefer live session user, fall back to stored user
  const userData = data?.user ?? localUser;

  // Keep localStorage in sync when live session loads
  useEffect(() => {
    if (data?.user) {
      localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(data.user));
      const token = (data as any)?.session?.token;
      if (token) localStorage.setItem(ADMIN_TOKEN_KEY, token);
    }
  }, [data?.user]);

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

  if (isPending || grace) return <LoaderState />;
  if (!userData) return <LoaderState />;

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
