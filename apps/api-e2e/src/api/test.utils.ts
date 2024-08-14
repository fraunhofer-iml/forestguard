import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function truncateTables() {
  await prisma.$executeRaw`TRUNCATE TABLE "Address", "Entity", "Company", "User", "PlotOfLand", "Cultivation", "Proof", "Process", "ProcessStep", "Batch" RESTART IDENTITY CASCADE`;
}

function beforeAllAndAfterAll() {
  beforeAll(async () => {
    console.log('Setting up before all tests');
    await truncateTables();
  });

  afterAll(async () => {
    console.log('Tearing down after all tests');
    await truncateTables();
    await prisma.$disconnect();
  });
}

export { prisma, beforeAllAndAfterAll };
