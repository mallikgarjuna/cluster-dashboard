// import Link from "next/link";
import Pagination from "@/app/components/Pagination";
import prisma from "@/prisma/client";
import { OSDepartmentShortName, StatusGrant } from "@prisma/client";
import GrantActions from "./GrantActions";
import GrantTable, { GrantQuery, columnNamesGrant } from "./GrantTable";
import { Flex } from "@radix-ui/themes";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";
import { select } from "@nextui-org/react";

interface Props {
  searchParams: GrantQuery; // an obj w/ prop called 'status'
}

const GrantsPage = async ({ searchParams }: Props) => {
  const session = await getServerSession(authOptions);

  // console.log("searchParams: ", searchParams);
  // validate the status param
  const statuses = Object.values(StatusGrant);
  const status = statuses.includes(searchParams.status)
    ? searchParams.status
    : undefined;

  const orderBy = columnNamesGrant.includes(searchParams.orderBy)
    ? { [searchParams.orderBy]: searchParams.sortOrder }
    : { createdAt: "desc" as "desc" | "asc" }; //default sortorder of table
  // : undefined;

  const departments = Object.values(OSDepartmentShortName);
  const department = departments.includes(searchParams.department)
    ? searchParams.department
    : undefined;

  const groupLeader =
    searchParams.groupLeader === "All" ? undefined : searchParams.groupLeader;

  const year = searchParams.year == "All" ? undefined : searchParams.year;

  const page = parseInt(searchParams.page) || 1;
  const pageSize = 10;

  const filters = {
    status: status,
    department: department,
    groupLeader: groupLeader,
    year: year,
  };

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
        ...(filters.groupLeader
          ? [{ assignedToUser: { id: filters.groupLeader } }]
          : [{}]),
        ...(filters.year
          ? [
              {
                projectStartDate: {
                  gte: new Date(`${parseInt(filters.year)}-01-01`),
                  lt: new Date(`${parseInt(filters.year) + 1}-01-01`),
                },
              },
            ]
          : [{}]),
        ...(session?.user.role === "GROUPLEADER"
          ? [{ assignedToUser: { id: session?.user.id } }]
          : [{}]),
      ],
    },
    include: {
      assignedToUser: {
        include: {
          relatedDepartment: true,
        },
      },
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
        ...(filters.groupLeader
          ? [{ assignedToUser: { id: filters.groupLeader } }]
          : [{}]),
        ...(filters.year
          ? [
              {
                projectStartDate: {
                  gte: new Date(`${parseInt(filters.year)}-01-01`),
                  lt: new Date(`${parseInt(filters.year) + 1}-01-01`),
                },
              },
            ]
          : [{}]),
        ...(session?.user.role === "GROUPLEADER"
          ? [{ assignedToUser: { id: session?.user.id } }]
          : [{}]),
      ],
    },

    //   where: { status: status },
  });

  // const grantsCount = grants.length; // this gives 10 == pageSize only;
  // console.log("grantsCount: ", grantsCount);

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
