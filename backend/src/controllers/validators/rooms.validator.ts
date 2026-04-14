import { RoomType } from "@prisma/client";
import z from "zod";

export const createRoomSchema = z.object({
  name: z.string().min(2, "Room name must be at least 2 characters"),
  roomId: z.string().min(2, "Room ID is required"),
  type: z.nativeEnum(RoomType).optional(),
  price: z.number().int().min(0).optional().default(0),
  description: z.string().optional().default(""),
  availability: z.boolean().optional(),
  squareMeters: z.number().int().min(0).optional().default(0),
  maxOccupancy: z.number().int().min(0).optional().default(1),
  propertyId: z.string().uuid(),

  // ✅ Simplified features (replace old living/kitchen/accessibility/hygiene)
  features: z
    .array(
      z.object({
        category: z.string().optional(), // e.g., "kitchen", "livingroom", "bathroom"
        name: z.string().min(1, "Feature name required"), // e.g., "wifi", "tv"
        value: z.string().optional(), // e.g., "true", "2 queen beds"
      })
    )
    .optional(),

  // ✅ Optional images (unchanged logic)
  images: z
    .array(
      z.object({
        url: z.string().url("Must be a valid URL"),
        name: z.string().optional(),
      })
    )
    .optional(),

  // ✅ New: Additional services (paid or free)
  services: z
    .array(
      z.object({
        name: z.string().min(2, "Service name required"), // e.g., "Breakfast"
        description: z.string().optional(),
        price: z.number().int().min(0).optional(), // null = free service
        isActive: z.boolean().optional(),
      })
    )
    .optional(),
});

export const serviceSchema = z.object({
  name: z.string().min(2, "Service name is required"),
  description: z.string().optional(),
  price: z.number().int().positive().optional(),
  isActive: z.boolean().optional(),
});

export const updateServiceSchema = z.object({
  name: z.string().min(2, "Service name is required").optional(),
  description: z.string().optional(),
  price: z.number().int().positive().nullable().optional(),
  isActive: z.boolean().optional(),
});
