import prisma from "@/prisma/client";
import { OSDepartmentShortName } from "@prisma/client";
import { Flex, Grid } from "@radix-ui/themes";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import dynamic from "next/dynamic";
import authOptions from "../auth/authOptions";
import DashboardActions from "./_ui/DashboardActions";
import GrantChart from "./_ui/GrantChart";
import GrantsSubmittedPerYearChart from "./_ui/GrantsSubmittedPerYearChart";
import GrantSummary from "./_ui/GrantSummary";
import LatestGrants from "./_ui/LatestGrants";
import PIGrantTableSkeleton from "./_ui/PIGrantTableSkeleton";
import { GrantQuery } from "./grants/list/GrantTable";
import { fetchUniqueGrantSubmitYears } from "@/lib/actions/grant/queries";
// import PIGrantsTable from "./_ui/PIGrantsTable";
const DynamicPIGrantsTable = dynamic(
  () => import("@/app/dashboard/_ui/PIGrantsTable"),
  {
    ssr: false,
    loading: () => <PIGrantTableSkeleton />,
  },
);

const DynamicPIFundersTable = dynamic(
  () => import("@/app/dashboard/funders/_components/PIFundersTable"),
  { ssr: false, loading: () => <div>Loading...</div> },
);

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

  const startYear = searchParams.year == "All" ? undefined : searchParams.year;

  const uniqueGrantSubmissionYears = await fetchUniqueGrantSubmitYears();
  console.log("uniqueGrantSubmissionYears: ", uniqueGrantSubmissionYears);

  // Filters
  const filters = {
    department: department,
    groupLeader: groupLeader,
    startYear: startYear,
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

  const filterStartYear = filters.startYear
    ? filters.startYear === "AllStarted"
      ? [{ projectStartDate: { not: null } }]
      : [
          {
            projectStartDate: {
              gte: new Date(`${parseInt(filters.startYear)}-01-01`),
              lt: new Date(`${parseInt(filters.startYear) + 1}-01-01`),
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
          ...filterStartYear,
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
  // const submittedTotal = (await getSubmittedGrantsForUser(filters.groupLeader))
  //   .length;
  const getSubmittedCountForUser = async (
    userId?: string,
    submitYear?: string,
  ) => {
    const filterUserId = userId ? [{ assignedToUser: { id: userId } }] : [{}];

    const filterSubmitYear = submitYear
      ? [
          {
            submissionDate: {
              gte: new Date(`${parseInt(submitYear)}-01-01`),
              lt: new Date(`${parseInt(submitYear) + 1}-01-01`),
            },
          },
        ]
      : [{}];

    return await prisma.grant.count({
      where: {
        AND: [
          ...isGroupLeader,
          // ...filterGroupLeader,
          // { assignedToUser: { id: userId } },
          ...filterUserId,
          ...filterDepartment,
          ...filterStartYear,
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
  const submittedTotal = await getSubmittedCountForUser(
    filters.groupLeader,
    filters.submitYear,
  );
  // console.log("submittedTotal: ", submittedTotal);

  // per year grant count data for GrantsSubmittedPerYearChart
  const grantsCountPerYearData = await Promise.all(
    uniqueGrantSubmissionYears.map(async (year) => ({
      year: year,
      submitted: await getSubmittedCountForUser(
        filters.groupLeader,
        year?.toString(),
      ),
    })),
  );
  // console.log("grantsSubmittedPerYearData: ", grantsSubmittedPerYearData);

  const getAwaitingCountForUser = async (userId?: string) => {
    const filterUserId = userId ? [{ assignedToUser: { id: userId } }] : [{}];

    return await prisma.grant.count({
      where: {
        AND: [
          ...isGroupLeader,
          // ...filterGroupLeader,
          ...filterUserId,
          ...filterDepartment,
          ...filterStartYear,
          ...filterSubmitYear,
        ],
        OR: [{ status: "SUBMITTED" }],
      },
    });
  };
  const awaitingTotal = await getAwaitingCountForUser(filters.groupLeader);

  const getAwardedGrantsForUser = async (userId?: string) => {
    const filterUserId = userId ? [{ assignedToUser: { id: userId } }] : [{}];

    return await prisma.grant.findMany({
      where: {
        AND: [
          ...isGroupLeader,
          // ...filterGroupLeader,
          ...filterUserId,
          ...filterDepartment,
          ...filterStartYear,
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
  const getAwardedCountForUser = async (userId?: string) => {
    const filterUserId = userId ? [{ assignedToUser: { id: userId } }] : [{}];

    return await prisma.grant.count({
      where: {
        AND: [
          ...isGroupLeader,
          // ...filterGroupLeader,
          ...filterUserId,
          ...filterDepartment,
          ...filterStartYear,
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
  const awardedTotal = await getAwardedCountForUser(filters.groupLeader);

  const getRejectedCountForUser = async (userId?: string) => {
    const filterUserId = userId ? [{ assignedToUser: { id: userId } }] : [{}];

    return await prisma.grant.count({
      where: {
        AND: [
          ...isGroupLeader,
          // ...filterGroupLeader,
          ...filterUserId,
          ...filterDepartment,
          ...filterStartYear,
          ...filterSubmitYear,
        ],
        OR: [{ status: "REJECTED" }],
      },
    });
  };
  const rejectedTotal = await getRejectedCountForUser(filters.groupLeader);

  const getLatestGrantsForUser = async (userId?: string) => {
    const filterUserId = userId ? [{ assignedToUser: { id: userId } }] : [{}];

    return await prisma.grant.findMany({
      where: {
        AND: [
          ...isGroupLeader,
          // ...filterGroupLeader,
          ...filterUserId,
          ...filterDepartment,
          ...filterStartYear,
          ...filterSubmitYear,
        ],
      },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { assignedToUser: true },
    });
  };
  const latestGrants = await getLatestGrantsForUser(filters.groupLeader);

  // // Get all group leaders - for grantsCountOfPIData for PIGrantsTable
  // const groupLeaders = await prisma.user.findMany({
  //   where: { role: "GROUPLEADER" },
  //   select: {
  //     id: true,
  //     name: true,
  //     relatedDepartment: { select: { nameShort: true } },
  //   },
  // });

  // // Get grants count of PI (an array of objects, [{}]) for PIGrantsTable
  // const grantsCountOfPIData = await Promise.all(
  //   groupLeaders.map(async (groupLeader) => {
  //     const piSubmitted = await getSubmittedCountForUser(groupLeader.id);
  //     const piAwaiting = await getAwaitingCountForUser(groupLeader.id);
  //     const piAwarded = await getAwardedCountForUser(groupLeader.id);
  //     const piRejected = await getRejectedCountForUser(groupLeader.id);
  //     const piSuccessRate = Number(
  //       ((piAwarded / piSubmitted) * 100).toFixed(2),
  //     );
  //     const piBudgetAppliedFor = (
  //       await getSubmittedGrantsForUser(groupLeader.id)
  //     ).reduce(
  //       (accumulator, grant) => accumulator + (grant.budgetTotal ?? 0),
  //       0,
  //     );
  //     const piBudgetAwarded = (
  //       await getAwardedGrantsForUser(groupLeader.id)
  //     ).reduce(
  //       (accumulator, grant) => accumulator + (grant.budgetAssignedToPI ?? 0),
  //       0,
  //     );

  //     return {
  //       piID: groupLeader.id,
  //       piDepartment: groupLeader.relatedDepartment?.nameShort ?? "Unknown",
  //       pi: groupLeader.name,
  //       submitted: piSubmitted,
  //       awaiting: piAwaiting,
  //       awarded: piAwarded,
  //       rejected: piRejected,
  //       successRate: piSuccessRate,
  //       budgetAppliedFor: piBudgetAppliedFor,
  //       budgetAwarded: piBudgetAwarded,
  //     };
  //   }),
  // );

  return (
    <Flex direction="column" gap="5" className="mb-32">
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
      <GrantsSubmittedPerYearChart perYearData={grantsCountPerYearData} />
      {/* <PIGrantsTable grantsCountOfPIData={grantsCountOfPIData} /> */}
      <DynamicPIGrantsTable />
      <DynamicPIFundersTable />
    </Flex>
  );
}

export const metadata: Metadata = {
  title: "Cluster Dashboard - Dashboard page",
  description: "View a summary of grants",
};
