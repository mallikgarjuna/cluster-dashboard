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

  // Validate searchParams' groupLeader id
  // But didn't validate it's a valid user id (need to fetch all users and check, not sure if it's worth it)
  const groupLeader =
    queryObject.groupLeader === "All" ? undefined : queryObject.groupLeader;

  const filters = { department, groupLeader };
  // console.log("filters.department: ", filters.department);

  const departmentFilter = filters.department
    ? {
        assignedToUser: {
          relatedDepartment: { nameShort: filters.department },
        },
      }
    : {};

  const groupLeaderFilter = filters.groupLeader
    ? { assignedToUserId: filters.groupLeader }
    : {};

  const fundingAgencies = await prisma.fundingAgency.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      grants: {
        where: {
          AND: [departmentFilter, groupLeaderFilter],
        },
      },
      fundingProgrammes: {
        include: {
          grants: {
            where: {
              AND: [departmentFilter, groupLeaderFilter],
            },
          },
          fundingActions: {
            include: {
              grants: {
                where: {
                  AND: [departmentFilter, groupLeaderFilter],
                },
              },
              fundingCalls: {
                include: {
                  grants: {
                    where: {
                      AND: [departmentFilter, groupLeaderFilter],
                    },
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
