"use client";

import { Select, SelectItem } from "@nextui-org/react";
import { FundingCall } from "@prisma/client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
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

  const handleSelectionOnChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const selectedFCallId = event.target.value;

    const params = new URLSearchParams(searchParams);

    if (selectedFCallId) params.set("fCallId", selectedFCallId);
    else params.delete("fCallId");

    const query = params.size ? "?" + params.toString() : "";

    router.push(pathname + query);
  };

  return (
    <Select
      label="Filter by Funcing Call..."
      onChange={handleSelectionOnChange}
      defaultSelectedKeys={[searchParams.get("fCallId") || ""]}
    >
      {fundingCalls.map((fCall) => (
        <SelectItem key={fCall.id || "All"} value={fCall.name || "All"}>
          {fCall.name}
        </SelectItem>
      ))}
    </Select>
  );
};

export default FundingCallFilter;
