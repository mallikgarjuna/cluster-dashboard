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

  // If validation is successful, destructure the data from the validation
  const {
    title,
    description,
    acronym,
    budgetTotal,
    fundingAgency,
    fundingProgramme,
    fundingCall,
    submissionDate,
    deadline,
    decisionDate,
    projectStartDate,
    projectEndDate,
    notes,
    assignedToUserId,
    status,
    projectNumber,
    applicantRole,
    fundingAgencyId,
    fundingProgrammeId,
    fundingActionId,
  } = validation.data;

  // Validating assignedToUserId:
  // If the body has a assignedToUserId, make sure its a valid user;
  if (assignedToUserId) {
    const user = await prisma.user.findUnique({
      where: { id: assignedToUserId },
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
      title: title,
      description: description,
      acronym: acronym,
      budgetTotal: budgetTotal,
      fundingAgency: fundingAgency,
      fundingProgramme: fundingProgramme,
      fundingCall: fundingCall,
      submissionDate: submissionDate === "" ? null : submissionDate,
      deadline: deadline === "" ? null : deadline,
      decisionDate: decisionDate === "" ? null : decisionDate,
      projectStartDate: projectStartDate === "" ? null : projectStartDate,
      projectEndDate: projectEndDate === "" ? null : projectEndDate,
      notes: notes,
      // assignedToUserId: body.assignedToUserId,
      assignedToUser: {
        connect: {
          id: assignedToUserId!, // ! because assignedToUserId can be null (Check this later, TODO)
        },
      },
      status: status,
      projectNumber: projectNumber,
      applicantRole: applicantRole,
      relatedFundingAgency: {
        connect: {
          id: fundingAgencyId,
        },
      },
      relatedFundingProgramme: {
        connect: {
          id: fundingProgrammeId,
        },
      },
      relatedFundingAction: {
        connect: {
          id: fundingActionId,
        },
      },
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
