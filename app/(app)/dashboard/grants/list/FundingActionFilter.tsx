"use client";

import { updateFilterQueryParams } from "@/lib/utils";
import { FundingAction } from "@prisma/client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import FilterSelectField from "./FilterSelectField";
import {
  useFundingFilterActions,
  useFundingFilterProgrammes,
} from "./fundingFilterQueries";

const FundingActionFilter = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const { data: fetchedFundingProgrammes } = useFundingFilterProgrammes();
  const {
    data: fetchedFundingActions,
    isLoading,
    error,
  } = useFundingFilterActions();

  const [fundingActions, setFundingActions] = useState<FundingAction[]>([]);

  useEffect(() => {
    const fetchData = () => {
      const params = new URLSearchParams(searchParams);
      const fProgId = params.get("fProgId");
      if (fProgId && fProgId !== "All") {
        const selectedFProg = fetchedFundingProgrammes?.find(
          (fProg) => fProg.id === fProgId,
        );
        setFundingActions(selectedFProg?.fundingActions || []);
      } else {
        setFundingActions(fetchedFundingActions || []);
      }
    };
    fetchData();
  }, [fetchedFundingActions, fetchedFundingProgrammes, searchParams]);

  if (isLoading) return <Skeleton />;
  if (error) return null;
  if (!fetchedFundingActions) return null;

  const handleValueChange = (value: string) => {
    const queryString = updateFilterQueryParams({
      searchParams,
      paramName: "fActionId",
      value,
      resetParams: ["fCallId"],
    });

    router.push(pathname + queryString);
  };

  return (
    <FilterSelectField
      label="Filter by funding action"
      placeholder="Select funding action"
      onValueChange={handleValueChange}
      defaultValue={searchParams.get("fActionId") || ""}
      options={fundingActions.map((fAction) => ({
        label: fAction.name,
        value: fAction.id,
      }))}
      allLabel="All"
    />
  );
};

export default FundingActionFilter;
