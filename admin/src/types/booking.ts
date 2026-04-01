export enum BookingStatus {
  PENDING = "PENDING",
  PENDING_OWNER_APPROVAL = "PENDING_OWNER_APPROVAL",
  PENDING_OWNER_REJECTION = "PENDING_OWNER_REJECTION",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  CANCELLED = "CANCELLED",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
  REFUNDED = "REFUNDED",
}

export enum PaymentMethod {
  ONLINE = "ONLINE",
  CASH = "CASH",
}

export interface User {
  id: string
  name: string
  email: string
  phone?: string
}

export interface Room {
  id: string
  name: string
  roomNumber: string
  type: string
  capacity: number
}

export interface Property {
  id: string
  name: string
  address: string
  city: string
}

export interface Payment {
  id: string
  bookingId: string
  status: PaymentStatus
  transactionRef?: string
  transactionId?: string
  phoneNumber?: string
  amount?: number
  method: PaymentMethod
  createdAt: Date
  updatedAt: Date
}

export interface Activity {
  id: string
  bookingId: string
  type: string
  description: string
  performedBy?: User
  createdAt: Date
}

export interface AdditionalService {
  id: string
  name: string
  price: number
  quantity: number
}

export interface Booking {
  id: string
  checkIn: Date
  checkOut: Date
  guests: number
  status: BookingStatus
  manualBooked: boolean
  user?: User
  userId?: string
  guestName?: string
  guestPhone?: string
  guestEmail?: string
  approvedBy?: User
  approvedById?: string
  room: Room
  roomId: string
  property: Property
  propertyId: string
  activities: Activity[]
  totalAmount: number
  basePrice: number
  taxAmount: number
  discount: number
  currency: string
  payment?: Payment
  createdAt: Date
  updatedAt: Date
  additionalServices: AdditionalService[]
}
