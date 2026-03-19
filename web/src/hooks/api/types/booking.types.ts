interface Room {
  name: string;
  id: string;
  description: string;
  roomId: string;
  images: {
    name: string | null;
    id: string;
    roomId: string;
    createdAt: Date;
    updatedAt: Date;
    url: string;
  }[];
}

interface Booking {
  totalAmount: number;
  id: string;
  status: string;
  userId: string | null;
  roomId: string;
  propertyId: string;
  createdAt: Date;
  updatedAt: Date;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  manualBooked: boolean;
  guestName: string | null;
  guestPhone: string | null;
  guestEmail: string | null;
  cancelledCheckIn: Date | null;
  cancelledCheckOut: Date | null;
  approvedById: string | null;
  basePrice: number;
  taxAmount: number;
  discount: number;
  currency: string;
}

interface Property {
  name: string;
  id: string;
  images: {
    name: string;
    id: string;
    propertyId: string;
    url: string;
  }[];
  about: {
    description: true;
  };
}

interface Payment {
  id: string;
  status: string;
  bookingId: string;
  createdAt: Date;
  updatedAt: Date;
  transactionRef: string | null;
  transactionId: string | null;
  phoneNumber: string | null;
  amount: number | null;
  pendingAmount: number | null;
  method: string;
  metadata: string | null;
  chapaSubAccountId: string | null;
}

interface Service {
  name: string;
  id: string;
  description: string | null;
  roomId: string | null;
  createdAt: Date;
  updatedAt: Date;
  price: number | null;
  isActive: boolean;
}

export type BookingDetailDataResponse = {
  room: Room;
  payment: {
    id: string;
    amount: string;
    pendingAmount: number;
    method: string;
    transactionRef: string;
    phoneNumber: string;
    status: string;
  };
  property: Property;
  additionalServices: Service[];
} & Booking;

export interface BookingDetailResponse {
  data: BookingDetailDataResponse;
  success: boolean;
}

export type BookingsDataResponse = {
  room: Room;
  payment: {
    status: string;
    id: string;
    amount: string;
    pendingAmount: string;
  };
  property: Property;
  additionalServices: Service[];
} & Booking[];

export interface BookingsResponse {
  data: BookingsDataResponse;
  success: boolean;
}
