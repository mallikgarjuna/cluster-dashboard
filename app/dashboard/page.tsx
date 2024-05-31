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

  // Filters
  const filters = {
    department: department,
    groupLeader: groupLeader,
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

  // Prisma queries
  const submittedTotal = await prisma.grant.count({
    where: {
      AND: [...isGroupLeader, ...filterDepartment, ...filterGroupLeader],
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
      AND: [...isGroupLeader, ...filterDepartment, ...filterGroupLeader],
      OR: [{ status: "SUBMITTED" }],
    },
  });
  const awardedTotal = await prisma.grant.count({
    where: {
      AND: [...isGroupLeader, ...filterDepartment, ...filterGroupLeader],
      OR: [
        { status: "AWARDED" },
        { status: "RUNNING_PROJECT" },
        { status: "ENDED_PROJECT" },
      ],
    },
  });
  const rejectedTotal = await prisma.grant.count({
    where: {
      AND: [...isGroupLeader, ...filterDepartment, ...filterGroupLeader],
      OR: [{ status: "REJECTED" }],
    },
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
          />
          <GrantChart
            awaiting={submittedCurrently}
            submitted={submittedTotal}
            awarded={awardedTotal}
            rejected={rejectedTotal}
          />
        </Flex>
        <LatestGrants />
      </Grid>
    </Flex>
  );
}

export const metadata: Metadata = {
  title: "Cluster Dashboard - Dashboard page",
  description: "View a summary of grants",
};
