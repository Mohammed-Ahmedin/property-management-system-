import { Grid2X2, Home, Store, User, MapPin, Calendar } from "lucide-react";

export const clientNavLinks = [];

// Links for main navigation bar (desktop/large screens)
export const mainNavLinks = [
  {
    id: 1,
    href: "/",
    icon: <Home className="w-5 xs:w-6" strokeWidth={1.25} />,
    label: "Home",
  },
  {
    id: 2,
    href: "/properties",
    icon: <Grid2X2 className="w-5 xs:w-6" strokeWidth={1.25} />,
    label: "Properties",
  },
  {
    id: 3,
    href: "/nearby",
    icon: <MapPin className="w-5 xs:w-6" strokeWidth={1.25} />,
    label: "Nearby",
  },
  {
    id: 4,
    href: "/about",
    icon: <Calendar className="w-5 xs:w-6" strokeWidth={1.25} />,
    label: "About",
  },
  {
    id: 5,
    href: "/register",
    icon: <Calendar className="w-5 xs:w-6" strokeWidth={1.25} />,
    label: "Register",
  },
];

// Links for mobile tab bar
export const mobileNavLinks = [
  {
    id: 1,
    href: "/",
    icon: <Home className="w-5 xs:w-6" strokeWidth={1.25} />,
    label: "Home",
  },
  {
    id: 2,
    href: "/properties",
    icon: <Grid2X2 className="w-5 xs:w-6" strokeWidth={1.25} />,
    label: "Properties",
  },
  {
    id: 3,
    href: "/nearby",
    icon: <MapPin className="w-5 xs:w-6" strokeWidth={1.25} />,
    label: "Nearby",
  },
  {
    id: 4,
    href: "/account/bookings",
    icon: <Calendar className="w-5 xs:w-6" strokeWidth={1.25} />,
    label: "Bookings",
  },
  {
    id: 5,
    href: "/account",
    icon: <User className="w-5 xs:w-6" strokeWidth={1.25} />,
    label: "Account",
  },
];
