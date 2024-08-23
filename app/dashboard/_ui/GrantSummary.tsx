import { StatusGrant } from "@prisma/client";
import { Card, Flex, Text } from "@radix-ui/themes";
import Link from "next/link";
import React from "react";
import { GrantQuery } from "../grants/list/GrantTable";
import classNames from "classnames";

interface Props {
  awaiting: number;
  submitted: number;
  awarded: number;
  rejected: number;
  searchParams: GrantQuery;
}

const GrantSummary = ({
  awaiting,
  submitted,
  awarded,
  rejected,
  searchParams,
}: Props) => {
  const containers: {
    label: string;
    value: number;
    status: StatusGrant | "All";
    isClickable?: boolean;
  }[] = [
    {
      label: "Total Submitted Grants",
      value: submitted,
      status: "SUBMITTED",
      isClickable: false,
    },
    {
      label: "Awaiting results",
      value: awaiting,
      status: "SUBMITTED",
      isClickable: true,
    },
    {
      label: "Total Awarded Grants",
      value: awarded,
      status: "AWARDED",
      isClickable: false,
    },
    {
      label: "Rejected Grants",
      value: rejected,
      status: "REJECTED",
      isClickable: true,
    },
  ];

  return (
    <Flex gap="4" justify="between">
      {containers.map((container) => (
        <Card
          key={container.label}
          className={classNames({ "hover:bg-zinc-200": container.isClickable })}
        >
          <Flex direction="column" gap="1">
            <Link
              className={classNames({
                "text-sm font-medium": true,
                "pointer-events-none": !container.isClickable,
              })}
              // href={`/dashboard/grants/list?status=${container.status}`} // TODO: add appropriate query params
              href={{
                pathname: "/dashboard/grants/list",
                query: {
                  ...searchParams,
                  status: container.status,
                },
              }}
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
