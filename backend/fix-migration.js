// Marks the failed migration as rolled back so Prisma doesn't block startup
const { PrismaClient } = require("@prisma/client");
const { execSync } = require("child_process");

const prisma = new PrismaClient();

prisma.$executeRaw`
  UPDATE "_prisma_migrations"
  SET "rolled_back_at" = NOW()
  WHERE "migration_name" = '20260325124738_cascade_managed_property'
    AND "rolled_back_at" IS NULL
`
  .then(() => console.log("Migration fix applied"))
  .catch((e) => console.log("Migration fix skipped:", e.message))
  .finally(async () => {
    await prisma.$disconnect();
    execSync("node dist/app.js", { stdio: "inherit" });
  });
