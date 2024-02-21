import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/prisma/client";

const createGrantSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().min(1),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = createGrantSchema.safeParse(body);
  if (!validation.success)
    return NextResponse.json(validation.error.errors, { status: 400 });
  // 400: Bad request, meaning: the client sent invalid data

  const newGrant = await prisma.grant.create({
    data: { title: body.title, description: body.description },
  });

  return NextResponse.json(newGrant, { status: 201 });
  //   201: obj was created
}
