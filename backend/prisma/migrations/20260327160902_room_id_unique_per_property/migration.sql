-- Drop the global unique constraint on roomId
ALTER TABLE "Room" DROP CONSTRAINT IF EXISTS "Room_roomId_key";

-- Add compound unique constraint: roomId unique per property
ALTER TABLE "Room" ADD CONSTRAINT "Room_roomId_propertyId_key" UNIQUE ("roomId", "propertyId");
