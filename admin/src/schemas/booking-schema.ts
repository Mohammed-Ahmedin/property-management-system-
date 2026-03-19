import { z } from "zod"

export const manualBookingSchema = z.object({
  roomId: z.string().uuid(),
  propertyId: z.string().uuid().optional(),
  guestName: z.string().min(2, "Guest name is required"),
  guestPhone: z.string().min(6, "Phone number is required"),
  guestEmail: z.string().email("Invalid email").optional().or(z.literal("")),
  checkIn: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid check-in date"),
  checkOut: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid check-out date"),
  guests: z.number().int().positive(),
  totalAmount: z.number().positive(),
  basePrice: z.number().positive(),
  taxAmount: z.number().nonnegative(),
  discount: z.number().nonnegative().optional(),
  currency: z.string().default("USD"),
  paymentMethod: z.enum(["CASH", "ONLINE"]).default("CASH"),
})

export type ManualBookingFormData = z.infer<typeof manualBookingSchema>
