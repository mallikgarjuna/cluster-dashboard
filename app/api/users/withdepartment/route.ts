import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const usersWithDepartment = await prisma.user.findMany({
    orderBy: { lastName: "asc" },
    include: { relatedDepartment: true },
  });
  return NextResponse.json(usersWithDepartment);
}
