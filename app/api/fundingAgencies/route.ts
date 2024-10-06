import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

// To disable caching for this route
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const fundingAgencies = await prisma.fundingAgency.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      grants: true,
      fundingProgrammes: {
        include: {
          grants: true,
          fundingActions: {
            include: {
              grants: true,
              fundingCalls: {
                include: {
                  grants: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return NextResponse.json(fundingAgencies);
}
