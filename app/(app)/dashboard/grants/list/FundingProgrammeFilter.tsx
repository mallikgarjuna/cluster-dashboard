"use client";

import { updateFilterQueryParams } from "@/lib/utils";
import { FundingProgramme } from "@prisma/client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import FilterSelectField from "./FilterSelectField";
import {
  useFundingFilterAgencies,
  useFundingFilterProgrammes,
} from "./fundingFilterQueries";

const FundingProgrammeFilter = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const { data: fetchedFundingAgencies } = useFundingFilterAgencies();
  const {
    data: fetchedFundingProgrammes,
    isLoading,
    error,
  } = useFundingFilterProgrammes();

  const [fundingProgrammes, setFundingProgrammes] = useState<
    FundingProgramme[]
  >([]);

  // useEffect to update fundingProgrammes when a fAgencyId is selected
  useEffect(() => {
    const fetchData = async () => {
      const params = new URLSearchParams(searchParams);
      const fAgencyId = params.get("fAgencyId");
      if (fAgencyId) {
        const selectedFAgency = fetchedFundingAgencies?.find(
          (fAgency) => fAgency.id === fAgencyId,
        );
        setFundingProgrammes(selectedFAgency?.fundingProgrammes || []);
      } else {
        setFundingProgrammes(fetchedFundingProgrammes || []);
      }
    };
    fetchData();
  }, [fetchedFundingAgencies, fetchedFundingProgrammes, searchParams]);

  if (isLoading) return <Skeleton />;
  if (error) return null;
  if (!fetchedFundingProgrammes) return null;

  const handleValueChange = (value: string) => {
    const queryString = updateFilterQueryParams({
      searchParams,
      paramName: "fProgId",
      value,
      allValue: "",
      resetParams: ["fActionId", "fCallId"],
    });

    router.push(pathname + queryString);
  };

  return (
    <FilterSelectField
      label="Filter by funding programme"
      placeholder="Select funding programme"
      onValueChange={handleValueChange}
      defaultValue={searchParams.get("fProgId") || ""}
      options={fundingProgrammes.map((fProg) => ({
        label: fProg.name,
        value: fProg.id,
      }))}
      allLabel="All"
    />
  );
};

export default FundingProgrammeFilter;
