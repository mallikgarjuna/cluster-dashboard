"use client";

import { GrantStatusBadge } from "@/app/components";
import { GrantWithUser } from "@/prisma/customTypes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Flex, Table } from "@radix-ui/themes";
import Link from "next/link";

interface Props {
  latestGrants: GrantWithUser[];
}

const LatestGrants = ({ latestGrants }: Props) => {
  // const session = await checkAuth();

  return (
    <Card>
      <CardHeader className="space-y-2 pb-2">
        <p className="text-sm font-medium uppercase tracking-[0.14em] text-[var(--color-primary)]">
          Recent Activity
        </p>
        <h1 className="font-display text-3xl font-bold tracking-[-0.04em] text-[var(--color-text-primary)]">
          Latest Grants
        </h1>
      </CardHeader>
      <CardContent>
        <Table.Root
          variant="surface"
          size="1"
          className="rounded-xl border border-[var(--color-border)] bg-white"
        >
          <Table.Body>
            {latestGrants.map((grant) => (
              <Table.Row
                key={grant.id}
                className="transition-colors duration-200 hover:bg-[var(--color-surface-muted)]"
              >
                <Table.Cell>
                  <Flex justify="between">
                    <Flex direction="column" gap="2" align="start">
                      <Link
                        href={`/dashboard/grants/${grant.id}`}
                        className="font-medium text-[var(--color-text-primary)] transition-colors duration-200 hover:text-[var(--color-primary)]"
                      >
                        {grant.title}
                      </Link>
                      <GrantStatusBadge status={grant.status} />
                    </Flex>
                    {grant.assignedToUser && (
                      <Button
                        variant="outline"
                        className="min-w-40 justify-center border-[var(--color-border)] text-[var(--color-text-secondary)]"
                      >
                        {grant.assignedToUser?.email}
                      </Button>
                    )}
                  </Flex>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </CardContent>
    </Card>
  );
};

export default LatestGrants;
