import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { GrantSchema } from "../../validationSchemas";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = GrantSchema.safeParse(body);
  if (!validation.success)
    return NextResponse.json(validation.error.format(), { status: 400 });
  // 400: Bad request, meaning: the client sent invalid data

  const newGrant = await prisma.grant.create({
    data: { title: body.title, description: body.description },
  });

  return NextResponse.json(newGrant, { status: 201 });
  //   201: obj was created
}
