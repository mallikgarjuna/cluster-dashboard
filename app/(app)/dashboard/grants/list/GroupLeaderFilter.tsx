"use client";

import {
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
} from "@/components/ui/select";
import { updateFilterQueryParams } from "@/lib/utils";
import { UserWithDepartment } from "@/prisma/customTypes";
import { OSDepartmentShortName } from "@prisma/client";
import { useSession } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Skeleton from "react-loading-skeleton";
import FilterSelectField from "./FilterSelectField";

interface Props {
  groupLeaders: UserWithDepartment[];
}

const GroupLeaderFilter = ({ groupLeaders }: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();

  if (!session) return null;

  if (!groupLeaders) return <Skeleton />;

  const departmentShortNames = Object.values(OSDepartmentShortName);
  // console.log("departmentShortNames: ", departmentShortNames);

  const departmentUsersObject: Record<
    OSDepartmentShortName,
    UserWithDepartment[]
  > = departmentShortNames.reduce(
    (obj, department) => {
      obj[department] = [];
      return obj;
    },
    {} as Record<OSDepartmentShortName, UserWithDepartment[]>,
  );

  // console.log("departmentUsersObject: ", departmentUsersObject);

  groupLeaders.forEach((user) => {
    // console.log("user: ", user.relatedDepartment);

    const department = user.relatedDepartment?.nameShort; //not a string
    // console.log("department: ", department);

    // Add the user to the corresponding department array - only if the user is a groupleader
    if (department && user.role === "GROUPLEADER") {
      departmentUsersObject[department].push(user);
    }
  });

  const handleValueChange = (value: string) => {
    const queryString = updateFilterQueryParams({
      searchParams,
      paramName: "groupLeader",
      value,
    });

    router.push(pathname + queryString);
  };

  // If a groupleader logged in, filter by group leader
  const defaultValueSelect =
    session.user.role === "GROUPLEADER"
      ? session.user.id
      : searchParams.get("groupLeader") || "All";

  return (
    <FilterSelectField
      label="Filter by group leader"
      placeholder="Select a group leader"
      onValueChange={handleValueChange}
      defaultValue={defaultValueSelect}
    >
      <SelectSeparator className="m-[5px] h-px bg-zinc-300" />

      <SelectGroup>
        <SelectLabel>{departmentShortNames[0]}</SelectLabel>
        {departmentUsersObject[departmentShortNames[0]].map((user) => (
          <SelectItem key={user.id} value={user.id}>
            {user.lastName}
          </SelectItem>
        ))}
      </SelectGroup>

      <SelectSeparator className="m-[5px] h-px bg-zinc-300" />

      <SelectGroup>
        <SelectLabel>{departmentShortNames[1]}</SelectLabel>
        {departmentUsersObject[departmentShortNames[1]].map((user) => (
          <SelectItem key={user.id} value={user.id}>
            {user.lastName}
          </SelectItem>
        ))}
      </SelectGroup>

      <SelectSeparator className="m-[5px] h-px bg-zinc-300" />

      <SelectGroup>
        <SelectLabel>{departmentShortNames[2]}</SelectLabel>
        {departmentUsersObject[departmentShortNames[2]].map((user) => (
          <SelectItem key={user.id} value={user.id}>
            {user.lastName}
          </SelectItem>
        ))}
      </SelectGroup>
    </FilterSelectField>
  );
};

export default GroupLeaderFilter;
