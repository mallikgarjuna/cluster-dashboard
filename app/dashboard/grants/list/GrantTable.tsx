import { Link, GrantStatusBadge } from "@/app/components";
import prisma from "@/prisma/client";
import { GrantWithUserWithDepartment } from "@/prisma/customTypes";
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
  year: string;
  submitYear: string;
}

interface Props {
  searchParams: GrantQuery;
  grants: GrantWithUserWithDepartment[];
  // grants: Grant[];
}

const GrantTable = async ({ searchParams, grants }: Props) => {
  const toggleSortOrder = () => {
    return searchParams.sortOrder === "asc" ? "desc" : "asc";
  };

  return (
    <Table.Root variant="surface" size={"1"}>
      <Table.Header>
        <Table.Row>
          {columnsGrant.map((column) => (
            <Table.ColumnHeaderCell
              key={column.value}
              className={`${column.classname} min-w-[80px]`}
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
          return (
            <Table.Row key={grant.id}>
              <Table.Cell>
                <Link href={`/dashboard/grants/${grant.id}`}>
                  {grant.acronym ?? grant.title}
                </Link>
                <span className="block md:hidden">
                  <GrantStatusBadge status={grant.status} />
                </span>
              </Table.Cell>

              <Table.Cell className="hidden cursor-pointer md:table-cell">
                <Link href={`/dashboard/grants/${grant.id}`}>
                  <span className="cursor-pointer">
                    <GrantStatusBadge status={grant.status} />
                  </span>
                </Link>
              </Table.Cell>

              <Table.Cell className="hidden md:table-cell">
                <Link href={`/dashboard/grants/${grant.id}`}>
                  {grant.fundingCall || grant.relatedFundingCall?.name}
                </Link>
              </Table.Cell>

              <Table.Cell className="hidden md:table-cell">
                {grant.budgetAssignedToPI}
              </Table.Cell>

              <Table.Cell className="hidden md:table-cell">
                <Link href={`/dashboard/grants/${grant.id}`}>
                  {grant.updatedAt.toISOString().split("T")[0]}
                </Link>
              </Table.Cell>

              <Table.Cell className="hidden md:table-cell">
                <Link href={`/dashboard/grants/${grant.id}`}>
                  {grant.submissionDate?.toISOString().split("T")[0]}
                </Link>
              </Table.Cell>

              <Table.Cell className="hidden md:table-cell">
                <Link href={`/dashboard/grants/${grant.id}`}>
                  {grant.projectStartDate?.toISOString().split("T")[0]}
                </Link>
              </Table.Cell>

              <Table.Cell>
                <Link href={`/dashboard/grants/${grant.id}`}>
                  {grant.projectEndDate?.toISOString().split("T")[0]}
                </Link>
              </Table.Cell>

              <Table.Cell className="hidden md:table-cell">
                <Link href={`/dashboard/grants/${grant.id}`}>
                  {grant.projectNumber}
                </Link>
              </Table.Cell>

              <Table.Cell className="hidden md:table-cell">
                {grant.isDMPSubmitted ? "Yes" : "No"}
              </Table.Cell>

              <Table.Cell className="hidden md:table-cell">
                {/* user lastName where user.id = grant.assignedToUserId */}
                {/* {user?.lastName} */}
                {grant.assignedToUser?.lastName}
              </Table.Cell>

              <Table.Cell className="hidden md:table-cell">
                {grant.groupMemberType}
              </Table.Cell>

              <Table.Cell className="hidden md:table-cell">
                {/* user lastName where user.id = grant.assignedToUserId */}
                {/* {dept?.nameShort} */}
                {grant.assignedToUser?.relatedDepartment?.nameShort}
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
  {
    label: "Funding Call",
    value: "fundingCall",
    classname: "hidden md:table-cell",
  },
  {
    label: "Budget",
    value: "budgetAssignedToPI",
    classname: "hidden md:table-cell",
  },
  { label: "Updated", value: "updatedAt", classname: "hidden md:table-cell" },
  {
    label: "Submitted",
    value: "submissionDate",
    classname: "hidden md:table-cell",
  },
  {
    label: "Project.start",
    value: "projectStartDate",
    classname: "hidden md:table-cell",
  },
  {
    label: "Project.end",
    value: "projectEndDate",
    classname: "hidden md:table-cell",
  },
  {
    label: "P.Number",
    value: "projectNumber",
    classname: "hidden md:table-cell",
  },
  {
    label: "DMP?",
    value: "isDMPSubmitted",
    classname: "hidden md:table-cell",
  },
  {
    label: "Gr.leader",
    value: "assignedToUserId",
    classname: "hidden md:table-cell",
  },
  {
    label: "Applicant",
    value: "groupMemberType",
    classname: "hidden md:table-cell",
  },
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
