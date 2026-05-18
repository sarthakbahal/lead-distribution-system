import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

const RESET_TYPE = "reset_quota";
const DEFAULT_QUOTA = 10;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body) {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { eventId } = body as { eventId?: string };

  if (!eventId) {
    return NextResponse.json({ error: "eventId is required." }, { status: 400 });
  }

  try {
    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const existing = await tx.webhookEvent.findUnique({
        where: { eventId },
      });

      if (existing) {
        return { alreadyProcessed: true, updateCount: 0 };
      }

      await tx.webhookEvent.create({
        data: {
          eventId,
          type: RESET_TYPE,
        },
      });

      const updateResult = await tx.provider.updateMany({
        data: { remainingQuota: DEFAULT_QUOTA },
      });

      return { alreadyProcessed: false, updateCount: updateResult.count };
    });

    return NextResponse.json({
      processed: true,
      alreadyProcessed: result.alreadyProcessed,
      updatedProviders: result.updateCount,
    });
  } catch (error: unknown) {
    const errorCode = (error as { code?: string } | null)?.code;
    if (errorCode === "P2002") {
      return NextResponse.json({
        processed: true,
        alreadyProcessed: true,
      });
    }

    return NextResponse.json({ error: "Unexpected error." }, { status: 500 });
  }
}
