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
  // console.log("searchParams: ", searchParams.toString());
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();

  let departmentOptions = departments.map((dept) => ({
    label: dept,
    value: dept,
  }));

  if (!session) return null;

  // console.log("Session user: ", session.user);
  // console.log("Department : ", session.user.relatedDepartment?.nameShort);

  // If a groupleader logged in, Show the corresponding dept, not all depts;
  if (session.user.role === "GROUPLEADER") {
    departmentOptions = departmentOptions.filter(
      (dept) =>
        dept.value && dept.value === session.user.relatedDepartmentNameShort,
    );
  }
  // console.log("Departments: ", departments);

  const handleValueChange = (value: string) => {
    const queryString = updateFilterQueryParams({
      searchParams,
      paramName: "department",
      value,
    });

    // router.push(`/dashboard/grants/list${query}`);
    // Add 'pathname' instead of explicitly adding it so that this comp can be added to all pages;
    router.push(`${pathname}${queryString}`);
  };

  const defaultValueSelect =
    session.user.role === "GROUPLEADER"
      ? session.user.relatedDepartmentNameShort // `undefined` is acceptable
      : searchParams.get("department") || "All"; // `null` is not acceptable for defaultValue prop;

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
