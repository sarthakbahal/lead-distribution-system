import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const services = [
    { id: 1, name: "Service 1" },
    { id: 2, name: "Service 2" },
    { id: 3, name: "Service 3" },
  ];

  const providers = [
    { id: 1, name: "Provider 1", remainingQuota: 10 },
    { id: 2, name: "Provider 2", remainingQuota: 10 },
    { id: 3, name: "Provider 3", remainingQuota: 10 },
    { id: 4, name: "Provider 4", remainingQuota: 10 },
    { id: 5, name: "Provider 5", remainingQuota: 10 },
    { id: 6, name: "Provider 6", remainingQuota: 10 },
    { id: 7, name: "Provider 7", remainingQuota: 10 },
    { id: 8, name: "Provider 8", remainingQuota: 10 },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { id: service.id },
      update: { name: service.name },
      create: service,
    });
  }

  for (const provider of providers) {
    await prisma.provider.upsert({
      where: { id: provider.id },
      update: { name: provider.name, remainingQuota: provider.remainingQuota },
      create: provider,
    });
  }

  for (const service of services) {
    await prisma.roundRobinState.upsert({
      where: { serviceId: service.id },
      update: { lastIndex: -1 },
      create: { serviceId: service.id, lastIndex: -1 },
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
