import prisma from "@/prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  const fundingCalls = await prisma.fundingCall.findMany({
    orderBy: {
      name: "asc",
    },
  });
  return NextResponse.json(fundingCalls);
}
