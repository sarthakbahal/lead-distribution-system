import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function getDashboardPayload() {
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

  return providers.map((provider) => ({
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
}

export async function GET() {
  const encoder = new TextEncoder();
  let interval: NodeJS.Timeout | null = null;

  const stream = new ReadableStream({
    async start(controller) {
      const send = async () => {
        const payload = await getDashboardPayload();
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
      };

      await send();
      interval = setInterval(send, 5000);
    },
    cancel() {
      if (interval) {
        clearInterval(interval);
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
