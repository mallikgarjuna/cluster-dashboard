// import Link from "next/link";
import Pagination from "@/app/components/Pagination";
import prisma from "@/prisma/client";
import { OSDepartmentShortName, StatusGrant } from "@prisma/client";
import GrantActions from "./GrantActions";
import GrantTable, { GrantQuery, columnNamesGrant } from "./GrantTable";
import { Flex } from "@radix-ui/themes";
import { Metadata } from "next";

interface Props {
  searchParams: GrantQuery; // an obj w/ prop called 'status'
}

const GrantsPage = async ({ searchParams }: Props) => {
  console.log("searchParams: ", searchParams);
  // validate the status param
  const statuses = Object.values(StatusGrant);
  const status = statuses.includes(searchParams.status)
    ? searchParams.status
    : undefined;

  const orderBy = columnNamesGrant.includes(searchParams.orderBy)
    ? { [searchParams.orderBy]: searchParams.sortOrder }
    : undefined;

  const departments = Object.values(OSDepartmentShortName);
  const department = departments.includes(searchParams.department)
    ? searchParams.department
    : undefined;

  const page = parseInt(searchParams.page) || 1;
  const pageSize = 10;

  const filters = { status: status, department: department };

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
      ],
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
      ],
    },
    //   where: { status: status },
  });

  // const grantsCount = grants.length; // this gives 10 == pageSize only;
  console.log("grantsCount: ", grantsCount);

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
