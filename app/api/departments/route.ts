import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const departments = await prisma.department.findMany({
    orderBy: {
      nameShort: "asc",
    },
  });
  return NextResponse.json(departments);
}
