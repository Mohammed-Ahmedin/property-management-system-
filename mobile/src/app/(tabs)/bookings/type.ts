export enum EachRoomType {
  SINGLE = "SINGLE",
  DOUBLE = "DOUBLE",
  SUITE = "SUITE",
  DELUXE = "DELUXE",
}

export enum BookingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

export interface Room {
  id: string;
  name: string;
  roomId: string;
  type: EachRoomType;
  price: number;
  description: string;
  images: { url: string; name: string }[];
  availability: boolean;
  square_meters: number;
  max_occupancy: number;
  last_updated: string;
  propertyId: string;
}

export interface Booking {
  id: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  transactionRef?: string;
  paymentInfo?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  roomId: string;
  propertyId?: string;
  room: Room;
}
