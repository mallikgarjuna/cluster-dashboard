"use client";

import { updateFilterQueryParams } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Skeleton from "react-loading-skeleton";
import FilterSelectField from "./FilterSelectField";
import { useFundingFilterAgencies } from "./fundingFilterQueries";

const FundingAgencyFilter = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const {
    data: fetchedFundingAgencies,
    isLoading,
    error,
  } = useFundingFilterAgencies();

  if (isLoading) return <Skeleton />;
  if (error) return null;
  if (!fetchedFundingAgencies) return null;

  const handleValueChange = (value: string) => {
    const queryString = updateFilterQueryParams({
      searchParams,
      paramName: "fAgencyId",
      value,
      allValue: "",
      resetParams: ["fProgId", "fActionId", "fCallId"],
    });

    router.push(pathname + queryString);
  };

  return (
    <FilterSelectField
      label="Filter by funding agency"
      placeholder="Select funding agency"
      onValueChange={handleValueChange}
      defaultValue={searchParams.get("fAgencyId") || ""}
      options={fetchedFundingAgencies.map((fAgency) => ({
        label: fAgency.name,
        value: fAgency.id,
      }))}
      allLabel="All"
    />
  );
};

export default FundingAgencyFilter;
