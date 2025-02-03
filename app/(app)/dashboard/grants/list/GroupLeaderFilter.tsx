"use client";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserWithDepartment } from "@/prisma/customTypes";
// import { Select, SelectItem, SelectSection } from "@nextui-org/react";
import { OSDepartmentShortName } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Skeleton from "react-loading-skeleton";

interface Props {
  groupLeaders: UserWithDepartment[];
}

const GroupLeaderFilter = ({ groupLeaders }: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();

  // const users = await fetchAllUsers();
  // const { data: users, error } = useUsersWithDepartment();

  if (!session) return null;

  // // If a groupleader logged in, filter by group leader
  // if (session?.user.role === "GROUPLEADER") {
  //   return (
  //     <Select
  //       label="Filter by group leader...."
  //       className="max-w-xs"
  //       // defaultSelectedKeys={[session.user.id]}
  //       selectedKeys={[session.user.id]}
  //     >
  //       <SelectItem
  //         key={session.user.id}
  //         value={session.user.id}
  //         textValue={session.user.lastName ?? ""}
  //       >
  //         {session.user.lastName}
  //       </SelectItem>
  //     </Select>
  //   );
  // }

  if (!groupLeaders) return <Skeleton />;

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

  groupLeaders.forEach((user) => {
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

  const handleValueChange = (value: string) => {
    // console.log("groupLeader value: ", value);

    const params = new URLSearchParams(searchParams);

    if (value === "All") {
      params.delete("groupLeader");
    } else {
      params.set("groupLeader", value);
    }

    const queryString = params.size ? "?" + params.toString() : "";

    router.push(pathname + queryString);
  };

  // If a groupleader logged in, filter by group leader
  const defaultValueSelect =
    session.user.role === "GROUPLEADER"
      ? session.user.id
      : searchParams.get("groupLeader") || "All";

  return (
    <div className="flex min-w-[200px] max-w-xs flex-col gap-2">
      <Label>Filter by group leader</Label>
      <Select
        onValueChange={handleValueChange}
        defaultValue={defaultValueSelect}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a group leader" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All</SelectItem>

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
        </SelectContent>
      </Select>
    </div>
  );

  // return (
  //   <Select
  //     items={departmentShortNames as Iterable<object>}
  //     label="Filter by group leader...."
  //     className="max-w-xs"
  //     defaultSelectedKeys={[searchParams.get("groupLeader") || "All"]}
  //     onChange={(event) => {
  //       const groupLeader = event.target.value;
  //       // console.log("groupLeader: ", groupLeader);
  //       const params = new URLSearchParams(searchParams);

  //       if (groupLeader) params.set("groupLeader", groupLeader);
  //       else params.delete("groupLeader");
  //       // console.log("params: ", params.toString());

  //       const query = params.size ? "?" + params.toString() : "";

  //       // router.push("/dashboard/grants/list" + query);
  //       // Add 'pathname' instead of explicitly adding it so that this comp can be added to all pages;
  //       router.push(pathname + query);
  //     }}
  //     scrollShadowProps={{ isEnabled: false }}
  //     showScrollIndicators={true}
  //     listboxProps={{
  //       className: "max-h-[300px] overflow-y-auto ",
  //     }}
  //   >
  //     <SelectSection title="All" showDivider>
  //       <SelectItem key="All" value="All" textValue="All">
  //         All
  //       </SelectItem>
  //     </SelectSection>

  //     <SelectSection title={departmentShortNames[0]} showDivider>
  //       {departmentUsersObject[departmentShortNames[0]].map((user) => (
  //         <SelectItem
  //           key={user.id}
  //           value={user.id}
  //           textValue={user.lastName ?? ""}
  //         >
  //           {user.lastName}
  //         </SelectItem>
  //       ))}
  //     </SelectSection>
  //     <SelectSection title={departmentShortNames[1]} showDivider>
  //       {departmentUsersObject[departmentShortNames[1]].map((user) => (
  //         <SelectItem
  //           key={user.id}
  //           value={user.id}
  //           textValue={user.lastName ?? ""}
  //         >
  //           {user.lastName}
  //         </SelectItem>
  //       ))}
  //     </SelectSection>
  //     <SelectSection title={departmentShortNames[2]} showDivider>
  //       {departmentUsersObject[departmentShortNames[2]].map((user) => (
  //         <SelectItem
  //           key={user.id}
  //           value={user.id}
  //           textValue={user.lastName ?? ""}
  //         >
  //           {user.lastName}
  //         </SelectItem>
  //       ))}
  //     </SelectSection>

  //     {/* This works fine but gives TS error - instead render each dept's user separately above */}
  //     {/* {departmentShortNames.map((department) => (
  //       <SelectSection key={department} title={department} showDivider>
  //         {departmentUsersObject[department].map((user) => (
  //           <SelectItem
  //             key={user.id}
  //             value={user.id}
  //             textValue={user.lastName ?? ""}
  //           >
  //             {user.lastName}
  //           </SelectItem>
  //         ))}
  //       </SelectSection>
  //     ))} */}

  //     {/* <SelectSection title="Individual">
  //       {users.map((user) => (
  //         <SelectItem
  //           key={user.id}
  //           value={user.id}
  //           textValue={user.lastName ?? ""}
  //         >
  //           {user.lastName}
  //         </SelectItem>
  //       ))}
  //     </SelectSection> */}
  //   </Select>
  // );
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
