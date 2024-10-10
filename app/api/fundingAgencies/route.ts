import { GrantQuery } from "@/app/dashboard/grants/list/GrantTable";
import prisma from "@/prisma/client";
import { OSDepartmentShortName } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

// To disable caching for this route
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const searchParams: URLSearchParams = request.nextUrl.searchParams;
  const queryObject: Partial<GrantQuery> = Object.fromEntries(searchParams);

  // Validate searchParams' department
  const departments = Object.values(OSDepartmentShortName);
  const department =
    queryObject.department && departments.includes(queryObject.department)
      ? queryObject.department
      : undefined;

  const filters = { department };
  console.log("filters.department: ", filters.department);

  const departmentFilter = filters.department
    ? {
        assignedToUser: {
          relatedDepartment: { nameShort: filters.department },
        },
      }
    : {};

  const fundingAgencies = await prisma.fundingAgency.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      grants: {
        where: departmentFilter,
      },
      fundingProgrammes: {
        include: {
          grants: {
            where: departmentFilter,
          },
          fundingActions: {
            include: {
              grants: {
                where: departmentFilter,
              },
              fundingCalls: {
                include: {
                  grants: {
                    where: departmentFilter,
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  return NextResponse.json(fundingAgencies);
}
