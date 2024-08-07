"use client";
import { fetchAllUsers } from "@/lib/actions/user/queries";
import { UserWithDepartment } from "@/prisma/customTypes";
import { Select, SelectItem, SelectSection, useUser } from "@nextui-org/react";
import { OSDepartmentShortName, User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import Skeleton from "react-loading-skeleton";

interface Props {
  users: UserWithDepartment[];
}

const GroupLeaderFilter = ({ users }: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();

  // const users = await fetchAllUsers();
  // const { data: users, error } = useUsersWithDepartment();

  if (!session) return null;

  // If a groupleader logged in, filter by group leader
  if (session?.user.role === "GROUPLEADER") {
    return (
      <Select
        label="Filter by group leader...."
        className="max-w-xs"
        // defaultSelectedKeys={[session.user.id]}
        selectedKeys={[session.user.id]}
      >
        <SelectItem
          key={session.user.id}
          value={session.user.id}
          textValue={session.user.lastName ?? ""}
        >
          {session.user.lastName}
        </SelectItem>
      </Select>
    );
  }

  if (!users) return <Skeleton />;

  // Filter the users based on their department's shortname
  // const departmentShortNames: string[] = Object.values(OSDepartmentShortName);
  // const departmentUsersObject: Record<string, UserWithDepartment[]> = {};

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

  users.forEach((user) => {
    // console.log("user: ", user.relatedDepartment);

    // const department = user.relatedDepartment?.nameShort;
    const department = user.relatedDepartment?.nameShort; //not a string
    // console.log("department: ", department);

    // // Create an array for the department if it doesn't exist
    // if (department && !departmentUsersObject[department]) {
    //   departmentUsersObject[department] = [];
    // }

    // Add the user to the corresponding department array - only if the user is a groupleader
    if (department && user.role === "GROUPLEADER") {
      departmentUsersObject[department].push(user);
    }
  });

  return (
    <Select
      items={departmentShortNames as Iterable<object>}
      label="Filter by group leader...."
      className="max-w-xs"
      defaultSelectedKeys={[searchParams.get("groupLeader") || "All"]}
      onChange={(event) => {
        const groupLeader = event.target.value;
        // console.log("groupLeader: ", groupLeader);
        const params = new URLSearchParams(searchParams);

        if (groupLeader) params.set("groupLeader", groupLeader);
        else params.delete("groupLeader");
        // console.log("params: ", params.toString());

        const query = params.size ? "?" + params.toString() : "";

        // router.push("/dashboard/grants/list" + query);
        // Add 'pathname' instead of explicitly adding it so that this comp can be added to all pages;
        router.push(pathname + query);
      }}
    >
      <SelectSection title="All" showDivider>
        <SelectItem key="All" value="All" textValue="All">
          All
        </SelectItem>
      </SelectSection>

      <SelectSection title={departmentShortNames[0]} showDivider>
        {departmentUsersObject[departmentShortNames[0]].map((user) => (
          <SelectItem
            key={user.id}
            value={user.id}
            textValue={user.lastName ?? ""}
          >
            {user.lastName}
          </SelectItem>
        ))}
      </SelectSection>
      <SelectSection title={departmentShortNames[1]} showDivider>
        {departmentUsersObject[departmentShortNames[1]].map((user) => (
          <SelectItem
            key={user.id}
            value={user.id}
            textValue={user.lastName ?? ""}
          >
            {user.lastName}
          </SelectItem>
        ))}
      </SelectSection>
      <SelectSection title={departmentShortNames[2]} showDivider>
        {departmentUsersObject[departmentShortNames[2]].map((user) => (
          <SelectItem
            key={user.id}
            value={user.id}
            textValue={user.lastName ?? ""}
          >
            {user.lastName}
          </SelectItem>
        ))}
      </SelectSection>

      {/* This works fine but gives TS error - instead render each dept's user separately above */}
      {/* {departmentShortNames.map((department) => (
        <SelectSection key={department} title={department} showDivider>
          {departmentUsersObject[department].map((user) => (
            <SelectItem
              key={user.id}
              value={user.id}
              textValue={user.lastName ?? ""}
            >
              {user.lastName}
            </SelectItem>
          ))}
        </SelectSection>
      ))} */}

      {/* <SelectSection title="Individual">
        {users.map((user) => (
          <SelectItem
            key={user.id}
            value={user.id}
            textValue={user.lastName ?? ""}
          >
            {user.lastName}
          </SelectItem>
        ))}
      </SelectSection> */}
    </Select>
  );
};

const useUsersWithDepartment = () =>
  useQuery<UserWithDepartment[]>({
    queryKey: ["usersWithDepartment"],
    queryFn: () =>
      axios.get("/api/users/withdepartment").then((res) => res.data),
    staleTime: 60 * 1000, //60s
    retry: 3,
  });

export default GroupLeaderFilter;
