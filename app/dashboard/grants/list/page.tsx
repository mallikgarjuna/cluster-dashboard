// import Link from "next/link";
import Pagination from "@/app/components/Pagination";
import prisma from "@/prisma/client";
import { StatusGrant } from "@prisma/client";
import GrantActions from "./GrantActions";
import GrantTable, { GrantQuery, columnNamesGrant } from "./GrantTable";
import { Flex } from "@radix-ui/themes";
import { Metadata } from "next";

interface Props {
  searchParams: GrantQuery; // an obj w/ prop called 'status'
}

const GrantsPage = async ({ searchParams }: Props) => {
  // validate the status param
  const statuses = Object.values(StatusGrant);
  const status = statuses.includes(searchParams.status)
    ? searchParams.status
    : undefined;

  const orderBy = columnNamesGrant.includes(searchParams.orderBy)
    ? { [searchParams.orderBy]: searchParams.sortOrder }
    : undefined;

  const page = parseInt(searchParams.page) || 1;
  const pageSize = 10;

  const grants = await prisma.grant.findMany({
    where: { status: status },
    orderBy: orderBy, //this is an obj;
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  const grantsCount = await prisma.grant.count({
    where: { status: status },
  });

  return (
    <Flex direction="column" gap="3">
      <GrantActions />
      <GrantTable searchParams={searchParams} grants={grants} />
      <Pagination
        itemsCount={grantsCount}
        pageSize={pageSize}
        currentPage={page}
      />
    </Flex>
  );
};

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Cluster Dashboard - Grants List",
  description: "View all cluster grants",
};

export default GrantsPage;
