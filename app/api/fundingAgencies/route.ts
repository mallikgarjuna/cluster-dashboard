import { GrantQuery } from "@/app/dashboard/grants/list/GrantTable";
import { checkAuth } from "@/lib/server-utils";
import prisma from "@/prisma/client";
import { OSDepartmentShortName } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

// To disable caching for this route
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const session = await checkAuth();

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

  // Validate searchParams' submitYear
  const submitYear = queryObject.submitYear
    ? parseInt(queryObject.submitYear)
    : undefined;

  // Collect all filters into one object
  const filters = { department, groupLeader, startYear, submitYear };
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

  const submitYearFilter = filters.submitYear
    ? {
        submissionDate: {
          gte: new Date(`${filters.submitYear}-01-01`),
          lt: new Date(`${filters.submitYear + 1}-01-01`),
        },
      }
    : {};

  const isCurrentUserAGroupLeader =
    session?.user.role === "GROUPLEADER"
      ? { assignedToUser: { id: session?.user.id } }
      : {};

  const fundingAgencies = await prisma.fundingAgency.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      grants: {
        where: {
          AND: [
            isCurrentUserAGroupLeader,
            departmentFilter,
            groupLeaderFilter,
            startYearFilter,
            submitYearFilter,
          ],
        },
      },
      fundingProgrammes: {
        include: {
          grants: {
            where: {
              AND: [
                isCurrentUserAGroupLeader,
                departmentFilter,
                groupLeaderFilter,
                startYearFilter,
                submitYearFilter,
              ],
            },
          },
          fundingActions: {
            include: {
              grants: {
                where: {
                  AND: [
                    isCurrentUserAGroupLeader,
                    departmentFilter,
                    groupLeaderFilter,
                    startYearFilter,
                    submitYearFilter,
                  ],
                },
              },
              fundingCalls: {
                include: {
                  grants: {
                    where: {
                      AND: [
                        isCurrentUserAGroupLeader,
                        departmentFilter,
                        groupLeaderFilter,
                        startYearFilter,
                        submitYearFilter,
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
