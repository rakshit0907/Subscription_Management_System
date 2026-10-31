import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

/** Phase 1 seed: demo users only. Later phases extend this file with catalog, subscriptions and invoices. */
async function seedUsers() {
  const hash = (pw: string) => bcrypt.hash(pw, 12);

  await prisma.user.upsert({
    where: { email: 'admin@brightloop.com' },
    update: {},
    create: { name: 'Alice Admin', email: 'admin@brightloop.com', passwordHash: await hash('Admin@12345'), role: 'ADMIN', company: 'Brightloop Software' },
  });
  await prisma.user.upsert({
    where: { email: 'staff@brightloop.com' },
    update: {},
    create: { name: 'Sam Staff', email: 'staff@brightloop.com', passwordHash: await hash('Staff@12345'), role: 'STAFF', company: 'Brightloop Software' },
  });

  const customerHash = await hash('Customer@123');
  for (let i = 1; i <= 10; i++) {
    await prisma.user.upsert({
      where: { email: `customer${i}@example.com` },
      update: {},
      create: {
        name: `Customer ${i}`,
        email: `customer${i}@example.com`,
        passwordHash: customerHash,
        role: 'CUSTOMER',
        company: `Company ${i} Pvt Ltd`,
        phone: `+91 90000 000${String(i).padStart(2, '0')}`,
        address: `${i} Market Road, Lucknow, Uttar Pradesh`,
      },
    });
  }
}

async function main() {
  await seedUsers();
  console.log('Seed complete: admin, staff and 10 customers.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
