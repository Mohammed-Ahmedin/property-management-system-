import z from "zod";

export const additionalServiceSchema = z.object({
  id: z.string().uuid("Invalid service ID"),
});

export const bookingSchema = z
  .object({
    checkIn: z.coerce.date({
      error: "Check-in date is required",
    }),
    checkOut: z.coerce.date({
      error: "Check-out date is required",
    }),
    guests: z
      .number({
        error: "Guests count is required",
      })
      .int()
      .positive("Guests must be at least 1")
      .max(10, "Too many guests for one booking"),
    userId: z.string().uuid("Invalid user ID"),
    roomId: z.string().uuid("Invalid room ID"),
    discount: z.coerce
      .number()
      .min(0, "Discount cannot be negative")
      .default(0),
    totalAmount: z.coerce.number().positive("Total amount must be positive"),
    additionalServices: z.array(additionalServiceSchema).optional().default([]),
  })
  .superRefine((data, ctx) => {
    if (data.checkOut <= data.checkIn) {
      ctx.addIssue({
        path: ["checkOut"],
        message: "Check-out date must be after check-in date",
        code: "custom",
      });
    }

    if (data.discount > data.totalAmount) {
      ctx.addIssue({
        path: ["discount"],
        message: "Discount cannot exceed total amount",
        code: "custom",
      });
    }
  });

// ✅ Validation schema
export const manualBookingSchema = z.object({
  roomId: z.string().uuid(),
  propertyId: z.string().uuid().optional(),
  guestName: z.string().min(2, "Guest name is required"),
  guestPhone: z.string().min(6, "Phone number is required"),
  guestEmail: z.string().email("Invalid email").optional(),
  checkIn: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "Invalid check-in date"),
  checkOut: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "Invalid check-out date"),
  guests: z.number().int().positive(),
  totalAmount: z.number().positive(),
  basePrice: z.number().positive(),
  taxAmount: z.number().nonnegative(),
  discount: z.number().nonnegative().optional(),
  currency: z.string().default("USD"),
  paymentMethod: z.enum(["CASH", "ONLINE"]).default("CASH"),
});
