import { Link, GrantStatusBadge } from "@/app/components";
import prisma from "@/prisma/client";
import {
  Department,
  Grant,
  OSDepartmentShortName,
  StatusGrant,
  User,
} from "@prisma/client";
import { ArrowDownIcon, ArrowUpIcon } from "@radix-ui/react-icons";
import { Table } from "@radix-ui/themes";
import NextLink from "next/link";
import React from "react";

export interface GrantQuery {
  status: StatusGrant;
  orderBy: keyof Grant; // | keyof Department;
  page: string;
  sortOrder: "asc" | "desc";
  department: OSDepartmentShortName;
  groupLeader: User["id"]; // this is still a string type; //string;
}

interface Props {
  searchParams: GrantQuery;
  grants: Grant[];
}

const GrantTable = async ({ searchParams, grants }: Props) => {
  const toggleSortOrder = () => {
    return searchParams.sortOrder === "asc" ? "desc" : "asc";
  };

  return (
    <Table.Root variant="surface">
      <Table.Header>
        <Table.Row>
          {columnsGrant.map((column) => (
            <Table.ColumnHeaderCell
              key={column.value}
              className={column.classname}
            >
              <NextLink
                href={{
                  query: {
                    ...searchParams,
                    orderBy: column.value,
                    sortOrder: toggleSortOrder(),
                  },
                }}
              >
                {column.label}
              </NextLink>
              {searchParams.orderBy === column.value &&
                (searchParams.sortOrder === "asc" ? (
                  <ArrowUpIcon className="inline" />
                ) : (
                  <ArrowDownIcon className="inline" />
                ))}
            </Table.ColumnHeaderCell>
          ))}
          {columnsNonGrant.map((column) => (
            <Table.ColumnHeaderCell
              key={column.value}
              className={column.classname}
            >
              {column.label}
            </Table.ColumnHeaderCell>
          ))}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {grants.map(async (grant) => {
          const user = await prisma.user.findUnique({
            where: { id: grant.assignedToUserId || "" },
          });

          const dept = await prisma.department.findFirst({
            where: { id: (user?.departmentId as number) || 1 },
          });

          return (
            <Table.Row key={grant.id}>
              <Table.Cell>
                <Link href={`/dashboard/grants/${grant.id}`}>
                  {grant.title}
                </Link>
                <div className="block md:hidden">
                  <GrantStatusBadge status={grant.status} />
                </div>
              </Table.Cell>
              <Table.Cell className="hidden md:table-cell">
                <GrantStatusBadge status={grant.status} />
              </Table.Cell>
              <Table.Cell className="hidden md:table-cell">
                {grant.createdAt.toDateString()}
              </Table.Cell>
              <Table.Cell className="hidden md:table-cell">
                {grant.projectNumber}
              </Table.Cell>
              <Table.Cell className="hidden md:table-cell">
                {/* user lastName where user.id = grant.assignedToUserId */}
                {user?.lastName}
              </Table.Cell>
              <Table.Cell className="hidden md:table-cell">
                {/* user lastName where user.id = grant.assignedToUserId */}
                {dept?.nameShort}
              </Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table.Root>
  );
};

const columnsGrant: {
  label: string;
  value: keyof Grant; // | keyof Department;
  classname?: string;
}[] = [
  { label: "Grant", value: "title" },
  { label: "Status", value: "status", classname: "hidden md:table-cell" },
  { label: "Created", value: "createdAt", classname: "hidden md:table-cell" },
  {
    label: "P-Number",
    value: "projectNumber",
    classname: "hidden md:table-cell",
  },
  { label: "PI", value: "assignedToUserId", classname: "hidden md:table-cell" },
];

const columnsNonGrant: {
  label: string;
  value: keyof Department;
  classname?: string;
}[] = [
  {
    label: "Dept",
    value: "nameShort",
    classname: "hidden md:table-cell",
  },
];

export const columnNamesGrant = columnsGrant.map((column) => column.value);

export default GrantTable;
