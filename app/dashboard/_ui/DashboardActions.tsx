import React from "react";
import DepartmentFilter from "../grants/list/DepartmentFilter";
import GroupLeaderFilter from "../grants/list/GroupLeaderFilter";
import GrantStartYearFilter from "../grants/list/GrantStartYearFilter";

const DashboardActions = () => {
  return (
    <div className="flex gap-3">
      <DepartmentFilter />
      <GroupLeaderFilter />
      <GrantStartYearFilter />
    </div>
  );
};

export default DashboardActions;
