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
  const pathname = usePathname();

  const submitYearOptions = submitYears.map((year) => ({
    label: year.toString(),
    value: year.toString(),
  }));

  const handleValueChange = (value: string) => {
    const queryString = updateFilterQueryParams({
      searchParams,
      paramName: "submitYear",
      value,
    });

    router.push(pathname + queryString);
  };

  const defaultValueSelect = searchParams.get("submitYear") || "All";

  return (
    <FilterSelectField
      label="Filter by submission year"
      placeholder="Select submission year"
      onValueChange={handleValueChange}
      defaultValue={defaultValueSelect}
      options={submitYearOptions}
    />
  );
};

export default GrantSubmissionYearFilter;
