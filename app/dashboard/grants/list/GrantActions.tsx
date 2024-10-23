import { GrantStatusBadge } from "@/app/components";
import { Button, Flex } from "@radix-ui/themes";
import Link from "next/link";
import React from "react";
import GrantStatusFilter from "./GrantStatusFilter";
import DepartmentFilter from "./DepartmentFilter";
import GroupLeaderFilter from "./GroupLeaderFilter";
import GrantStartYearFilter from "./GrantStartYearFilter";
import prisma from "@/prisma/client";
import ButtonWithSpinner from "./ButtonWithSpinner";
import GrantSubmissionYearFilter from "./GrantSubmissionYearFilter";
import dynamic from "next/dynamic";

const DynamicGrantStatusFilter = dynamic(
  () => import("@/app/dashboard/grants/list/GrantStatusFilter"),
  { ssr: false, loading: () => <div>Loading...</div> },
);
const DynamicDepartmentFilter = dynamic(
  () => import("@/app/dashboard/grants/list/DepartmentFilter"),
  { ssr: false, loading: () => <div>Loading...</div> },
);
const DynamicGroupLeaderFilter = dynamic(
  () => import("@/app/dashboard/grants/list/GroupLeaderFilter"),
  { ssr: false, loading: () => <div>Loading...</div> },
);
const DynamicGrantStartYearFilter = dynamic(
  () => import("@/app/dashboard/grants/list/GrantStartYearFilter"),
  { ssr: false, loading: () => <div>Loading...</div> },
);
const DynamicGrantSubmissionYearFilter = dynamic(
  () => import("@/app/dashboard/grants/list/GrantSubmissionYearFilter"),
  { ssr: false, loading: () => <div>Loading...</div> },
);

const DynamicFundingAgencyFilter = dynamic(
  () => import("@/app/dashboard/grants/list/FundingAgencyFilter"),
  { ssr: false, loading: () => <div>Loading...</div> },
);

const DynamicFundingProgrammeFilter = dynamic(
  () => import("@/app/dashboard/grants/list/FundingProgrammeFilter"),
  { ssr: false, loading: () => <div>Loading...</div> },
);

const DynamicFundingActionFilter = dynamic(
  () => import("@/app/dashboard/grants/list/FundingActionFilter"),
  { ssr: false, loading: () => <div>Loading...</div> },
);

const DynamicFundingCallFilter = dynamic(
  () => import("@/app/dashboard/grants/list/FundingCallFilter"),
  { ssr: false, loading: () => <div>Loading...</div> },
);

const GrantActions = async () => {
  const usersWithDepartment = await prisma.user.findMany({
    where: { role: "GROUPLEADER" },
    orderBy: { lastName: "asc" },
    include: { relatedDepartment: true },
  });

  return (
    <Flex direction="column" gap="3">
      <Flex justify="between" gap="3" align="center">
        <DynamicGrantStatusFilter />
        <DynamicDepartmentFilter />
        <DynamicGroupLeaderFilter users={usersWithDepartment} />
        <DynamicGrantStartYearFilter />
        <DynamicGrantSubmissionYearFilter />
        {/* <Button>
        <Link href="/dashboard/grants/new">New Grant</Link>
      </Button> */}
        <ButtonWithSpinner hrefProp="/dashboard/grants/new" name="New Grant" />
      </Flex>
      <Flex justify="between" gap="3" align="center">
        <DynamicFundingAgencyFilter />
        <DynamicFundingProgrammeFilter />
        <DynamicFundingActionFilter />
        <DynamicFundingCallFilter />
      </Flex>
    </Flex>
  );
};

export default GrantActions;
