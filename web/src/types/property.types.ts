import type { Category } from "./category.types";
import type { Room } from "./room.types";

// ---------------- Property Types ----------------
export type PropertyType = "SHARED" | "PRIVATE" | "ENTIRE";
export type PropertyStatus = "PENDING" | "APPROVED" | "REJECTED";

// ---------------- Main Property Interface ----------------
export interface Property {
  id: string;
  name: string;
  address: string;
  type: PropertyType;
  visibility: boolean;

  images?: PropertyImage[];
  about?: About;
  location?: Location;
  facilities?: Facility[];
  contact?: Contact;
  rooms?: Room[];
  history?: History[];
  reviews?: Review[];

  status: PropertyStatus;

  category?: Category;
  categoryId?: string;

  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

// ---------------- Related Interfaces ----------------
export interface PropertyImage {
  id: string;
  url: string;
  name: string;
}

export interface About {
  id: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  content: string;
  rating?: number;
  reviewerName?: string;
  userId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Location {
  id: string;
  continent: string;
  country: string;
  city: string;
  subcity: string;
  nearby?: string;
  longitude: string;
  latitude?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Facility {
  id: string;
  name: string;
  icon?: string;
}

export interface Contact {
  id: string;
  phone: string;
  email: string;
}

// ---------------- Placeholder Interfaces ----------------
// You can expand these based on your actual Prisma models

export interface PropertyFilters {
  city?: string;
  subcity?: string;
  country?: string;
  categoryId?: string;
  type?: string; // SHARED or PRIVATE
  minRating?: number;
  maxRating?: number;
  minPrice?: number;
  maxPrice?: number;
  facilityNames?: string[]; // e.g. ["Free Wi-Fi", "Breakfast included"]
  hasRoomsAvailable?: boolean;
  search?: string; // keyword search by name or address
  location?: string;
}

export const FACILITY_OPTIONS = [
  "Free Wi-Fi",
  "Breakfast included",
  "Air conditioning",
  "Parking available",
  "Kitchen access",
  "Laundry service",
  "Pet friendly",
  "Wheelchair accessible",
];

export const PROPERTY_TYPES = [
  { value: "SHARED", label: "Shared" },
  { value: "PRIVATE", label: "Private" },
];
