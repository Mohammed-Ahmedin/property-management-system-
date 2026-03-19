export enum UserRoleType {
  GUEST = "GUEST",
  OWNER = "OWNER",
  STAFF = "STAFF",
  ADMIN = "ADMIN",
  BROKER = "BROKER",
}

// Type-safe definitions for the room creation form
export enum RoomType {
  SINGLE = "SINGLE",
  DOUBLE = "DOUBLE",
  SUITE = "SUITE",
  DELUXE = "DELUXE",
  FAMILY = "FAMILY",
}

export interface RoomFeature {
  category?: string;
  name: string;
  value?: string;
}

export interface RoomImage {
  url: string;
  name?: string;
}

export interface RoomService {
  name: string;
  description?: string;
  price?: number;
  isActive?: boolean;
}

export interface CreateRoomFormData {
  name: string;
  roomId: string;
  type?: RoomType;
  price: number;
  description: string;
  availability?: boolean;
  squareMeters: number;
  maxOccupancy: number;
  propertyId: string;
  features?: RoomFeature[];
  images?: RoomImage[];
  services?: RoomService[];
}

export interface Room {
  id: string;
  roomId: string;
  name: string;
  type: string;
  price: number;
  description: string;
  availability: boolean;
  squareMeters: number;
  maxOccupancy: number;
  images: Array<{
    url: string;
    name: string;
  }>;
  features: Array<{
    category: string;
    name: string;
    value: string;
  }>;
}


