import { Button, Table } from "@radix-ui/themes";
// import Link from "next/link";
import Link from "../components/Link";
import React from "react";
import prisma from "@/prisma/client";
import GrantStatusBadge from "../components/GrantStatusBadge";
import delay from "delay";
import GrantActions from "./GrantActions";

const GrantsPage = async () => {
  const grants = await prisma.grant.findMany();
  await delay(2000);

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

export default GrantsPage;
