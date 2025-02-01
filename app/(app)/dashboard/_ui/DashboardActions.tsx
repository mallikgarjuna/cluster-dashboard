import React from "react";
import DepartmentFilter from "../grants/list/DepartmentFilter";
import GroupLeaderFilter from "../grants/list/GroupLeaderFilter";
import GrantStartYearFilter from "../grants/list/GrantStartYearFilter";
import prisma from "@/prisma/client";
import GrantSubmissionYearFilter from "../grants/list/GrantSubmissionYearFilter";
import { getDepartmentShortNames } from "@/lib/actions/department/deptQueries";

const DashboardActions = async () => {
  const usersWithDepartment = await prisma.user.findMany({
    where: { role: "GROUPLEADER" },
    orderBy: { lastName: "asc" },
    include: { relatedDepartment: true },
  });

  const departmentShortNames = await getDepartmentShortNames();

  return (
    <div className="flex gap-3">
      <DepartmentFilter departments={departmentShortNames} />
      <GroupLeaderFilter users={usersWithDepartment} />
      <GrantStartYearFilter />
      <GrantSubmissionYearFilter />
    </div>
  );
};

export default DashboardActions;
