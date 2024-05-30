import { StatusGrant } from "@prisma/client";
import { Card, Flex, Text } from "@radix-ui/themes";
import Link from "next/link";
import React from "react";

interface Props {
  awaiting: number;
  submitted: number;
  awarded: number;
  rejected: number;
}

const GrantSummary = ({ awaiting, submitted, awarded, rejected }: Props) => {
  const containers: {
    label: string;
    value: number;
    status: StatusGrant | "All";
  }[] = [
    { label: "Submitted Grants", value: submitted, status: "SUBMITTED" },
    { label: "Awaiting results", value: awaiting, status: "SUBMITTED" },
    { label: "Awarded Grants", value: awarded, status: "AWARDED" },
    { label: "Rejected Grants", value: rejected, status: "REJECTED" },
  ];

  return (
    <Flex gap="4" justify="between">
      {containers.map((container) => (
        <Card key={container.label}>
          <Flex direction="column" gap="1">
            <Link
              className="text-sm font-medium"
              href={`/dashboard/grants/list?status=${container.status}`} // TODO: add appropriate query params
            >
              {container.label}
            </Link>
            <Text size="5" className="font-bold">
              {container.value}
            </Text>
          </Flex>
        </Card>
      ))}
    </Flex>
  );
};

export default GrantSummary;
