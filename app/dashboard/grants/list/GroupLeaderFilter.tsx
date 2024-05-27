"use client";
import { fetchAllUsers } from "@/lib/actions/user/queries";
import { Select, SelectItem, SelectSection, useUser } from "@nextui-org/react";
import { User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import Skeleton from "react-loading-skeleton";

const GroupLeaderFilter = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status } = useSession();

  // const users = await fetchAllUsers();
  const { data: users, error } = useUsers();

  if (session?.user.role === "GROUPLEADER") {
    return (
      <Select
        label="Filter by group leader...."
        className="max-w-xs"
        // defaultSelectedKeys={[session.user.id]}
        selectedKeys={[session.user.id]}
      >
        <SelectItem key={session.user.id} value={session.user.id}>
          {session.user.lastName}
        </SelectItem>
      </Select>
    );
  }

  if (!users) return <Skeleton />;

  return (
    <Select
      label="Filter by group leader...."
      className="max-w-xs"
      defaultSelectedKeys={[searchParams.get("groupLeader") || "All"]}
      onChange={(event) => {
        const groupLeader = event.target.value;
        const params = new URLSearchParams(searchParams);
        if (groupLeader) params.set("groupLeader", groupLeader);
        const query = params.size ? "?" + params.toString() : "";
        router.push("/dashboard/grants/list" + query);
      }}
    >
      <SelectSection title="All">
        <SelectItem key="All" value="All">
          All
        </SelectItem>
      </SelectSection>
      <SelectSection title="Individual">
        {users.map((user) => (
          <SelectItem key={user.id} value={user.id}>
            {user.lastName}
          </SelectItem>
        ))}
      </SelectSection>
    </Select>
  );
};

const useUsers = () =>
  useQuery<User[]>({
    queryKey: ["users"],
    queryFn: () => axios.get("/api/users").then((res) => res.data),
    staleTime: 60 * 1000, //60s
    retry: 3,
  });

export default GroupLeaderFilter;
