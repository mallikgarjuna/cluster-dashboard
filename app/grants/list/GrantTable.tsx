import { Link, GrantStatusBadge } from "@/app/components";
import { Grant, StatusGrant } from "@prisma/client";
import { ArrowUpIcon } from "@radix-ui/react-icons";
import { Table } from "@radix-ui/themes";
import NextLink from "next/link";
import React from "react";

export interface GrantQuery {
  status: StatusGrant;
  orderBy: keyof Grant;
  page: string;
}

interface Props {
  searchParams: GrantQuery;
  grants: Grant[];
}

const GrantTable = ({ searchParams, grants }: Props) => {
  return (
    <Table.Root variant="surface">
      <Table.Header>
        <Table.Row>
          {columns.map((column) => (
            <Table.ColumnHeaderCell
              key={column.value}
              className={column.classname}
            >
              <NextLink
                href={{
                  query: { ...searchParams, orderBy: column.value },
                }}
              >
                {column.label}
              </NextLink>
              {searchParams.orderBy === column.value && (
                <ArrowUpIcon className="inline" />
              )}
            </Table.ColumnHeaderCell>
          ))}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {grants.map((grant) => (
          <Table.Row key={grant.id}>
            <Table.Cell>
              <Link href={`/grants/${grant.id}`}>{grant.title}</Link>
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
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
};

const columns: {
  label: string;
  value: keyof Grant;
  classname?: string;
}[] = [
  { label: "Grant", value: "title" },
  { label: "Status", value: "status", classname: "hidden md:table-cell" },
  { label: "Created", value: "createdAt", classname: "hidden md:table-cell" },
];

export const columnNames = columns.map((column) => column.value);

export default GrantTable;
