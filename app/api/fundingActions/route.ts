import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const fundingActions = await prisma.fundingAction.findMany({
    orderBy: {
      name: "asc",
    },
  });
  return NextResponse.json(fundingActions);
}
