-- Add discountPercent to Property
ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "discountPercent" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- Add discountPercent to Room
ALTER TABLE "Room" ADD COLUMN IF NOT EXISTS "discountPercent" DOUBLE PRECISION NOT NULL DEFAULT 0;
