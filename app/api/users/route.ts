import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

// To disable caching for this route
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const users = await prisma.user.findMany({ orderBy: { lastName: "asc" } });
  return NextResponse.json(users);
}
