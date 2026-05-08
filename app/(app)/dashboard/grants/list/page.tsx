// import Link from "next/link";
import prisma from "@/prisma/client";
import { OSDepartmentShortName, StatusGrant } from "@prisma/client";
import { Flex } from "@radix-ui/themes";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import GrantActions from "./GrantActions";
import { GrantQuery, columnNamesGrant } from "./GrantTable";
import { checkAuth } from "@/lib/server-utils";
const DynamicGrantSearch = dynamic(
  () => import("@/app/(app)/dashboard/grants/list/GrantSearch"),
  { ssr: false, loading: () => <div>Loading...</div> },
);
const DynamicPagination = dynamic(() => import("@/app/components/Pagination"), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});
const DynamicGrantTable = dynamic(
  () => import("@/app/(app)/dashboard/grants/list/GrantTable"),
  { ssr: false, loading: () => <div>Loading...</div> },
);

interface Props {
  searchParams: GrantQuery; // an obj w/ prop called 'status'
}

const GrantsPage = async ({ searchParams }: Props) => {
  const session = await checkAuth();

  // console.log("searchParams: ", searchParams);
  // validate the status param
  const statuses = Object.values(StatusGrant);
  const status = statuses.includes(searchParams.status)
    ? searchParams.status
    : undefined;

  const orderBy = columnNamesGrant.includes(searchParams.orderBy)
    ? { [searchParams.orderBy]: searchParams.sortOrder }
    : { updatedAt: "desc" as "desc" | "asc" }; //default sortorder of table
  // : undefined;

  const departments = Object.values(OSDepartmentShortName);
  const department = departments.includes(searchParams.department)
    ? searchParams.department
    : undefined;

  const groupLeader =
    searchParams.groupLeader === "All" ? undefined : searchParams.groupLeader;

  const year = searchParams.year == "All" ? undefined : searchParams.year;

  const submitYear = searchParams.submitYear;

  const searchQuery = searchParams.searchQuery || "";

  const fAgencyId = searchParams.fAgencyId || undefined;
  const fProgId = searchParams.fProgId || undefined;
  const fActionId = searchParams.fActionId || undefined;
  const fCallId = searchParams.fCallId || undefined;

  // const year = startYears.includes(searchParams.year) ? searchParams.year : undefined;

  const page = parseInt(searchParams.page) || 1;
  const pageSize = 10;

  const filters = {
    status: status,
    department: department,
    groupLeader: groupLeader,
    year: year,
    submitYear: submitYear,
    searchQuery: searchQuery,
    fAgencyId: fAgencyId,
    fProgId: fProgId,
    fActionId: fActionId,
    fCallId: fCallId,
  };

  const buildWhereClause = (filters: any, searchQuery: string) => {
    const statusFilter = filters.status ? { status: filters.status } : {};

    const departmentFilter = filters.department
      ? {
          assignedToUser: {
            relatedDepartment: { nameShort: filters.department },
          },
        }
      : {};

    const groupLeaderFilter = filters.groupLeader
      ? { assignedToUser: { id: filters.groupLeader } }
      : {};

    const startYearFilter = filters.year
      ? filters.year === "AllStarted"
        ? { projectStartDate: { not: null } }
        : {
            projectStartDate: {
              gte: new Date(`${parseInt(filters.year)}-01-01`),
              lt: new Date(`${parseInt(filters.year) + 1}-01-01`),
            },
          }
      : {};

    const submitYearFilter = filters.submitYear
      ? {
          submissionDate: {
            gte: new Date(`${parseInt(filters.submitYear)}-01-01`),
            lt: new Date(`${parseInt(filters.submitYear) + 1}-01-01`),
          },
        }
      : {};

    const fAgencyIdFilter = filters.fAgencyId
      ? { relatedFundingAgency: { id: filters.fAgencyId } }
      : {};

    const fProgIdFilter = filters.fProgId
      ? { relatedFundingProgramme: { id: filters.fProgId } }
      : {};

    const fActionIdFilter = filters.fActionId
      ? { relatedFundingAction: { id: filters.fActionId } }
      : {};

    const fCallIdFilter = filters.fCallId
      ? { relatedFundingCall: { id: filters.fCallId } }
      : {};

    const isCurrentUserGroupLeader =
      session?.user.role === "GROUPLEADER"
        ? { assignedToUser: { id: session?.user.id } }
        : {}; // this can be 'undefined' (same for all above filters)

    const whereClause = {
      AND: [
        statusFilter,
        departmentFilter,
        groupLeaderFilter,
        startYearFilter,
        submitYearFilter,
        fAgencyIdFilter,
        fProgIdFilter,
        fActionIdFilter,
        fCallIdFilter,
        isCurrentUserGroupLeader,
      ].filter(Boolean), // Remove undefined filters
      OR: [
        {
          title: {
            contains: searchQuery,
            mode: "insensitive" as "insensitive",
          },
        },
        {
          acronym: {
            contains: searchQuery,
            mode: "insensitive" as "insensitive",
          },
        },
        {
          description: {
            contains: searchQuery,
            mode: "insensitive" as "insensitive",
          },
        },
        {
          applicantFullName: {
            contains: searchQuery,
            mode: "insensitive" as "insensitive",
          },
        },
        {
          assignedToUser: {
            OR: [
              {
                lastName: {
                  contains: searchQuery,
                  mode: "insensitive" as "insensitive",
                },
              },
              {
                firstName: {
                  contains: searchQuery,
                  mode: "insensitive" as "insensitive",
                },
              },
            ],
          },
        },
        {
          relatedFundingAgency: {
            name: {
              contains: searchQuery,
              mode: "insensitive" as "insensitive",
            },
          },
        },
        {
          relatedFundingProgramme: {
            name: {
              contains: searchQuery,
              mode: "insensitive" as "insensitive",
            },
          },
        },
        {
          relatedFundingAction: {
            name: {
              contains: searchQuery,
              mode: "insensitive" as "insensitive",
            },
          },
        },
        {
          relatedFundingCall: {
            name: {
              contains: searchQuery,
              mode: "insensitive" as "insensitive",
            },
          },
        },
        {
          fundingAgency: {
            contains: searchQuery,
            mode: "insensitive" as "insensitive",
          },
        },
        {
          fundingProgramme: {
            contains: searchQuery,
            mode: "insensitive" as "insensitive",
          },
        },
        {
          fundingAction: {
            contains: searchQuery,
            mode: "insensitive" as "insensitive",
          },
        },
        {
          fundingCall: {
            contains: searchQuery,
            mode: "insensitive" as "insensitive",
          },
        },
        ...(isNaN(parseInt(searchQuery))
          ? []
          : [{ projectNumber: { equals: parseInt(searchQuery) } }]),
      ],
    };

    return whereClause;
  };

  const whereClause = buildWhereClause(filters, searchQuery);

  const grants = await prisma.grant.findMany({
    where: whereClause,
    include: {
      assignedToUser: {
        include: {
          relatedDepartment: true,
        },
      },
      relatedFundingCall: true,
    },
    orderBy: orderBy, //this is an obj;
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  // console.log("grants: ", grants);

  const grantsCount = await prisma.grant.count({
    where: whereClause,
  });

  // const grantsCount = grants.length; // this gives 10 == pageSize only;
  // console.log("grantsCount: ", grantsCount);

  return (
    <Flex direction="column" gap="3">
      <GrantActions />
      <DynamicGrantSearch />
      <DynamicGrantTable searchParams={searchParams} grants={grants} />
      <DynamicPagination
        itemsCount={grantsCount}
        pageSize={pageSize}
        currentPage={page}
      />
    </Flex>
  );
};

// export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Cluster Dashboard - Grants List",
  description: "View all cluster grants",
};

export default GrantsPage;
