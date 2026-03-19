"use server";

import { NextRequest, NextResponse } from "next/server";
import { authClient } from "./lib/auth-client";
import { headers } from "next/headers";

// 🔹 Role-based allowed URLs with subpath info
const roleAllowedRoutes: Record<
  string,
  Array<{ path: string; allowSubpaths?: boolean }>
> = {
  ADMIN: [
    { path: "/admin/dashboard" },
    { path: "/admin/properties", allowSubpaths: true }, // dynamic pages allowed
    { path: "/admin/rooms", allowSubpaths: true },
    { path: "/admin/bookings", allowSubpaths: true },
    { path: "/admin/users", allowSubpaths: true },
    { path: "/admin/registration-requests" },
    { path: "/admin/activities" },
    { path: "/admin/income" },
    { path: "/admin/payments" },
    { path: "/admin/subaccounts" },
  ],
  OWNER: [
    { path: "/admin/dashboard" },
    { path: "/admin/properties", allowSubpaths: true },
    { path: "/admin/bookings", allowSubpaths: true },
    { path: "/admin/rooms", allowSubpaths: true },
    { path: "/admin/staffs", allowSubpaths: true },
    { path: "/admin/activities" },
    { path: "/admin/payments" },
  ],
  STAFF: [
    { path: "/admin/dashboard" },
    { path: "/admin/properties", allowSubpaths: false }, // only exact
    { path: "/admin/rooms", allowSubpaths: true }, // allow staff to open /rooms/[id]
    { path: "/admin/bookings", allowSubpaths: false },
  ],
  BROKER: [
    { path: "/admin/dashboard" },
    { path: "/admin/clients", allowSubpaths: true },
    { path: "/admin/bookings", allowSubpaths: false },
  ],
};

// 🔹 Flatten all protected paths for unauthenticated users
const allProtectedPaths = Array.from(
  new Set(
    Object.values(roleAllowedRoutes)
      .flat()
      .map((r) => r.path)
  )
);

// 🔐 Middleware logic
export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();

  const { data } = await authClient.getSession({
    fetchOptions: { headers: await headers() },
  });

  const isAuthenticated = !!data?.user.email;
  const role = (data?.user as any)?.role;

  // ❌ Redirect unauthenticated users trying to access protected URLs
  if (
    !isAuthenticated &&
    allProtectedPaths.some((p) => url.pathname.startsWith(p))
  ) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // 🔐 Redirect authenticated users from auth pages
  if (isAuthenticated && url.pathname.startsWith("/auth")) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // 🧾 Role-based access
  if (isAuthenticated && role) {
    const allowedRoutes = roleAllowedRoutes[role] || [];
    const isAllowed = allowedRoutes.some((route) => {
      if (route.allowSubpaths) {
        return (
          url.pathname === route.path ||
          url.pathname.startsWith(route.path + "/")
        );
      }
      return url.pathname === route.path;
    });

    if (!isAllowed) {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/auth/:path*", "/admin/:path*"],
};
