import { Button, Table } from "@radix-ui/themes";
import Link from "next/link";
import React from "react";
import prisma from "@/prisma/client";
import GrantStatusBadge from "../components/GrantStatusBadge";

const GrantsPage = async () => {
  const grants = await prisma.grant.findMany();

  return (
    <div>
      <div className="mb-5">
        <Button>
          <Link href="/grants/new">New Grant</Link>
        </Button>
      </div>
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
                {grant.title}
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

export default GrantsPage;
