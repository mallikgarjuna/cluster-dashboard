import { GrantSchema } from "@/app/validationSchemas";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

interface Props {
  params: { id: string };
}

export async function PATCH(request: NextRequest, { params }: Props) {
  const body = await request.json();
  const validation = GrantSchema.safeParse(body);
  if (!validation.success)
    return NextResponse.json(validation.error.format(), { status: 400 });
  // 400: Bad request, meaning: the client sent invalid data

  const grant = await prisma.grant.findUnique({
    where: { id: parseInt(params.id) },
  });
  if (!grant)
    return NextResponse.json({ error: "Invalid grant" }, { status: 404 });
  // 404 = not found

  const updatedGrant = await prisma.grant.update({
    where: { id: grant.id },
    data: { title: body.title, description: body.description },
  });

  return NextResponse.json(updatedGrant);
}

export async function DELETE(request: NextRequest, { params }: Props) {
  // To simulate delay for deleting and loading spinner:
  // await delay(2000);

  const grant = await prisma.grant.findUnique({
    where: { id: parseInt(params.id) },
  });
  if (!grant)
    return NextResponse.json({ error: "Invalid grant" }, { status: 400 });

  await prisma.grant.delete({
    where: { id: grant.id },
  });

  return NextResponse.json({});
}
