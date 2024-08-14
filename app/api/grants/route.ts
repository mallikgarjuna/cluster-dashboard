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
  // console.log("body: ", body);
  const validation = grantFormSchema.safeParse(body);
  if (!validation.success)
    return NextResponse.json(validation.error.format(), { status: 400 });
  // 400: Bad request, meaning: the client sent invalid data
  // console.log("validation.data: ", validation.data);

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

  const newGrant = await prisma.grant.create({
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
          id: assignedToUserId,
        },
      },
      status: status,
      projectNumber: projectNumber,
      applicantRole: applicantRole,
      createdByUser: {
        connect: {
          id: session.user.id,
        },
      },
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

  return NextResponse.json(newGrant, { status: 201 });
  //   201: obj was created
}
