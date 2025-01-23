"use client";

import { GrantStatusBadge } from "@/app/components";
import { GrantWithUser } from "@/prisma/customTypes";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { Button, Flex, Table } from "@radix-ui/themes";
import Link from "next/link";

interface Props {
  latestGrants: GrantWithUser[];
}

const LatestGrants = ({ latestGrants }: Props) => {
  // const session = await checkAuth();

  return (
    <Card>
      <CardHeader className="pb-0">
        <h1 className="text-3xl font-bold">Latest Grants</h1>
      </CardHeader>
      <CardBody>
        <Table.Root>
          <Table.Body>
            {latestGrants.map((grant) => (
              <Table.Row
                key={grant.id}
                className="transition-colors hover:bg-gray-200"
              >
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
      </CardBody>
    </Card>
  );
};

export default LatestGrants;
