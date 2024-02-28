import Image from "next/image";
import Pagination from "./components/Pagination";
import LatestGrants from "./LatestGrants";
import GrantSummary from "./GrantSummary";
import prisma from "@/prisma/client";
import GrantChart from "./GrantChart";
import { Flex, Grid } from "@radix-ui/themes";

export default async function Home() {
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
