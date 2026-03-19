export interface GuestDetailHouseResponse {
  data: Property;
  success: boolean;
}

export interface Property {
  id: string;
  name: string;
  address: string;
  type: "SHARED" | "SINGLE" | "DOUBLE"; // can extend based on your backend enum
  visibility: boolean;
  licenseId: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED"; // extend based on backend
  categoryId: string | null;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  about: About;
  images: Image[];
  reviews: any[];
  location: Location;
  contact: Contact;
  facilities: Facility[];
  rooms: Room[];
}

export interface About {
  id: string;
  description: string;
  propertyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Image {
  id: string;
  url: string;
  name: string;
  propertyId?: string;
  roomId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Location {
  id: string;
  continent: string;
  country: string;
  city: string;
  subcity: string;
  nearby: string;
  propertyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Contact {
  id: string;
  phone: string;
  email: string;
  propertyId: string;
}

export interface Facility {
  id: string;
  name: string;
  propertyId: string;
  icon: string | null;
}

export interface Feature {
  id: string;
  category: string;
  name: string;
  value: string;
}

export interface Room {
  id: string;
  roomId: string;
  name: string;
  type: "SINGLE" | "DOUBLE"; // extend based on backend
  price: number;
  description: string;
  availability: boolean;
  squareMeters: number;
  maxOccupancy: number;
  propertyId: string;
  occupiedById: string | null;
  createdAt: string;
  updatedAt: string;
  images: Image[];
  features: Feature[];
}
