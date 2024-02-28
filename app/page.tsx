import Image from "next/image";
import Pagination from "./components/Pagination";
import LatestGrants from "./LatestGrants";
import GrantSummary from "./GrantSummary";
import prisma from "@/prisma/client";

export default async function Home() {
  const submitted = await prisma.grant.count({
    where: { status: "SUBMITTED" },
  });
  const awarded = await prisma.grant.count({ where: { status: "AWARDED" } });
  const rejected = await prisma.grant.count({ where: { status: "REJECTED" } });

  return (
    <>
      <div>Cluster Dashboard</div>
      {/* <LatestGrants /> */}
      <GrantSummary
        submitted={submitted}
        awarded={awarded}
        rejected={rejected}
      />
    </>
  );
}
