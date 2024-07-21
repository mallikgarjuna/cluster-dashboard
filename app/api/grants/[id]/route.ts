import authOptions from "@/app/auth/authOptions";
import { patchGrantSchema } from "@/app/validationSchemas";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

interface Props {
  params: { id: string };
}

export async function PATCH(request: NextRequest, { params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({}, { status: 401 });
  // 401 == unauthorized

  const body = await request.json();
  const validation = patchGrantSchema.safeParse(body);
  if (!validation.success)
    return NextResponse.json(validation.error.format(), { status: 400 });
  // 400: Bad request, meaning: the client sent invalid data

  // Validating assignedToUserId:
  // If the body has a assignedToUserId, make sure its a valid user;
  if (body.assignedToUserId) {
    const user = await prisma.user.findUnique({
      where: { id: body.assignedToUserId },
    });

    if (!user)
      return NextResponse.json({ error: "Invalid user." }, { status: 400 });
  }

  // Validating grant:
  // Make sure that client is updating a valid grant
  const grant = await prisma.grant.findUnique({
    where: { id: params.id },
  });
  if (!grant)
    return NextResponse.json({ error: "Invalid grant" }, { status: 404 });
  // 404 = not found

  const updatedGrant = await prisma.grant.update({
    where: { id: grant.id! },
    data: {
      title: body.title,
      description: body.description,
      acronym: body.acronym,
      budgetTotal: body.budgetTotal,
      fundingAgency: body.fundingAgency,
      fundingProgramme: body.fundingProgramme,
      fundingCall: body.fundingCall,
      submissionDate: body.submissionDate === "" ? null : body.submissionDate,
      deadline: body.deadline === "" ? null : body.deadline,
      decisionDate: body.decisionDate === "" ? null : body.decisionDate,
      projectStartDate:
        body.projectStartDate === "" ? null : body.projectStartDate,
      projectEndDate: body.projectEndDate === "" ? null : body.projectEndDate,
      notes: body.notes,
      // assignedToUserId: body.assignedToUserId,
      assignedToUser: {
        connect: {
          id: body.assignedToUserId,
        },
      },
      status: body.status,
      projectNumber: body.projectNumber,
      applicantRole: body.applicantRole,
    },
  });

  return NextResponse.json(updatedGrant);
}

export async function DELETE(request: NextRequest, { params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({}, { status: 401 });
  // 401 == unauthorized

  // To simulate delay for deleting and loading spinner:
  // await delay(2000);

  const grant = await prisma.grant.findUnique({
    where: { id: params.id },
  });
  if (!grant)
    return NextResponse.json({ error: "Invalid grant" }, { status: 400 });

  await prisma.grant.delete({
    where: { id: grant.id! },
  });

  return NextResponse.json({});
}
