import prisma from "@/prisma/client";
import { Flex, Grid } from "@radix-ui/themes";
import { Metadata } from "next";
import GrantChart from "../GrantChart";
import GrantSummary from "../GrantSummary";
import LatestGrants from "../LatestGrants";

export default async function DashboardPage() {
  const submitted = await prisma.grant.count({
    where: { status: "SUBMITTED" },
  });
  const awarded = await prisma.grant.count({ where: { status: "AWARDED" } });
  const rejected = await prisma.grant.count({ where: { status: "REJECTED" } });

  return (
    <Grid columns={{ initial: "1", md: "2" }} gap="5">
      <Flex direction="column" gap="5">
        <GrantSummary
          submitted={submitted}
          awarded={awarded}
          rejected={rejected}
        />
        <GrantChart
          submitted={submitted}
          awarded={awarded}
          rejected={rejected}
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
