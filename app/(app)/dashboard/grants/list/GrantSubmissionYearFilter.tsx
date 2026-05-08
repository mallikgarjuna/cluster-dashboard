"use client";

import { updateFilterQueryParams } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import FilterSelectField from "./FilterSelectField";

type GrantSubmitYearFilterProps = {
  submitYears: number[];
};

const GrantSubmissionYearFilter = ({
  submitYears,
}: GrantSubmitYearFilterProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname(); // returns "/dashboard" on /dashboard?foo=bar

  // const submitYears = ["2023", "2024"];
  const submitYearOptions = submitYears.map((year) => ({
    label: year.toString(),
    value: year.toString(),
  }));

  const handleValueChange = (value: string) => {
    console.log("submitYear: ", value); // submitYear:  2023
    const queryString = updateFilterQueryParams({
      searchParams,
      paramName: "submitYear",
      value,
    });
    // console.log("query: ", query); // query:  ?submitYear=2023

    router.push(pathname + queryString);
    // console.log("pathname: ", pathname); // pathname:  /dashboard/grants/list
  };

  const defaultValueSelect = searchParams.get("submitYear") || "All"; // `null` is not acceptable for defaultValue prop;

  return (
    <FilterSelectField
      label="Filter by submission year"
      placeholder="Select submit year"
      onValueChange={handleValueChange}
      defaultValue={defaultValueSelect}
      options={submitYearOptions}
    />
  );
};

export default GrantSubmissionYearFilter;
