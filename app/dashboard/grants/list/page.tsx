// import Link from "next/link";
import Pagination from "@/app/components/Pagination";
import prisma from "@/prisma/client";
import { OSDepartmentShortName, StatusGrant } from "@prisma/client";
import GrantActions from "./GrantActions";
import GrantTable, { GrantQuery, columnNamesGrant } from "./GrantTable";
import { Flex } from "@radix-ui/themes";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";
import { select } from "@nextui-org/react";
import GrantSearch from "./GrantSearch";
import { Suspense } from "react";
import dynamic from "next/dynamic";

const DynamicGrantActions = dynamic(
  () => import("@/app/dashboard/grants/list/GrantActions"),
  { ssr: false, loading: () => <div>Loading...</div> },
);
const DynamicGrantSearch = dynamic(
  () => import("@/app/dashboard/grants/list/GrantSearch"),
  { ssr: false, loading: () => <div>Loading...</div> },
);
const DynamicPagination = dynamic(() => import("@/app/components/Pagination"), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});

interface Props {
  searchParams: GrantQuery; // an obj w/ prop called 'status'
}

const GrantsPage = async ({ searchParams }: Props) => {
  const session = await getServerSession(authOptions);

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

  const searchQuery = searchParams.searchQuery;

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
  };

  const grants = await prisma.grant.findMany({
    // where: { status: status },
    where: {
      AND: [
        ...(filters.status ? [{ status: filters.status }] : [{}]),
        ...(filters.department
          ? [
              {
                assignedToUser: {
                  relatedDepartment: { nameShort: filters.department },
                },
              },
            ]
          : [{}]),
        ...(filters.groupLeader
          ? [{ assignedToUser: { id: filters.groupLeader } }]
          : [{}]),
        ...(filters.year
          ? filters.year === "AllStarted"
            ? [{ projectStartDate: { not: null } }]
            : [
                {
                  projectStartDate: {
                    gte: new Date(`${parseInt(filters.year)}-01-01`),
                    lt: new Date(`${parseInt(filters.year) + 1}-01-01`),
                  },
                },
              ]
          : [{}]),
        ...(filters.submitYear
          ? [
              {
                submissionDate: {
                  gte: new Date(`${parseInt(filters.submitYear)}-01-01`),
                  lt: new Date(`${parseInt(filters.submitYear) + 1}-01-01`),
                },
              },
            ]
          : [{}]),
        ...(session?.user.role === "GROUPLEADER"
          ? [{ assignedToUser: { id: session?.user.id } }]
          : [{}]),
      ],
      OR: [
        { title: { contains: searchQuery, mode: "insensitive" } },
        { acronym: { contains: searchQuery, mode: "insensitive" } },
        { description: { contains: searchQuery, mode: "insensitive" } },
        {
          applicantFullName: {
            contains: searchQuery,
            mode: "insensitive",
          },
        },
        {
          assignedToUser: {
            OR: [
              { lastName: { contains: searchQuery, mode: "insensitive" } },
              { firstName: { contains: searchQuery, mode: "insensitive" } },
            ],
          },
        },
        {
          relatedFundingAgency: {
            name: { contains: searchQuery, mode: "insensitive" },
          },
        },
        {
          relatedFundingProgramme: {
            name: { contains: searchQuery, mode: "insensitive" },
          },
        },
        {
          relatedFundingAction: {
            name: { contains: searchQuery, mode: "insensitive" },
          },
        },
        {
          relatedFundingCall: {
            name: { contains: searchQuery, mode: "insensitive" },
          },
        },
        { fundingAgency: { contains: searchQuery, mode: "insensitive" } },
        { fundingProgramme: { contains: searchQuery, mode: "insensitive" } },
        { fundingAction: { contains: searchQuery, mode: "insensitive" } },
        { fundingCall: { contains: searchQuery, mode: "insensitive" } },
        { projectNumber: { equals: parseInt(searchQuery) } },
      ],
    },
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
    where: {
      AND: [
        ...(filters.status ? [{ status: filters.status }] : [{}]),
        ...(filters.department
          ? [
              {
                assignedToUser: {
                  relatedDepartment: { nameShort: filters.department },
                },
              },
            ]
          : [{}]),
        ...(filters.groupLeader
          ? [{ assignedToUser: { id: filters.groupLeader } }]
          : [{}]),
        ...(filters.year
          ? filters.year === "AllStarted"
            ? [{ projectStartDate: { not: null } }]
            : [
                {
                  projectStartDate: {
                    gte: new Date(`${parseInt(filters.year)}-01-01`),
                    lt: new Date(`${parseInt(filters.year) + 1}-01-01`),
                  },
                },
              ]
          : [{}]),
        ...(filters.submitYear
          ? [
              {
                submissionDate: {
                  gte: new Date(`${parseInt(filters.submitYear)}-01-01`),
                  lt: new Date(`${parseInt(filters.submitYear) + 1}-01-01`),
                },
              },
            ]
          : [{}]),
        ...(session?.user.role === "GROUPLEADER"
          ? [{ assignedToUser: { id: session?.user.id } }]
          : [{}]),
      ],
      OR: [
        { title: { contains: searchQuery, mode: "insensitive" } },
        { acronym: { contains: searchQuery, mode: "insensitive" } },
        { description: { contains: searchQuery, mode: "insensitive" } },
        {
          applicantFullName: {
            contains: searchQuery,
            mode: "insensitive",
          },
        },
        {
          assignedToUser: {
            OR: [
              { lastName: { contains: searchQuery, mode: "insensitive" } },
              { firstName: { contains: searchQuery, mode: "insensitive" } },
            ],
          },
        },
        {
          relatedFundingAgency: {
            name: { contains: searchQuery, mode: "insensitive" },
          },
        },
        {
          relatedFundingProgramme: {
            name: { contains: searchQuery, mode: "insensitive" },
          },
        },
        {
          relatedFundingAction: {
            name: { contains: searchQuery, mode: "insensitive" },
          },
        },
        {
          relatedFundingCall: {
            name: { contains: searchQuery, mode: "insensitive" },
          },
        },
        { fundingAgency: { contains: searchQuery, mode: "insensitive" } },
        { fundingProgramme: { contains: searchQuery, mode: "insensitive" } },
        { fundingAction: { contains: searchQuery, mode: "insensitive" } },
        { fundingCall: { contains: searchQuery, mode: "insensitive" } },
        { projectNumber: { equals: parseInt(searchQuery) } },
      ],
    },

    //   where: { status: status },
  });

  // const grantsCount = grants.length; // this gives 10 == pageSize only;
  // console.log("grantsCount: ", grantsCount);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Flex direction="column" gap="3">
        <DynamicGrantActions />
        <DynamicGrantSearch />
        <GrantTable searchParams={searchParams} grants={grants} />
        <DynamicPagination
          itemsCount={grantsCount}
          pageSize={pageSize}
          currentPage={page}
        />
      </Flex>
    </Suspense>
  );
};

// export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Cluster Dashboard - Grants List",
  description: "View all cluster grants",
};

export default GrantsPage;
