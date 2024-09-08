import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

interface Props {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: Props) {
  // Validate the id
  if (!params.id)
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  // Fetch the user with department and use try-catch to handle errors
  try {
    const userWithDepartment = await prisma.user.findUnique({
      where: { id: params.id },
      include: { relatedDepartment: true },
    });
    if (!userWithDepartment)
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json(userWithDepartment, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching userWithDepartment" },
      { status: 500 },
    );
  }
}
