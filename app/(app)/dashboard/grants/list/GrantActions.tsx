import { StatusGrant } from "@prisma/client";
import { Flex } from "@radix-ui/themes";
import ButtonWithSpinner from "./ButtonWithSpinner";
import dynamic from "next/dynamic";
import { getDepartmentShortNames } from "@/lib/actions/department/deptQueries";
import { getUniqueGrantStartYears } from "@/lib/actions/grant/grantQueries";
import { getGroupLeadersWithDepartment } from "@/lib/actions/user/userQueries";

const DynamicGrantStatusFilter = dynamic(
  () => import("@/app/(app)/dashboard/grants/list/GrantStatusFilter"),
  { ssr: false, loading: () => <div>Loading...</div> },
);
const DynamicDepartmentFilter = dynamic(
  () => import("@/app/(app)/dashboard/grants/list/DepartmentFilter"),
  { ssr: false, loading: () => <div>Loading...</div> },
);
const DynamicGroupLeaderFilter = dynamic(
  () => import("@/app/(app)/dashboard/grants/list/GroupLeaderFilter"),
  { ssr: false, loading: () => <div>Loading...</div> },
);
const DynamicGrantStartYearFilter = dynamic(
  () => import("@/app/(app)/dashboard/grants/list/GrantStartYearFilter"),
  { ssr: false, loading: () => <div>Loading...</div> },
);
const DynamicGrantSubmissionYearFilter = dynamic(
  () => import("@/app/(app)/dashboard/grants/list/GrantSubmissionYearFilter"),
  { ssr: false, loading: () => <div>Loading...</div> },
);

const DynamicFundingAgencyFilter = dynamic(
  () => import("@/app/(app)/dashboard/grants/list/FundingAgencyFilter"),
  { ssr: false, loading: () => <div>Loading...</div> },
);

const DynamicFundingProgrammeFilter = dynamic(
  () => import("@/app/(app)/dashboard/grants/list/FundingProgrammeFilter"),
  { ssr: false, loading: () => <div>Loading...</div> },
);

const DynamicFundingActionFilter = dynamic(
  () => import("@/app/(app)/dashboard/grants/list/FundingActionFilter"),
  { ssr: false, loading: () => <div>Loading...</div> },
);

const DynamicFundingCallFilter = dynamic(
  () => import("@/app/(app)/dashboard/grants/list/FundingCallFilter"),
  { ssr: false, loading: () => <div>Loading...</div> },
);

const GrantActions = async () => {
  const groupLeaders = await getGroupLeadersWithDepartment();
  const departments = await getDepartmentShortNames();
  const grantStartYears = await getUniqueGrantStartYears();
  const grantStatuses = Object.values(StatusGrant);

  return (
    <Flex direction="column" gap="3">
      <Flex justify="between" gap="3" align="center">
        <DynamicGrantStatusFilter grantStatuses={grantStatuses} />
        <DynamicDepartmentFilter departments={departments} />
        <DynamicGroupLeaderFilter groupLeaders={groupLeaders} />
        <DynamicGrantStartYearFilter startYears={grantStartYears} />
        <DynamicGrantSubmissionYearFilter submitYears={grantStartYears} />
        <ButtonWithSpinner hrefProp="/dashboard/grants/new" name="New Grant" />
      </Flex>
      <Flex justify="between" gap="3" align="center">
        <DynamicFundingAgencyFilter />
        <DynamicFundingProgrammeFilter />
        <DynamicFundingActionFilter />
        <DynamicFundingCallFilter />
      </Flex>
    </Flex>
  );
};

export default GrantActions;
