import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { createLeadWithAssignments } from "@/lib/leadDistributor";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body) {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { name, phoneNumber, city, description, serviceId } = body as {
    name?: string;
    phoneNumber?: string;
    city?: string;
    description?: string;
    serviceId?: number;
  };

  if (!name || !phoneNumber || !city || !serviceId) {
    return NextResponse.json(
      { error: "Missing required fields." },
      { status: 400 }
    );
  }

  try {
    const result = await createLeadWithAssignments(prisma, {
      name,
      phoneNumber,
      city,
      description,
      serviceId,
    });

    return NextResponse.json({
      leadId: result.leadId,
      providerIds: result.providerIds,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.startsWith("Duplicate lead")) {
        return NextResponse.json({ error: error.message }, { status: 409 });
      }

      return NextResponse.json({ error: error.message }, { status: 422 });
    }

    return NextResponse.json({ error: "Unexpected error." }, { status: 500 });
  }
}
