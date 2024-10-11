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

  // Validate searchParams' startYear
  const startYear =
    queryObject.year && queryObject.year === "All"
      ? undefined
      : parseInt(queryObject.year as string);

  // Collect all filters into one object
  const filters = { department, groupLeader, startYear };
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

  const startYearFilter = filters.startYear
    ? {
        projectStartDate: {
          gte: new Date(`${filters.startYear}-01-01`),
          lt: new Date(`${filters.startYear + 1}-01-01`),
        },
      }
    : {};

  const fundingAgencies = await prisma.fundingAgency.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      grants: {
        where: {
          AND: [departmentFilter, groupLeaderFilter, startYearFilter],
        },
      },
      fundingProgrammes: {
        include: {
          grants: {
            where: {
              AND: [departmentFilter, groupLeaderFilter, startYearFilter],
            },
          },
          fundingActions: {
            include: {
              grants: {
                where: {
                  AND: [departmentFilter, groupLeaderFilter, startYearFilter],
                },
              },
              fundingCalls: {
                include: {
                  grants: {
                    where: {
                      AND: [
                        departmentFilter,
                        groupLeaderFilter,
                        startYearFilter,
                      ],
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
