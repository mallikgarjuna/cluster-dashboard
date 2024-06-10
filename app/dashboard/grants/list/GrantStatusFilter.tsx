"use client";

import { Select, SelectItem } from "@nextui-org/react";
import { StatusGrant } from "@prisma/client";
// import { Select } from "@radix-ui/themes";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
  const searchParams = useSearchParams();
  const pathname = usePathname();

  return (
    <Select
      label="Filter by status..."
      defaultSelectedKeys={[searchParams.get("status") || "All"]}
      onChange={(event) => {
        const status = event.target.value;
        // const params = new URLSearchParams();
        // if (status !== "All") params.append("status", status);
        // if (searchParams.get("orderBy"))
        //   params.append("orderBy", searchParams.get("orderBy")!);
        // if (searchParams.get("sortOrder"))
        //   params.append("sortOrder", searchParams.get("sortOrder")!);

        // Instead of creating empty query string, create one from existing 'searchParams' obj;
        const params = new URLSearchParams(searchParams);

        if (status) params.set("status", status);
        else params.delete("status");

        // add '?' only if we have at least one param
        const query = params.size ? "?" + params.toString() : "";
        // const query = status === "All" ? "" : `?status=${status}`;

        // router.push("/dashboard/grants/list" + query);
        // Add 'pathname' instead of explicitly adding it so that this comp can be added to all pages;
        router.push(pathname + query);
      }}
      className="max-w-xs"
    >
      {statuses.map((status) => (
        <SelectItem
          key={status.value || "All"}
          value={status.value || "All"}
          textValue={status.label}
        >
          {status.label}
        </SelectItem>
      ))}
    </Select>
  );
};

export default GrantStatusFilter;
