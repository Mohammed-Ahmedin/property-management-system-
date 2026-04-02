"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * One-time script: marks the failed cascade migration as rolled back
 * so Prisma stops blocking on it.
 */
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield prisma.$executeRaw `
      UPDATE "_prisma_migrations"
      SET "rolled_back_at" = NOW()
      WHERE "migration_name" = '20260325124738_cascade_managed_property'
        AND "rolled_back_at" IS NULL
    `;
            console.log("✅ Migration marked as rolled back");
        }
        catch (e) {
            console.log("Migration fix skipped:", e);
        }
        finally {
            yield prisma.$disconnect();
        }
    });
}
main();
