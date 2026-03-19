// ---------------- Room Types ----------------
export type RoomType =
  | "SINGLE"
  | "DOUBLE"
  | "TWIN"
  | "DELUXE"
  | "SUITE"
  | "FAMILY"
  | "STUDIO"
  | "EXECUTIVE"
  | "PRESIDENTIAL";

// ---------------- Main Room Interface ----------------
export interface Room {
  id: string;
  roomId: string;
  name: string;
  type: RoomType;
  price: number;
  description?: string;
  availability: boolean;
  squareMeters: number;
  maxOccupancy: number;

  propertyId: string;

  occupiedById?: string;

  images?: RoomImage[];
  features?: RoomFeature[];
  services?: AdditionalService[];

  createdAt: string;
  updatedAt: string;
}

// ---------------- RoomImage Interface ----------------
export interface RoomImage {
  id: string;
  url: string;
  name?: string;
  createdAt: string;
  updatedAt: string;
}

// ---------------- RoomFeature Interface ----------------
export interface RoomFeature {
  id: string;
  category?: string; // e.g., "kitchen", "bathroom"
  name: string; // e.g., "tv", "wifi"
  value?: string; // e.g., "true", "2 queen beds"
  createdAt: string;
  updatedAt: string;
}

// ---------------- AdditionalService Interface ----------------
export interface AdditionalService {
  id: string;
  name: string; // e.g., "Breakfast", "Laundry"
  description?: string;
  price?: number; // null = free
  isActive: boolean;

  createdAt: string;
  updatedAt: string;
}
