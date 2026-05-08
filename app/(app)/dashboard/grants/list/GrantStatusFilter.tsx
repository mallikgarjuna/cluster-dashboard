"use client";

import { updateFilterQueryParams } from "@/lib/utils";
import { StatusGrant } from "@prisma/client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import FilterSelectField from "./FilterSelectField";

type GrantStatusFilterProps = {
  grantStatuses: StatusGrant[];
};

const GrantStatusFilter = ({ grantStatuses }: GrantStatusFilterProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const statusOptions = grantStatuses.map((status) => ({
    label: status,
    value: status,
  }));

  const handleValueChange = (value: string) => {
    console.log("status select: ", value);
    const queryString = updateFilterQueryParams({
      searchParams,
      paramName: "status",
      value,
    });

    router.push(`${pathname}${queryString}`);
  };

  const defaultValueSelect = searchParams.get("status") || "All"; // null is not acceptable for defaultValue prop;

  return (
    <FilterSelectField
      label="Filter by grant status"
      placeholder="Select a grant status"
      onValueChange={handleValueChange}
      defaultValue={defaultValueSelect}
      options={statusOptions}
    />
  );
};

export default GrantStatusFilter;
