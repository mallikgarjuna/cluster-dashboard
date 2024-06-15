import { GrantStatusBadge } from "@/app/components";
import { Button, Flex } from "@radix-ui/themes";
import Link from "next/link";
import React from "react";
import GrantStatusFilter from "./GrantStatusFilter";
import DepartmentFilter from "./DepartmentFilter";
import GroupLeaderFilter from "./GroupLeaderFilter";
import GrantStartYearFilter from "./GrantStartYearFilter";
import prisma from "@/prisma/client";

const GrantActions = async () => {
  const usersWithDepartment = await prisma.user.findMany({
    where: { role: "GROUPLEADER" },
    orderBy: { lastName: "asc" },
    include: { relatedDepartment: true },
  });

  return (
    <Flex justify="between" gap="3">
      <GrantStatusFilter />
      <DepartmentFilter />
      <GroupLeaderFilter users={usersWithDepartment} />
      <GrantStartYearFilter />
      <Button>
        <Link href="/dashboard/grants/new">New Grant</Link>
      </Button>
    </Flex>
  );
};

export default GrantActions;
