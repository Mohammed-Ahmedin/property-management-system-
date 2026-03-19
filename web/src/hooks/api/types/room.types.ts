export interface Room {
  images: {
    name: string | null;
    id: string;
    roomId: string;
    createdAt: Date;
    updatedAt: Date;
    url: string;
  }[];
  features: {
    name: string;
    id: string;
    roomId: string;
    createdAt: Date;
    updatedAt: Date;
    category: string | null;
    value: string | null;
  }[];

  name: string;
  id: string;
  description: string | null;
  roomId: string;
  propertyId: string;
  createdAt: Date;
  updatedAt: Date;
  type: string;
  price: number;
  availability: boolean;
  squareMeters: number;
  maxOccupancy: number;
  occupiedById: string | null;

  services: {
    name: string;
    id: string;
    description: string;
    roomId: string;
    createdAt: Date;
    updatedAt: Date;
    price: number;
    isActive: boolean;
  }[];
}

export interface RoomResponse {
  data: Room;
  success: true;
}
