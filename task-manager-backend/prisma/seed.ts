import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, Provider, UserRole } from '@prisma/client';
import { hash } from 'bcrypt';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const now = new Date();

async function up() {
  const user = await prisma.user.create({
    data: {
      email: 'user@test.com',
      password: await hash('12345678', 10),
      provider: Provider.credentials,
      role: UserRole.USER,
      verified: now,
    },
  });

  const admin = await prisma.user.create({
    data: {
      email: 'admin@test.com',
      password: await hash('12345678', 10),
      provider: Provider.credentials,
      role: UserRole.ADMIN,
      verified: now,
    },
  });

  await prisma.profile.create({
    data: {
      fullName: 'User',
      userId: user.id,
    },
  });

  await prisma.profile.create({
    data: {
      fullName: 'Admin',
      userId: admin.id,
    },
  });

  await prisma.achivement.create({
    data: {
      userId: user.id,
    },
  });

  await prisma.achivement.create({
    data: {
      userId: admin.id,
    },
  });

  await prisma.task.createMany({
    data: [
      {
        title: 'food',
        description: 'drink coffee',
        userId: user.id,
      },
      {
        title: 'home',
        description: 'map the floor',
        userId: admin.id,
      },
    ],
  });
}

async function down() {
  await prisma.$executeRaw`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Session" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Profile" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "VerificationCode" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Task" RESTART IDENTITY CASCADE`;
}

async function main() {
  try {
    await down();
    await up();
  } catch (error) {
    console.error(error);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
