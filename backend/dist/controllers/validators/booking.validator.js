"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.manualBookingSchema = exports.bookingSchema = exports.additionalServiceSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.additionalServiceSchema = zod_1.default.object({
    id: zod_1.default.string().uuid("Invalid service ID"),
});
exports.bookingSchema = zod_1.default
    .object({
    checkIn: zod_1.default.coerce.date({
        error: "Check-in date is required",
    }),
    checkOut: zod_1.default.coerce.date({
        error: "Check-out date is required",
    }),
    guests: zod_1.default
        .number({
        error: "Guests count is required",
    })
        .int()
        .positive("Guests must be at least 1")
        .max(10, "Too many guests for one booking"),
    userId: zod_1.default.string().uuid("Invalid user ID"),
    roomId: zod_1.default.string().uuid("Invalid room ID"),
    discount: zod_1.default.coerce
        .number()
        .min(0, "Discount cannot be negative")
        .default(0),
    totalAmount: zod_1.default.coerce.number().positive("Total amount must be positive"),
    additionalServices: zod_1.default.array(exports.additionalServiceSchema).optional().default([]),
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
exports.manualBookingSchema = zod_1.default.object({
    roomId: zod_1.default.string().uuid(),
    propertyId: zod_1.default.string().uuid().optional(),
    guestName: zod_1.default.string().min(2, "Guest name is required"),
    guestPhone: zod_1.default.string().min(6, "Phone number is required"),
    guestEmail: zod_1.default.string().email("Invalid email").optional(),
    checkIn: zod_1.default
        .string()
        .refine((val) => !isNaN(Date.parse(val)), "Invalid check-in date"),
    checkOut: zod_1.default
        .string()
        .refine((val) => !isNaN(Date.parse(val)), "Invalid check-out date"),
    guests: zod_1.default.number().int().positive(),
    totalAmount: zod_1.default.number().positive(),
    basePrice: zod_1.default.number().positive(),
    taxAmount: zod_1.default.number().nonnegative(),
    discount: zod_1.default.number().nonnegative().optional(),
    currency: zod_1.default.string().default("USD"),
    paymentMethod: zod_1.default.enum(["CASH", "ONLINE"]).default("CASH"),
});
