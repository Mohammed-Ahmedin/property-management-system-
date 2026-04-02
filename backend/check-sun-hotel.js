const { PrismaClient } = require('./node_modules/@prisma/client');
const p = new PrismaClient();
async function run() {
  const props = await p.property.findMany({
    where: { name: { contains: 'Sun', mode: 'insensitive' } },
    select: { id: true, name: true, status: true, visibility: true, createdAt: true }
  });
  console.log('Sun properties:', JSON.stringify(props, null, 2));
  
  // Also show all properties with their status
  const all = await p.property.findMany({
    select: { id: true, name: true, status: true, visibility: true },
    orderBy: { createdAt: 'asc' }
  });
  console.log('\nAll properties:', JSON.stringify(all, null, 2));
}
run().finally(() => p.$disconnect());
