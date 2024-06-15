import React from "react";
import DepartmentFilter from "../grants/list/DepartmentFilter";
import GroupLeaderFilter from "../grants/list/GroupLeaderFilter";
import GrantStartYearFilter from "../grants/list/GrantStartYearFilter";
import prisma from "@/prisma/client";

const DashboardActions = async () => {
  const usersWithDepartment = await prisma.user.findMany({
    where: { role: "GROUPLEADER" },
    orderBy: { lastName: "asc" },
    include: { relatedDepartment: true },
  });

  return (
    <div className="flex gap-3">
      <DepartmentFilter />
      <GroupLeaderFilter users={usersWithDepartment} />
      <GrantStartYearFilter />
    </div>
  );
};

export default DashboardActions;
