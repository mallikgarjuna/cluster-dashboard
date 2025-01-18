import { patchGrantSchema } from "@/app/validationSchemas";
import { checkAuth } from "@/lib/server-utils";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

interface Props {
  params: { id: string };
}

export async function PATCH(request: NextRequest, { params }: Props) {
  const session = await checkAuth();

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
    applicantFullName,
    budgetTotal,
    budgetAssignedToPI,
    fundingAgency,
    fundingProgramme,
    fundingCall,
    urlFundingCall,
    submissionDate,
    deadline,
    decisionDate,
    projectStartDate,
    projectEndDate,
    notes,
    assignedToUserId,
    groupMemberType,
    status,
    projectNumber,
    applicantRole,
    fundingAgencyId,
    fundingProgrammeId,
    fundingActionId,
    fundingCallId,
    isBudgetApproved,
    isDMPSubmitted,
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
      applicantFullName: applicantFullName,
      budgetTotal: budgetTotal,
      budgetAssignedToPI: budgetAssignedToPI,
      fundingAgency: fundingAgency,
      fundingProgramme: fundingProgramme,
      fundingCall: fundingCall,
      urlFundingCall: urlFundingCall,
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
      groupMemberType: groupMemberType,
      status: status,
      projectNumber: projectNumber,
      applicantRole: applicantRole,

      ...(fundingAgencyId && {
        relatedFundingAgency: {
          connect: {
            id: fundingAgencyId,
          },
        },
      }),
      ...(fundingProgrammeId && {
        relatedFundingProgramme: {
          connect: {
            id: fundingProgrammeId,
          },
        },
      }),
      ...(fundingActionId && {
        relatedFundingAction: {
          connect: {
            id: fundingActionId,
          },
        },
      }),
      ...(fundingCallId && {
        relatedFundingCall: {
          connect: {
            id: fundingCallId,
          },
        },
      }),
      isBudgetApproved: isBudgetApproved,
      isDMPSubmitted: isDMPSubmitted,
    },
  });

  return NextResponse.json(updatedGrant);
}

export async function DELETE(request: NextRequest, { params }: Props) {
  const session = await checkAuth();

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
