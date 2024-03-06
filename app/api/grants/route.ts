import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { grantFormSchema } from "../../validationSchemas";
import authOptions from "@/app/auth/authOptions";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({}, { status: 401 });
  // 401 == unauthorized

  const body = await request.json();
  const validation = grantFormSchema.safeParse(body);
  if (!validation.success)
    return NextResponse.json(validation.error.format(), { status: 400 });
  // 400: Bad request, meaning: the client sent invalid data

  const newGrant = await prisma.grant.create({
    data: {
      title: body.title,
      description: body.description,
      submissionDate: body.submissionDate,
    },
  });

  return NextResponse.json(newGrant, { status: 201 });
  //   201: obj was created
}
