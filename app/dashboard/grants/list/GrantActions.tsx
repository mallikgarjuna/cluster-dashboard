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

const GrantActions = async () => {
  const usersWithDepartment = await prisma.user.findMany({
    where: { role: "GROUPLEADER" },
    orderBy: { lastName: "asc" },
    include: { relatedDepartment: true },
  });

  return (
    <Flex justify="between" gap="3" align="center">
      <GrantStatusFilter />
      <DepartmentFilter />
      <GroupLeaderFilter users={usersWithDepartment} />
      <GrantStartYearFilter />
      <GrantSubmissionYearFilter />
      {/* <Button>
        <Link href="/dashboard/grants/new">New Grant</Link>
      </Button> */}
      <ButtonWithSpinner hrefProp="/dashboard/grants/new" name="New Grant" />
    </Flex>
  );
};

export default GrantActions;
