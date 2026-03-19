export const clientNavLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Blogs", href: "/blogs" },
  { name: "Contact", href: "/contact" },
  { name: "Location", href: "/location" },
];

import {
  LayoutDashboard,
  Users,
  User,
  ClipboardList,
  Settings,
  Book,
  Home,
  House,
  Bed,
  Hotel,
  Calendar,
} from "lucide-react";

export const adminSidebarNavLinks = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: LayoutDashboard, // ✅ Dashboard layout icon is perfect
  },
  {
    title: "Properties",
    url: "/admin/properties",
    icon: Hotel, // ✅ Good for multiple users
  },
  {
    title: "Rooms",
    url: "/admin/rooms",
    icon: Bed, // Represents reports/documents
  },
  {
    title: "Bookings",
    url: "/admin/bookings",
    icon: Calendar, // Represents reports/documents
  },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings, // ✅ Already appropriate
  },
];

