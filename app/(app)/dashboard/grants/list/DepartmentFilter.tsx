"use client";

import { updateFilterQueryParams } from "@/lib/utils";
import { OSDepartmentShortName } from "@prisma/client";
import { useSession } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import FilterSelectField from "./FilterSelectField";

type DepartmentFilterProps = {
  departments: OSDepartmentShortName[];
};

const DepartmentFilter = ({ departments }: DepartmentFilterProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();

  let departmentOptions = departments.map((dept) => ({
    label: dept,
    value: dept,
  }));

  if (!session) return null;

  // If a group leader is logged in, only show their department.
  if (session.user.role === "GROUPLEADER") {
    departmentOptions = departmentOptions.filter(
      (dept) =>
        dept.value && dept.value === session.user.relatedDepartmentNameShort,
    );
  }

  const handleValueChange = (value: string) => {
    const queryString = updateFilterQueryParams({
      searchParams,
      paramName: "department",
      value,
    });

    router.push(`${pathname}${queryString}`);
  };

  const defaultValueSelect =
    session.user.role === "GROUPLEADER"
      ? session.user.relatedDepartmentNameShort
      : searchParams.get("department") || "All";

  return (
    <FilterSelectField
      label="Filter by department"
      placeholder="Select department"
      onValueChange={handleValueChange}
      defaultValue={defaultValueSelect}
      options={departmentOptions}
    />
  );
};

export default DepartmentFilter;
