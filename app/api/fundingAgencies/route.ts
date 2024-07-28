import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

// To disable caching for this route
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const fundingAgencies = await prisma.fundingAgency.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return NextResponse.json(fundingAgencies);
}
