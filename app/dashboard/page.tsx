import prisma from "@/prisma/client";
import { Flex, Grid } from "@radix-ui/themes";
import { Metadata } from "next";
import GrantChart from "../GrantChart";
import GrantSummary from "../GrantSummary";
import LatestGrants from "../LatestGrants";
import { getServerSession } from "next-auth";
import authOptions from "../auth/authOptions";
import DashboardActions from "./_ui/DashboardActions";
import { GrantQuery } from "./grants/list/GrantTable";
import { OSDepartmentShortName } from "@prisma/client";

interface Props {
  searchParams: GrantQuery;
}

export default async function DashboardPage({ searchParams }: Props) {
  const session = await getServerSession(authOptions);

  const isGroupLeader =
    session?.user.role === "GROUPLEADER"
      ? [{ assignedToUser: { id: session?.user.id } }]
      : [{}];

  // Validate searchParams' department
  const departments = Object.values(OSDepartmentShortName);
  const department = departments.includes(searchParams.department)
    ? searchParams.department
    : undefined;

  const groupLeader =
    searchParams.groupLeader === "All" ? undefined : searchParams.groupLeader;

  const year = searchParams.year == "All" ? undefined : searchParams.year;

  // Filters
  const filters = {
    department: department,
    groupLeader: groupLeader,
    year: year,
  };

  // To get intellisense, implement this condition inside prisma query;
  const filterDepartment = filters.department
    ? [
        {
          assignedToUser: {
            relatedDepartment: { nameShort: filters.department },
          },
        },
      ]
    : [{}];

  const filterGroupLeader = filters.groupLeader
    ? [{ assignedToUser: { id: filters.groupLeader } }]
    : [{}];

  const filterYear = filters.year
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
    : [{}];

  // Prisma queries
  const submittedTotal = await prisma.grant.count({
    where: {
      AND: [
        ...isGroupLeader,
        ...filterDepartment,
        ...filterGroupLeader,
        ...filterYear,
      ],
      OR: [
        { status: "SUBMITTED" },
        { status: "REJECTED" },
        { status: "AWARDED" },
        { status: "RUNNING_PROJECT" },
        { status: "ENDED_PROJECT" },
      ],
    },
  });
  const submittedCurrently = await prisma.grant.count({
    where: {
      AND: [
        ...isGroupLeader,
        ...filterDepartment,
        ...filterGroupLeader,
        ...filterYear,
      ],
      OR: [{ status: "SUBMITTED" }],
    },
  });
  const awardedTotal = await prisma.grant.count({
    where: {
      AND: [
        ...isGroupLeader,
        ...filterDepartment,
        ...filterGroupLeader,
        ...filterYear,
      ],
      OR: [
        { status: "AWARDED" },
        { status: "RUNNING_PROJECT" },
        { status: "ENDED_PROJECT" },
      ],
    },
  });
  const rejectedTotal = await prisma.grant.count({
    where: {
      AND: [
        ...isGroupLeader,
        ...filterDepartment,
        ...filterGroupLeader,
        ...filterYear,
      ],
      OR: [{ status: "REJECTED" }],
    },
  });

  const latestGrants = await prisma.grant.findMany({
    where: {
      AND: [
        ...isGroupLeader,
        ...filterDepartment,
        ...filterGroupLeader,
        ...filterYear,
      ],
    },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { assignedToUser: true },
  });

  return (
    <Flex direction="column" gap="5">
      <DashboardActions />
      <Grid columns={{ initial: "1", md: "2" }} gap="5">
        <Flex direction="column" gap="5">
          <GrantSummary
            awaiting={submittedCurrently}
            submitted={submittedTotal}
            awarded={awardedTotal}
            rejected={rejectedTotal}
            searchParams={searchParams}
          />
          <GrantChart
            awaiting={submittedCurrently}
            submitted={submittedTotal}
            awarded={awardedTotal}
            rejected={rejectedTotal}
          />
        </Flex>
        <LatestGrants latestGrants={latestGrants} />
      </Grid>
    </Flex>
  );
}

export const metadata: Metadata = {
  title: "Cluster Dashboard - Dashboard page",
  description: "View a summary of grants",
};
