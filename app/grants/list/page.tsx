import { Table } from "@radix-ui/themes";
// import Link from "next/link";
import prisma from "@/prisma/client";
import { Link, GrantStatusBadge } from "@/app/components";
import GrantActions from "./GrantActions";
import { StatusGrant } from "@prisma/client";

interface Props {
  searchParams: { status: StatusGrant }; // an obj w/ prop called 'status'
}

const GrantsPage = async ({ searchParams }: Props) => {
  // validate the status param
  const statuses = Object.values(StatusGrant);
  const status = statuses.includes(searchParams.status)
    ? searchParams.status
    : undefined;

  const grants = await prisma.grant.findMany({
    where: { status: status },
  });

  return (
    <div>
      <GrantActions />
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Grant</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="hidden md:table-cell">
              Status
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="hidden md:table-cell">
              Created
            </Table.ColumnHeaderCell>
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
    </div>
  );
};

export const dynamic = "force-dynamic";

export default GrantsPage;
