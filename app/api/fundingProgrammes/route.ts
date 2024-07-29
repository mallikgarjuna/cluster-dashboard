import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

// To disable cache for this route
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const fundingProgrammes = await prisma.fundingProgramme.findMany({
    orderBy: {
      name: "asc",
    },
  });
  return NextResponse.json(fundingProgrammes);
}
