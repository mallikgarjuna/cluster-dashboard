"use client";
import { Select, SelectItem } from "@nextui-org/react";
import { OSDepartmentShortName } from "@prisma/client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";

const departShortNames = Object.values(OSDepartmentShortName);
const departments: { label: string; value?: OSDepartmentShortName }[] = [
  { label: "All depts" },
  { label: "BBT dept", value: "BBT" },
  { label: "BMS dept", value: "BMS" },
  { label: "ERIBA dept", value: "ERIBA" },
];

const DepartmentFilter = () => {
  const searchParams = useSearchParams();
  // console.log("searchParams: ", searchParams.toString());
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Select
      label="Filter by department..."
      defaultSelectedKeys={[searchParams.get("department") || "All"]}
      onChange={(event) => {
        const department = event.target.value;
        // console.log("department: ", department);
        const params = new URLSearchParams(searchParams.toString());

        if (department) params.set("department", department);
        else params.delete("department");
        // console.log("params: ", params.toString());

        const query = params.size ? "?" + params.toString() : "";
        // console.log("query: ", query);

        // router.push(`/dashboard/grants/list${query}`);
        // Add 'pathname' instead of explicitly adding it so that this comp can be added to all pages;
        router.push(`${pathname}${query}`);
      }}
      className="max-w-xs"
    >
      {departments.map((department) => (
        <SelectItem
          key={department.value || "All"}
          value={department.value || "All"}
          textValue={department.label}
        >
          {department.label}
        </SelectItem>
      ))}
    </Select>
  );
};

export default DepartmentFilter;
