import React from "react";
import prisma from "@/prisma/client";
import { Button, Card, Flex, Heading, Table } from "@radix-ui/themes";
import { GrantStatusBadge } from "./components";
import Link from "next/link";
import { getServerSession } from "next-auth";
import authOptions from "./auth/authOptions";

const LatestGrants = async () => {
  const session = await getServerSession(authOptions);

  const groupLeader =
    session?.user.role === "GROUPLEADER"
      ? [{ assignedToUser: { id: session?.user.id } }]
      : [{}];

  const grants = await prisma.grant.findMany({
    where: {
      AND: [...groupLeader],
    },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      assignedToUser: true,
    },
  });

  return (
    <Card>
      <Heading size="4" mb="3">
        Latest Grants
      </Heading>
      <Table.Root>
        <Table.Body>
          {grants.map((grant) => (
            <Table.Row key={grant.id}>
              <Table.Cell>
                <Flex justify="between">
                  <Flex direction="column" gap="2" align="start">
                    <Link href={`/dashboard/grants/${grant.id}`}>
                      {grant.title}
                    </Link>
                    <GrantStatusBadge status={grant.status} />
                  </Flex>
                  {grant.assignedToUser && (
                    <Button>{grant.assignedToUser?.email}</Button>
                  )}
                </Flex>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Card>
  );
};

export default LatestGrants;
