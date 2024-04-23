import { GrantStatusBadge } from "@/app/components";
import { Button, Flex } from "@radix-ui/themes";
import Link from "next/link";
import React from "react";
import GrantStatusFilter from "./GrantStatusFilter";

const GrantActions = () => {
  return (
    <Flex justify="between">
      <GrantStatusFilter />
      <Button>
        <Link href="/grants/new">New Grant</Link>
      </Button>
    </Flex>
  );
};

export default GrantActions;
