const { PrismaClient } = require('./node_modules/@prisma/client');

const DB_URL = 'postgresql://neondb_owner:npg_POAGHSC1Tqy4@ep-sparkling-moon-adosvr5y-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const p = new PrismaClient({ datasources: { db: { url: DB_URL } } });

async function run() {
  await p.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "password_reset_code" (
      "id"        TEXT NOT NULL,
      "email"     TEXT NOT NULL,
      "code"      TEXT NOT NULL,
      "active"    BOOLEAN NOT NULL DEFAULT true,
      "expiresAt" TIMESTAMP(3) NOT NULL,
      "usedAt"    TIMESTAMP(3),
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "password_reset_code_pkey" PRIMARY KEY ("id")
    );
  `);
  console.log('password_reset_code table created (or already exists)');
}

run()
  .catch(e => console.error(e.message))
  .finally(() => p.$disconnect());
