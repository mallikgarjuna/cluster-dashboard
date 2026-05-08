"use client";

import { updateFilterQueryParams } from "@/lib/utils";
import { FundingCall } from "@prisma/client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import FilterSelectField from "./FilterSelectField";
import {
  useFundingFilterActions,
  useFundingFilterCalls,
} from "./fundingFilterQueries";

const FundingCallFilter = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const { data: fetchedFundingActions } = useFundingFilterActions();
  const {
    data: fetchedFundingCalls,
    isLoading,
    error,
  } = useFundingFilterCalls();

  const [fundingCalls, setFundingCalls] = useState<FundingCall[]>([]);

  // useEffect to update fundingCalls when a fActionId is selected
  useEffect(() => {
    const fetchData = () => {
      const params = new URLSearchParams(searchParams);
      const fActionId = params.get("fActionId");
      if (fActionId) {
        const selectedFAction = fetchedFundingActions?.find(
          (fAction) => fAction.id === fActionId,
        );
        setFundingCalls(selectedFAction?.fundingCalls || []);
      } else {
        setFundingCalls(fetchedFundingCalls || []);
      }
    };
    fetchData();
  }, [fetchedFundingActions, fetchedFundingCalls, searchParams]);

  if (isLoading) return <Skeleton />;
  if (error) return null;
  if (!fetchedFundingCalls) return null;

  const handleValueChange = (value: string) => {
    const queryString = updateFilterQueryParams({
      searchParams,
      paramName: "fCallId",
      value,
      allValue: "",
    });

    router.push(pathname + queryString);
  };

  return (
    <FilterSelectField
      label="Filter by funding call"
      placeholder="Select funding call"
      onValueChange={handleValueChange}
      defaultValue={searchParams.get("fCallId") || ""}
      options={fundingCalls.map((fCall) => ({
        label: fCall.name,
        value: fCall.id,
      }))}
      allLabel="All"
    />
  );
};

export default FundingCallFilter;
