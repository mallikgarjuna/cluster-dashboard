"use client";

import { updateFilterQueryParams } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import FilterSelectField from "./FilterSelectField";

type GrantStartYearFilterProps = {
  startYears: number[];
};

const GrantStartYearFilter = ({ startYears }: GrantStartYearFilterProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const startYearOptions = startYears.map((year) => ({
    label: year.toString(),
    value: year.toString(),
  }));

  const handleValueChange = (value: string) => {
    const queryString = updateFilterQueryParams({
      searchParams,
      paramName: "year",
      value,
    });

    router.push(`${pathname}${queryString}`);
  };

  const defaultValueSelect = searchParams.get("year") || "All";

  return (
    <FilterSelectField
      label="Filter by start year"
      placeholder="Select start year"
      onValueChange={handleValueChange}
      defaultValue={defaultValueSelect}
      options={startYearOptions}
    />
  );
};

export default GrantStartYearFilter;
