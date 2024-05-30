import prisma from "@/prisma/client";
import { Flex, Grid } from "@radix-ui/themes";
import { Metadata } from "next";
import GrantChart from "../GrantChart";
import GrantSummary from "../GrantSummary";
import LatestGrants from "../LatestGrants";
import { getServerSession } from "next-auth";
import authOptions from "../auth/authOptions";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  const groupLeader =
    session?.user.role === "GROUPLEADER"
      ? [{ assignedToUser: { id: session?.user.id } }]
      : [{}];

  const submittedTotal = await prisma.grant.count({
    where: {
      AND: [...groupLeader],
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
      AND: [...groupLeader],
      OR: [{ status: "SUBMITTED" }],
    },
  });
  const awardedTotal = await prisma.grant.count({
    where: {
      AND: [...groupLeader],
      OR: [
        { status: "AWARDED" },
        { status: "RUNNING_PROJECT" },
        { status: "ENDED_PROJECT" },
      ],
    },
  });
  const rejectedTotal = await prisma.grant.count({
    where: {
      AND: [...groupLeader],
      OR: [{ status: "REJECTED" }],
    },
  });

  return (
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
  );
}

export const metadata: Metadata = {
  title: "Cluster Dashboard - Dashboard page",
  description: "View a summary of grants",
};
