import z from "zod";

// --------------------
export const platformCommissionSchema = z.object({
  platformPercent: z.number()?.min(0).max(100).optional(),
  brokerPercent: z.number()?.min(0).max(100).optional(),
  isActive: z.boolean().optional(),
});

export const propertyCommissionSchema = z.object({
  propertyId: z.string().uuid(),
  platformPercent: z.number()?.min(0).max(100).optional(),
  brokerPercent: z.number()?.min(0).max(100).optional(),
  isActive: z.boolean().optional(),
});
