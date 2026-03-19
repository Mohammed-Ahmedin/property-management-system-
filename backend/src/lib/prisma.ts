import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg"; // or other adapter

// create adapter with your connection string
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ??
  new PrismaClient({
    adapter, // must provide
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
