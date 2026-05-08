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

  // const startYears = ["AllStarted", "2023", "2024"];
  const startYearOptions = startYears.map((year) => ({
    label: year.toString(), // convert number to string for `value` prop
    value: year.toString(), // convert number to string for `value` prop
  }));

  const handleValueChange = (value: string) => {
    console.log("startYear Value: ", value);
    const queryString = updateFilterQueryParams({
      searchParams,
      paramName: "year",
      value,
    });

    router.push(`${pathname}${queryString}`);
  };

  const defaultValueSelect = searchParams.get("year") || "All"; // `null` is not acceptable for defaultValue prop;

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
