// Run: node fix-access-types.js
// Updates accessType: VILLA/GUEST_HOUSE → PRIVATE, others → SHARED
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const privateTypes = ["VILLA", "GUEST_HOUSE"];
  
  const privateResult = await prisma.property.updateMany({
    where: { type: { in: privateTypes } },
    data: { accessType: "PRIVATE" },
  });
  console.log(`Set PRIVATE: ${privateResult.count} properties`);

  const sharedResult = await prisma.property.updateMany({
    where: { type: { notIn: privateTypes } },
    data: { accessType: "SHARED" },
  });
  console.log(`Set SHARED: ${sharedResult.count} properties`);
}

main().then(() => { console.log("Done"); process.exit(0); }).catch(e => { console.error(e); process.exit(1); });
