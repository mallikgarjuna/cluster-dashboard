"use client";

import { Select, SelectItem } from "@nextui-org/react";
import { FundingAction } from "@prisma/client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
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

  // useEffect to update fundingActions when a fProgId is selected
  useEffect(() => {
    const fetchData = () => {
      const params = new URLSearchParams(searchParams);
      const fProgId = params.get("fProgId");
      if (fProgId) {
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

  const handleSelectionOnChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const selectedFActionId = event.target.value;

    const params = new URLSearchParams(searchParams);

    if (selectedFActionId) params.set("fActionId", selectedFActionId);
    else params.delete("fActionId");

    // On fActionId change, reset the child filters of fAction
    params.delete("fCallId");

    const query = params.size ? "?" + params.toString() : "";

    router.push(pathname + query);
  };

  return (
    <Select
      label="Filter by funding action..."
      onChange={handleSelectionOnChange}
      defaultSelectedKeys={[searchParams.get("fActionId") || ""]}
    >
      {fundingActions.map((fAction) => (
        <SelectItem key={fAction.id || "All"} value={fAction.name || "All"}>
          {fAction.name}
        </SelectItem>
      ))}
    </Select>
  );
};

export default FundingActionFilter;
