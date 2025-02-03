import React from "react";
import DepartmentFilter from "../grants/list/DepartmentFilter";
import GroupLeaderFilter from "../grants/list/GroupLeaderFilter";
import GrantStartYearFilter from "../grants/list/GrantStartYearFilter";
import prisma from "@/prisma/client";
import GrantSubmissionYearFilter from "../grants/list/GrantSubmissionYearFilter";
import { getDepartmentShortNames } from "@/lib/actions/department/deptQueries";
import { getUniqueGrantStartYears } from "@/lib/actions/grant/grantQueries";

const DashboardActions = async () => {
  const usersWithDepartment = await prisma.user.findMany({
    where: { role: "GROUPLEADER" },
    orderBy: { lastName: "asc" },
    include: { relatedDepartment: true },
  });

  const departmentShortNames = await getDepartmentShortNames();
  // console.log("Department short names: ", departmentShortNames);

  const grantStartYears = await getUniqueGrantStartYears();
  // console.log("Grant start years: ", grantStartYears);

  return (
    <div className="flex gap-3">
      <DepartmentFilter departments={departmentShortNames} />
      <GroupLeaderFilter users={usersWithDepartment} />
      <GrantStartYearFilter startYears={grantStartYears} />
      <GrantSubmissionYearFilter submitYears={grantStartYears} />
      {/* to avoid another db fetching operation, use startYears for submitYears */}
    </div>
  );
};

export default DashboardActions;
