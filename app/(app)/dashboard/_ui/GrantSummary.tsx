"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { StatusGrant } from "@prisma/client";
import { Flex, Text } from "@radix-ui/themes";
import classNames from "classnames";
import Link from "next/link";
import { GrantQuery } from "../grants/list/GrantTable";

interface Props {
  awaiting: number;
  submitted: number;
  awarded: number;
  rejected: number;
  successRate: number;
  funding: number;
  fundingAppliedFor: number;
  searchParams: GrantQuery;
}

const GrantSummary = ({
  awaiting,
  submitted,
  awarded,
  rejected,
  successRate,
  funding,
  fundingAppliedFor,
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
      label: "Awarded Grants",
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
    {
      label: "Success Rate (%)",
      value: successRate,
      status: "AWARDED",
      isClickable: true,
    },
    {
      label: "Funding Applied For (€)",
      value: fundingAppliedFor,
      status: "SUBMITTED",
      isClickable: true,
    },
    {
      label: "Funding Awarded (€)",
      value: funding,
      status: "AWARDED",
      isClickable: false,
    },
  ];

  return (
    <Card className="p-4">
      <Flex gap="4" justify="between">
        {containers.map((container) => (
          <Card
            key={container.label}
            className={classNames({
              "my-1 flex-1 bg-zinc-50": true,
              "hover:bg-zinc-400": container.isClickable,
            })}
          >
            <CardHeader className="pb-2">
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
            </CardHeader>
            <CardContent className="pt-0">
              <Text size="5" className="font-bold">
                {container.value}
              </Text>
            </CardContent>
          </Card>
        ))}
      </Flex>
    </Card>
  );
};

export default GrantSummary;
