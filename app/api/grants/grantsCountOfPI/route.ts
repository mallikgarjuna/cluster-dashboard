import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { GrantQuery } from "@/app/dashboard/grants/list/GrantTable";
import { OSDepartmentShortName } from "@prisma/client";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  // console.log("searchParams: ", searchParams); //searchParams:  URLSearchParams { 'submitYear' => '2023' }

  const params = new URLSearchParams(searchParams);
  // console.log("params: ", params); //params:  URLSearchParams { 'submitYear' => '2023' }
  // console.log("params.get('submitYear'): ", params.get("submitYear")); //params.get('submitYear'):  2023

  const queryObject: Partial<GrantQuery> = Object.fromEntries(searchParams);
  // console.log("queryObject: ", queryObject); //queryObject:  { submitYear: '2023' }
  // console.log("queryObject.submitYear: ", queryObject.submitYear); //queryObject.submitYear:  2023

  const submitYear = queryObject.submitYear
    ? parseInt(queryObject.submitYear)
    : undefined;
  // console.log("submitYear: ", submitYear);

  // Validate searchparam's department
  const departments = Object.values(OSDepartmentShortName);
  const department =
    queryObject.department &&
    (departments.includes(queryObject.department)
      ? queryObject.department
      : undefined);

  try {
    const PIs = await prisma.user.findMany({
      where: { role: "GROUPLEADER" },
      select: {
        id: true,
        name: true,
        relatedDepartment: { select: { nameShort: true } },
        assignedGrants: {
          select: {
            status: true,
            budgetTotal: true,
            budgetAssignedToPI: true,
            submissionDate: true,
            assignedToUser: {
              select: {
                relatedDepartment: {
                  select: {
                    nameShort: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { lastName: "asc" },
    });

    const grantsData = PIs.map((pi) => {
      const totalSubmittedGrants = pi.assignedGrants.filter(
        (grant) =>
          [
            "SUBMITTED",
            "REJECTED",
            "AWARDED",
            "RUNNING_PROJECT",
            "ENDED_PROJECT",
          ].includes(grant.status) &&
          (!submitYear || grant.submissionDate?.getFullYear() === submitYear) &&
          (!department ||
            grant.assignedToUser?.relatedDepartment?.nameShort === department),
      );
      const submitted = totalSubmittedGrants.length;

      const totalAwaitingGrants = pi.assignedGrants.filter(
        (grant) =>
          grant.status === "SUBMITTED" &&
          (!submitYear || grant.submissionDate?.getFullYear() === submitYear) &&
          (!department ||
            grant.assignedToUser?.relatedDepartment?.nameShort === department),
      );
      const awaiting = totalAwaitingGrants.length;

      const totalAwardedGrants = pi.assignedGrants.filter(
        (grant) =>
          ["AWARDED", "RUNNING_PROJECT", "ENDED_PROJECT"].includes(
            grant.status,
          ) &&
          (!submitYear || grant.submissionDate?.getFullYear() === submitYear) &&
          (!department ||
            grant.assignedToUser?.relatedDepartment?.nameShort === department),
      );
      const awarded = totalAwardedGrants.length;

      const totalRejectedGrants = pi.assignedGrants.filter(
        (grant) =>
          grant.status === "REJECTED" &&
          (!submitYear || grant.submissionDate?.getFullYear() === submitYear) &&
          (!department ||
            grant.assignedToUser?.relatedDepartment?.nameShort === department),
      );
      const rejected = totalRejectedGrants.length;

      const successRate = Number(((awarded / submitted) * 100).toFixed(2));

      const budgetAppliedFor = totalSubmittedGrants.reduce(
        (accumulator, grant) => accumulator + (grant.budgetTotal ?? 0),
        0,
      );
      const budgetAwarded = totalAwardedGrants.reduce(
        (accumulator, grant) => accumulator + (grant.budgetAssignedToPI ?? 0),
        0,
      );

      return {
        piID: pi.id,
        piDepartment: pi.relatedDepartment?.nameShort ?? "Unknown",
        pi: pi.name,
        submitted,
        awaiting,
        awarded,
        rejected,
        successRate,
        budgetAppliedFor,
        budgetAwarded,
      };
    });

    return NextResponse.json(grantsData);
  } catch (error) {
    console.error("Error fetching grants count of PI", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
