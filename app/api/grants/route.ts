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

  const newGrant = await prisma.grant.create({
    data: {
      title: body.title,
      description: body.description,
      acronym: body.acronym,
      budgetTotal: body.budgetTotal,
      submissionDate: body.submissionDate === "" ? null : body.submissionDate,
      deadline: body.deadline === "" ? null : body.deadline,
      decisionDate: body.decisionDate === "" ? null : body.decisionDate,
      projectStartDate:
        body.projectStartDate === "" ? null : body.projectStartDate,
      notes: body.notes,
      assignedToUserId: body.assignedToUserId,
      status: body.status,
      projectNumber: body.projectNumber,
    },
  });

  return NextResponse.json(newGrant, { status: 201 });
  //   201: obj was created
}
