const { PrismaClient } = require('./node_modules/@prisma/client');
const p = new PrismaClient();
async function run() {
  // Find user with email jos@gmail.com
  const user = await p.user.findFirst({ where: { email: { contains: 'jos@gmail.com' } } });
  if (!user) { console.log('User not found'); return; }
  console.log('Found user:', user.name, user.email, 'role:', user.role);
  
  // Update their ManagedProperty role to BROKER
  const updated = await p.managedProperty.updateMany({
    where: { userId: user.id, role: 'STAFF' },
    data: { role: 'BROKER' }
  });
  console.log('Updated ManagedProperty records:', updated.count);
  
  // Also update user role to BROKER if it's STAFF
  if (user.role === 'STAFF') {
    await p.user.update({ where: { id: user.id }, data: { role: 'BROKER' } });
    console.log('Updated user role to BROKER');
  }
}
run().finally(() => p.$disconnect());
