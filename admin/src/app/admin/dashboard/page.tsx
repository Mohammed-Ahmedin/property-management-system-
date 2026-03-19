"use client";
import LoaderState from "@/components/shared/loader-state";
import { authClient } from "@/lib/auth-client";
import OwnerView from "./owner-view";
import AdminView from "./admin-view";
import StaffView from "./staff-view";
import BrokerView from "./broker-view";

const Layout = () => {
  const { data, isPending } = authClient.useSession();

  if (isPending) {
    return <LoaderState />;
  }

  const currentUserRole: any = (data?.user as any)?.role;

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
