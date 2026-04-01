const { PrismaClient } = require('./node_modules/@prisma/client');
const p = new PrismaClient();
async function run() {
  const all = await p.managedProperty.findMany({ select: { id: true, userId: true, propertyId: true, role: true } });
  const seen = new Map();
  const toDelete = [];
  for (const r of all) {
    const key = r.userId + '_' + r.propertyId;
    if (seen.has(key)) { toDelete.push(r.id); } else { seen.set(key, r.id); }
  }
  if (toDelete.length) {
    await p.managedProperty.deleteMany({ where: { id: { in: toDelete } } });
    console.log('Deleted duplicates:', toDelete.length);
  } else { console.log('No duplicates found'); }
}
run().finally(() => p.$disconnect());
