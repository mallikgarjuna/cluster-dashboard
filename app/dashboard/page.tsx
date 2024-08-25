import prisma from "@/prisma/client";
import { Flex, Grid } from "@radix-ui/themes";
import { Metadata } from "next";
import GrantChart from "./_ui/GrantChart";
import GrantSummary from "./_ui/GrantSummary";
import LatestGrants from "./_ui/LatestGrants";
import { getServerSession } from "next-auth";
import authOptions from "../auth/authOptions";
import DashboardActions from "./_ui/DashboardActions";
import { GrantQuery } from "./grants/list/GrantTable";
import { OSDepartmentShortName } from "@prisma/client";
import PIGrantsTable from "./_ui/PIGrantsTable";

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
    submitYear: searchParams.submitYear,
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

  const filterSubmitYear = filters.submitYear
    ? [
        {
          submissionDate: {
            gte: new Date(`${parseInt(filters.submitYear)}-01-01`),
            lt: new Date(`${parseInt(filters.submitYear) + 1}-01-01`),
          },
        },
      ]
    : [{}];

  // Prisma queries
  const getSubmittedGrantsForUser = async (userId?: string) => {
    return await prisma.grant.findMany({
      where: {
        AND: [
          ...isGroupLeader,
          // ...filterGroupLeader,
          // { assignedToUser: { id: userId } },
          ...(userId ? [{ assignedToUser: { id: userId } }] : [{}]),
          ...filterDepartment,
          ...filterYear,
          ...filterSubmitYear,
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
  };
  const submittedTotal = (await getSubmittedGrantsForUser(filters.groupLeader))
    .length;
  // console.log("submittedTotal: ", submittedTotal);

  const getAwaitingGrantsForUser = async (userId?: string) => {
    return await prisma.grant.findMany({
      where: {
        AND: [
          ...isGroupLeader,
          // ...filterGroupLeader,
          ...(userId ? [{ assignedToUser: { id: userId } }] : [{}]),
          ...filterDepartment,
          ...filterYear,
          ...filterSubmitYear,
        ],
        OR: [{ status: "SUBMITTED" }],
      },
    });
  };
  const awaitingTotal = (await getAwaitingGrantsForUser(filters.groupLeader))
    .length;

  const getAwardedGrantsForUser = async (userId?: string) => {
    return await prisma.grant.findMany({
      where: {
        AND: [
          ...isGroupLeader,
          // ...filterGroupLeader,
          ...(userId ? [{ assignedToUser: { id: userId } }] : [{}]),
          ...filterDepartment,
          ...filterYear,
          ...filterSubmitYear,
        ],
        OR: [
          { status: "AWARDED" },
          { status: "RUNNING_PROJECT" },
          { status: "ENDED_PROJECT" },
        ],
      },
    });
  };
  const awardedTotal = (await getAwardedGrantsForUser(filters.groupLeader))
    .length;

  const getRejectedGrantsForUser = async (userId?: string) => {
    return await prisma.grant.findMany({
      where: {
        AND: [
          ...isGroupLeader,
          // ...filterGroupLeader,
          ...(userId ? [{ assignedToUser: { id: userId } }] : [{}]),
          ...filterDepartment,
          ...filterYear,
          ...filterSubmitYear,
        ],
        OR: [{ status: "REJECTED" }],
      },
    });
  };
  const rejectedTotal = (await getRejectedGrantsForUser(filters.groupLeader))
    .length;

  const getLatestGrantsForUser = async (userId?: string) => {
    return await prisma.grant.findMany({
      where: {
        AND: [
          ...isGroupLeader,
          // ...filterGroupLeader,
          ...(userId ? [{ assignedToUser: { id: userId } }] : [{}]),
          ...filterDepartment,
          ...filterYear,
          ...filterSubmitYear,
        ],
      },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { assignedToUser: true },
    });
  };
  const latestGrants = await getLatestGrantsForUser(filters.groupLeader);

  // Get all group leaders - for grantsCountOfPIData for PIGrantsTable
  const groupLeaders = await prisma.user.findMany({
    where: { role: "GROUPLEADER" },
    select: {
      id: true,
      name: true,
      relatedDepartment: { select: { nameShort: true } },
    },
  });

  // Get grants count of PI (an array of objects, [{}]) for PIGrantsTable
  const grantsCountOfPIData = await Promise.all(
    groupLeaders.map(async (groupLeader) => ({
      piID: groupLeader.id,
      piDepartment: groupLeader.relatedDepartment?.nameShort ?? "Unknown",
      pi: groupLeader.name,
      submitted: (await getSubmittedGrantsForUser(groupLeader.id)).length,
      awaiting: (await getAwaitingGrantsForUser(groupLeader.id)).length,
      awarded: (await getAwardedGrantsForUser(groupLeader.id)).length,
      rejected: (await getRejectedGrantsForUser(groupLeader.id)).length,
      successRate: Number(
        (
          ((await getAwardedGrantsForUser(groupLeader.id)).length /
            (await getSubmittedGrantsForUser(groupLeader.id)).length) *
          100
        ).toFixed(2),
      ),
      budgetAppliedFor: (
        await getSubmittedGrantsForUser(groupLeader.id)
      ).reduce(
        (accumulator, grant) => accumulator + (grant.budgetTotal ?? 0),
        0,
      ),
      budgetAwarded: (await getAwardedGrantsForUser(groupLeader.id)).reduce(
        (accumulator, grant) => accumulator + (grant.budgetAssignedToPI ?? 0),
        0,
      ),
    })),
  );

  return (
    <Flex direction="column" gap="5">
      <DashboardActions />
      <Grid columns={{ initial: "1", md: "2" }} gap="5">
        <Flex direction="column" gap="5">
          <GrantSummary
            awaiting={awaitingTotal}
            submitted={submittedTotal}
            awarded={awardedTotal}
            rejected={rejectedTotal}
            searchParams={searchParams}
          />
          <GrantChart
            awaiting={awaitingTotal}
            submitted={submittedTotal}
            awarded={awardedTotal}
            rejected={rejectedTotal}
          />
        </Flex>
        <LatestGrants latestGrants={latestGrants} />
      </Grid>
      <PIGrantsTable grantsCountOfPIData={grantsCountOfPIData} />
    </Flex>
  );
}

export const metadata: Metadata = {
  title: "Cluster Dashboard - Dashboard page",
  description: "View a summary of grants",
};
