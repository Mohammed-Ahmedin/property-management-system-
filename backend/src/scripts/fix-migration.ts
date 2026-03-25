/**
 * One-time script: marks the failed cascade migration as rolled back
 * so Prisma stops blocking on it.
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$executeRaw`
      UPDATE "_prisma_migrations"
      SET "rolled_back_at" = NOW()
      WHERE "migration_name" = '20260325124738_cascade_managed_property'
        AND "rolled_back_at" IS NULL
    `;
    console.log("✅ Migration marked as rolled back");
  } catch (e) {
    console.log("Migration fix skipped:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
