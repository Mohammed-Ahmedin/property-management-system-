"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, ChevronLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ModeToggle } from "../ui/mode-toggle";

const data = [
  {
    title: "Dashboard",
    path: "/admin/dashboard",
    description: "Overview of the admin panel and key metrics",
    backButton: false,
  },
  {
    title: "Properties",
    path: "/admin/properties",
    description: "Manage all properties registered in the system",
    backButton: false,
  },
  {
    title: "Create Property",
    path: "/admin/properties/create",
    description: "Add a new property to the system",
    backButton: true,
  },
  {
    title: "Rooms",
    path: "/admin/rooms",
    description: "Manage rooms available in each property",
    backButton: false,
  },
  {
    title: "Create Room",
    path: "/admin/rooms/create",
    description: "Add a new room to a property",
    backButton: true,
  },
  {
    title: "Bookings",
    path: "/admin/bookings",
    description: "View and manage all bookings",
    backButton: false,
  },
  {
    title: "Manual Bookings",
    path: "/admin/bookings/manual-booking",
    description: "Book manually",
    backButton: true,
  },
  {
    title: "Users",
    path: "/admin/users",
    description: "Manage system users and their roles",
    backButton: false
  },
  {
    title: "Clients",
    path: "/admin/clients",
    description: "View and contact your clients",
    backButton: false,
  },
  {
    title: "Registrations",
    path: "/admin/registration-requests",
    description: "Approve or reject new registration requests",
    backButton: false,
  },
  {
    title: "Activities",
    path: "/admin/activities",
    description: "Track recent user activities in the system",
    backButton: false,
  },
  {
    title: "Commissions",
    path: "/admin/income",
    description: "View platform and broker commission settings",
    backButton: false,
  },
  {
    title: "Payments",
    path: "/admin/payments",
    description: "View and manage payments made by users",
    backButton: false,
  },
  {
    title: "Sub Accounts",
    path: "/admin/subaccounts",
    description: "Manage sub-accounts linked to main accounts",
    backButton: false,
  },
  {
    title: "Settings",
    path: "/admin/settings",
    description: "System-wide configuration and settings",
    backButton: false,
  },
];

export function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();

  const currentItem = data.find((item) => pathname.startsWith(item.path)) || {
    title: "Admin Panel",
    description: "",
    backButton: false
  };

  const [headerItem, setHeaderItem] = useState(currentItem);

  useEffect(() => {
    const current = data.find((item) => pathname.startsWith(item.path)) || {
      title: "Admin Panel",
      description: "",
      backButton: false
    };
    setHeaderItem(current);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 w-full bg-background/70 backdrop-blur-lg border-b border-border shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 lg:px-6">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="ml-[-4px]" />
          <Separator orientation="vertical" className="h-6" />
          <div className="flex items-center gap-2">
            {headerItem.backButton && (
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1"
                onClick={() => router.back()}
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>
            )}
            <div>
              <h1 className="text-lg font-semibold">{headerItem.title}</h1>
              {headerItem.description && (
                <p className="text-sm text-muted-foreground">
                  {headerItem.description}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
