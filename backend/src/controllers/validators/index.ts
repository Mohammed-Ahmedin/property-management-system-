import z from "zod";

/* -------------------- Zod Schemas -------------------- */
export const AddFavoriteSchema = z
  .object({
    roomId: z.string().uuid().optional(),
    propertyId: z.string().uuid().optional(),
  })
  .refine((data) => data.roomId || data.propertyId, {
    message: "Either roomId or propertyId is required",
  });
