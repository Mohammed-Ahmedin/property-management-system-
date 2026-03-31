const { PrismaClient } = require('./node_modules/@prisma/client');
const p = new PrismaClient();
p.property.updateMany({ where: { status: 'PENDING' }, data: { status: 'APPROVED' } })
  .then(r => { console.log('Updated:', r.count); })
  .finally(() => p.$disconnect());
