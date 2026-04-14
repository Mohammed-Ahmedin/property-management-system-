const { PrismaClient } = require('./node_modules/@prisma/client');
const prisma = new PrismaClient({ datasources: { db: { url: 'postgresql://neondb_owner:npg_POAGHSC1Tqy4@ep-sparkling-moon-adosvr5y-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require' } } });
async function main() {
  const msgs = await prisma.chatMessage.count();
  console.log('Chat messages:', msgs);
  const props = await prisma.property.findMany({ select: { id: true, name: true, discountPercent: true, facilities: { select: { name: true } } }, take: 3 });
  console.log('Properties sample:', JSON.stringify(props, null, 2));
  await prisma.$disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
