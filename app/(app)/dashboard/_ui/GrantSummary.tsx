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
      <CardHeader className="pb-2">
        <p className="text-sm font-medium uppercase tracking-[0.14em] text-[var(--color-primary)]">
          Overview
        </p>
      </CardHeader>
      <Flex gap="4" justify="between" wrap="wrap">
        {containers.map((container) => (
          <Card
            key={container.label}
            className={classNames({
              "my-1 min-w-[180px] flex-1 border-[#E8E8EC] bg-[var(--color-surface-muted)] shadow-none transition-all duration-200": true,
              "hover:-translate-y-px hover:bg-white hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]": container.isClickable,
            })}
          >
            <CardHeader className="space-y-2 pb-2">
              <Link
                className={classNames({
                  "text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]": true,
                  "pointer-events-none": !container.isClickable,
                  "hover:text-[var(--color-primary)]": container.isClickable,
                })}
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
              <Text
                size="5"
                className="font-display font-bold tracking-[-0.04em] text-[var(--color-text-primary)]"
              >
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
