"use client";
import LoaderState from "@/components/shared/loader-state";
import { authClient } from "@/lib/auth-client";
import OwnerView from "./owner-view";
import AdminView from "./admin-view";
import StaffView from "./staff-view";
import BrokerView from "./broker-view";

const ADMIN_USER_KEY = "admin_session_user";

const Layout = () => {
  const { data, isPending } = authClient.useSession();

  // Fall back to localStorage user on mobile where cookie session fails
  const sessionUser = data?.user as any;
  const localUser = (() => {
    if (typeof window === "undefined") return null;
    try { const r = localStorage.getItem(ADMIN_USER_KEY); return r ? JSON.parse(r) : null; } catch { return null; }
  })();
  const user = sessionUser ?? localUser;

  if (isPending && !user) return <LoaderState />;

  const currentUserRole: string = user?.role ?? "";

  if (currentUserRole === "OWNER") return <OwnerView />;
  if (currentUserRole === "ADMIN") return <AdminView />;
  if (currentUserRole === "STAFF") return <StaffView />;
  if (currentUserRole === "BROKER") return <BrokerView />;

  return (
    <div className="flex flex-col gap-6 p-6">
      <p className="text-muted-foreground">Welcome to the dashboard.</p>
    </div>
  );
};
export default Layout;
