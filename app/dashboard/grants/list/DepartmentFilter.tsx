"use client";
import { Select, SelectItem } from "@nextui-org/react";
import { OSDepartmentShortName } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";
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
  const router = useRouter();

  return (
    <Select
      label="Filter by department..."
      defaultSelectedKeys={[searchParams.get("department") || "All"]}
      onChange={(event) => {
        const department = event.target.value;
        // console.log("department: ", department);
        const params = new URLSearchParams(searchParams);
        // console.log("params: ", params);
        if (department) params.set("department", department);

        const query = params.size ? "?" + params.toString() : "";
        // console.log("query: ", query);
        router.push(`/dashboard/grants/list${query}`);
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
