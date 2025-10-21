import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {

  const hashedPassword = await bcrypt.hash('123456', 10);

  const rootAdmin = await prisma.admin.upsert({
    where: { email: 'root@example.com' },
    update: {},
    create: {
      name: 'Root Admin',
      email: 'root@example.com',
      password: hashedPassword,
      role: 'ROOT',
    },
  });

  console.log('Root admin created:', rootAdmin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
