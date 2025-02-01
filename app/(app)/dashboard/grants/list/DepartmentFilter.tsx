"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { OSDepartmentShortName } from "@prisma/client";
import { useSession } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

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
    // console.log("Value: ", value);

    const params = new URLSearchParams(searchParams);
    if (value === "All") {
      params.delete("department");
    } else {
      params.set("department", value);
    }

    const queryString = "?" + params.toString();

    // router.push(`/dashboard/grants/list${query}`);
    // Add 'pathname' instead of explicitly adding it so that this comp can be added to all pages;
    router.push(`${pathname}${queryString}`);
  };

  const defaultValueSelect =
    session.user.role === "GROUPLEADER"
      ? session.user.relatedDepartmentNameShort // `undefined` is acceptable
      : searchParams.get("department") || "All"; // `null` is not acceptable for defaultValue prop;

  return (
    <div className="flex min-w-[200px] flex-col gap-2">
      <Label htmlFor="department">Filter by department</Label>
      <Select
        onValueChange={handleValueChange}
        defaultValue={defaultValueSelect}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select department" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All</SelectItem>
          {departmentOptions.map((dept) => (
            <SelectItem key={dept.value} value={dept.value}>
              {dept.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default DepartmentFilter;
