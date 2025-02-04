import { getDepartmentShortNames } from "@/lib/actions/department/deptQueries";
import { getUniqueGrantStartYears } from "@/lib/actions/grant/grantQueries";
import { getGroupLeadersWithDepartment } from "@/lib/actions/user/userQueries";
import DepartmentFilter from "../grants/list/DepartmentFilter";
import GrantStartYearFilter from "../grants/list/GrantStartYearFilter";
import GrantSubmissionYearFilter from "../grants/list/GrantSubmissionYearFilter";
import GroupLeaderFilter from "../grants/list/GroupLeaderFilter";

const DashboardActions = async () => {
  const groupLeaders = await getGroupLeadersWithDepartment();

  const departmentShortNames = await getDepartmentShortNames();
  // console.log("Department short names: ", departmentShortNames);

  const grantStartYears = await getUniqueGrantStartYears();
  // console.log("Grant start years: ", grantStartYears);

  return (
    <div className="flex justify-stretch gap-2">
      <DepartmentFilter departments={departmentShortNames} />
      <GroupLeaderFilter groupLeaders={groupLeaders} />
      <GrantStartYearFilter startYears={grantStartYears} />
      <GrantSubmissionYearFilter submitYears={grantStartYears} />
      {/* to avoid another db fetching operation, use startYears for submitYears */}
    </div>
  );
};

export default DashboardActions;
