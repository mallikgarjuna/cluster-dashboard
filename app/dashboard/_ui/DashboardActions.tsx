import React from "react";
import DepartmentFilter from "../grants/list/DepartmentFilter";
import GroupLeaderFilter from "../grants/list/GroupLeaderFilter";

const DashboardActions = () => {
  return (
    <div className="flex gap-3">
      <DepartmentFilter />
      <GroupLeaderFilter />
    </div>
  );
};

export default DashboardActions;
