import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

// To disable caching for this route
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const fundingActions = await prisma.fundingAction.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      fundingCalls: true,
    },
  });
  return NextResponse.json(fundingActions);
}
