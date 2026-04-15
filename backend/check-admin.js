const { PrismaClient } = require('./node_modules/@prisma/client');
const p = new PrismaClient({ datasources: { db: { url: 'postgresql://neondb_owner:npg_POAGHSC1Tqy4@ep-sparkling-moon-adosvr5y-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require' } } });
p.user.findMany({ where: { role: 'ADMIN' }, select: { id: true, name: true, email: true, image: true } })
  .then(u => { console.log(JSON.stringify(u, null, 2)); p.$disconnect(); })
  .catch(e => { console.error(e.message); p.$disconnect(); });
