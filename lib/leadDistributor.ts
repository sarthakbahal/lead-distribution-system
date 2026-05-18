import { Prisma, PrismaClient } from "@prisma/client";

export type LeadInput = {
  name: string;
  phoneNumber: string;
  city: string;
  description?: string;
  serviceId: number;
};

export type LeadAssignmentResult = {
  leadId: number;
  providerIds: number[];
};

const MANDATORY_PROVIDERS: Record<number, number[]> = {
  1: [1],
  2: [5],
  3: [1, 4],
};

const FAIR_POOLS: Record<number, number[]> = {
  1: [2, 3, 4],
  2: [6, 7, 8],
  3: [2, 3, 5, 6, 7, 8],
};

async function decrementQuota(
  tx: Prisma.TransactionClient,
  providerId: number
): Promise<boolean> {
  const result = await tx.provider.updateMany({
    where: { id: providerId, remainingQuota: { gt: 0 } },
    data: { remainingQuota: { decrement: 1 } },
  });

  return result.count === 1;
}

export async function createLeadWithAssignments(
  prisma: PrismaClient,
  input: LeadInput
): Promise<LeadAssignmentResult> {
  const maxRetries = 3;
  let attempt = 0;

  while (true) {
    try {
      const result = await prisma.$transaction(
        async (tx: Prisma.TransactionClient) => {
        const lead = await tx.lead.create({
          data: {
            name: input.name,
            phoneNumber: input.phoneNumber,
            city: input.city,
            description: input.description,
            serviceId: input.serviceId,
          },
        });

        const mandatoryProviders = MANDATORY_PROVIDERS[input.serviceId] ?? [];
        const pool = FAIR_POOLS[input.serviceId];

        if (!pool) {
          throw new Error("Invalid service pool configuration.");
        }

        const assignedProviders: number[] = [];

        for (const providerId of mandatoryProviders) {
          if (assignedProviders.includes(providerId)) {
            continue;
          }
          const ok = await decrementQuota(tx, providerId);
          if (!ok) {
            throw new Error(
              `Mandatory provider ${providerId} has no remaining quota.`
            );
          }
          assignedProviders.push(providerId);
        }

        const remainingSlots = 3 - assignedProviders.length;
        if (remainingSlots < 0) {
          throw new Error("Too many mandatory assignments configured.");
        }

        const state = await tx.roundRobinState.findUnique({
          where: { serviceId: input.serviceId },
        });

        let lastIndex = state?.lastIndex ?? -1;

        for (let slot = 0; slot < remainingSlots; slot++) {
          let attempts = 0;
          let assigned = false;

          while (attempts < pool.length) {
            lastIndex = (lastIndex + 1) % pool.length;
            const providerId = pool[lastIndex];
            attempts += 1;

            if (assignedProviders.includes(providerId)) {
              continue;
            }

            const ok = await decrementQuota(tx, providerId);
            if (ok) {
              assignedProviders.push(providerId);
              assigned = true;
              break;
            }
          }

          if (!assigned) {
            throw new Error("Insufficient quota to fulfill assignment.");
          }
        }

        await tx.roundRobinState.upsert({
          where: { serviceId: input.serviceId },
          update: { lastIndex },
          create: { serviceId: input.serviceId, lastIndex },
        });

        await tx.leadAssignment.createMany({
          data: assignedProviders.map((providerId) => ({
            leadId: lead.id,
            providerId,
          })),
          skipDuplicates: true,
        });

          return { leadId: lead.id, providerIds: assignedProviders };
        },
        { maxWait: 5000, timeout: 10000 }
      );
      return result as LeadAssignmentResult;
    } catch (error) {
      const errorCode = (error as { code?: string } | null)?.code;

      if (errorCode === "P2002") {
        throw new Error(
          "Duplicate lead: phone number already exists for this service."
        );
      }
      const message = error instanceof Error ? error.message : "";

      if (
        attempt < maxRetries &&
        (errorCode === "P2034" ||
          message.includes("deadlock") ||
          message.includes("write conflict"))
      ) {
        attempt += 1;
        const delay = 50 * attempt;
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      throw error;
    }
  }
}
