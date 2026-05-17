import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET() {
  const providers = await prisma.provider.findMany({
    orderBy: { id: "asc" },
    include: {
      assignments: {
        orderBy: { createdAt: "desc" },
        include: {
          lead: {
            include: {
              service: true,
            },
          },
        },
      },
    },
  });

  const payload = providers.map((provider) => ({
    id: provider.id,
    name: provider.name,
    remainingQuota: provider.remainingQuota,
    assignedLeadCount: provider.assignments.length,
    assignments: provider.assignments.map((assignment) => ({
      id: assignment.id,
      leadId: assignment.leadId,
      createdAt: assignment.createdAt,
      lead: {
        id: assignment.lead.id,
        name: assignment.lead.name,
        phoneNumber: assignment.lead.phoneNumber,
        city: assignment.lead.city,
        description: assignment.lead.description,
        service: {
          id: assignment.lead.service.id,
          name: assignment.lead.service.name,
        },
      },
    })),
  }));

  return NextResponse.json({ providers: payload });
}
