import { Table } from "@radix-ui/themes";
// import Link from "next/link";
import prisma from "@/prisma/client";
import { Link, GrantStatusBadge } from "@/app/components";
import NextLink from "next/link";
import GrantActions from "./GrantActions";
import { Grant, StatusGrant } from "@prisma/client";
import { ArrowUpIcon } from "@radix-ui/react-icons";
import Pagination from "@/app/components/Pagination";

interface Props {
  searchParams: {
    status: StatusGrant;
    orderBy: keyof Grant;
    page: string;
  }; // an obj w/ prop called 'status'
}

const GrantsPage = async ({ searchParams }: Props) => {
  const columns: {
    label: string;
    value: keyof Grant;
    classname?: string;
  }[] = [
    { label: "Grant", value: "title" },
    { label: "Status", value: "status", classname: "hidden md:table-cell" },
    { label: "Created", value: "createdAt", classname: "hidden md:table-cell" },
  ];

  // validate the status param
  const statuses = Object.values(StatusGrant);
  const status = statuses.includes(searchParams.status)
    ? searchParams.status
    : undefined;

  const orderBy = columns
    .map((column) => column.value)
    .includes(searchParams.orderBy)
    ? { [searchParams.orderBy]: "asc" }
    : undefined;

  const page = parseInt(searchParams.page) || 1;
  const pageSize = 10;

  const grants = await prisma.grant.findMany({
    where: { status: status },
    orderBy: orderBy,
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  const grantsCount = await prisma.grant.count({
    where: { status: status },
  });

  return (
    <div>
      <GrantActions />
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
      <Pagination
        itemsCount={grantsCount}
        pageSize={pageSize}
        currentPage={page}
      />
    </div>
  );
};

export const dynamic = "force-dynamic";

export default GrantsPage;
