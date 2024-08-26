import prisma from "@/prisma/client";
import { NextResponse } from "next/server";

// To disable caching for this route
export const revalidate = 0;

export async function GET() {
  const fundingCalls = await prisma.fundingCall.findMany({
    orderBy: {
      name: "asc",
    },
  });
  return NextResponse.json(fundingCalls);
}
