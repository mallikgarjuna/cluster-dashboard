"use client";

import { StatusGrant } from "@prisma/client";
import { Select } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import React from "react";

const statuses: { label: string; value?: StatusGrant }[] = [
  { label: "All" },
  { label: "Awarded", value: "AWARDED" },
  { label: "Deleted", value: "DELETED" },
  { label: "Draft", value: "DRAFT" },
  { label: "Ended project", value: "ENDED_PROJECT" },
  { label: "Rejected", value: "REJECTED" },
  { label: "Running project", value: "RUNNING_PROJECT" },
  { label: "Submitted", value: "SUBMITTED" },
];

const GrantStatusFilter = () => {
  const router = useRouter();

  return (
    <Select.Root
      onValueChange={(status) => {
        const query = status === "All" ? "" : `?status=${status}`;
        router.push("/grants/list" + query);
      }}
    >
      <Select.Trigger placeholder="Filter by status..." />
      <Select.Content>
        {statuses.map((status) => (
          <Select.Item
            key={status.value || "All"}
            value={status.value || "All"}
          >
            {status.label}
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  );
};

export default GrantStatusFilter;
