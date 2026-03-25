-- DropForeignKey
ALTER TABLE "ManagedProperty" DROP CONSTRAINT "ManagedProperty_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "ManagedProperty" DROP CONSTRAINT "ManagedProperty_userId_fkey";

-- AddForeignKey
ALTER TABLE "ManagedProperty" ADD CONSTRAINT "ManagedProperty_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ManagedProperty" ADD CONSTRAINT "ManagedProperty_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
