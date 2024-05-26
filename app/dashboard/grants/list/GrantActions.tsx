import { GrantStatusBadge } from "@/app/components";
import { Button, Flex } from "@radix-ui/themes";
import Link from "next/link";
import React from "react";
import GrantStatusFilter from "./GrantStatusFilter";
import DepartmentFilter from "./DepartmentFilter";
import GroupLeaderFilter from "./GroupLeaderFilter";

const GrantActions = () => {
  return (
    <Flex justify="between" gap="3">
      <GrantStatusFilter />
      <DepartmentFilter />
      <GroupLeaderFilter />
      <Button>
        <Link href="/dashboard/grants/new">New Grant</Link>
      </Button>
    </Flex>
  );
};

export default GrantActions;
