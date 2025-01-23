"use client";
import { Select, SelectItem } from "@nextui-org/react";
import { OSDepartmentShortName } from "@prisma/client";
import { useSession } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const departShortNames = Object.values(OSDepartmentShortName);
let departments: { label: string; value?: OSDepartmentShortName }[] = [
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
  const { data: session, status } = useSession();

  if (!session) return null;

  // console.log("Session user: ", session.user);
  // console.log("Department : ", session.user.relatedDepartment?.nameShort);

  // If a groupleader logged in, Show the corresponding dept, not all depts;
  if (session.user.role === "GROUPLEADER") {
    departments = departments.filter(
      (dept) =>
        dept.value && dept.value === session.user.relatedDepartment?.nameShort,
    );

    // defaultSelectedKeys = []
  }
  // console.log("Departments: ", departments);

  return (
    <Select
      label="Filter by department..."
      defaultSelectedKeys={[
        session.user.role === "GROUPLEADER"
          ? session.user.relatedDepartment?.nameShort || "All"
          : searchParams.get("department") || "All",
      ]}
      selectedKeys={[
        session.user.role === "GROUPLEADER"
          ? session.user.relatedDepartment?.nameShort || "All"
          : searchParams.get("department") || "All",
      ]}
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
