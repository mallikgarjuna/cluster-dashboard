"use client";

import { Select, SelectItem } from "@nextui-org/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { useFundingActions } from "../../funders/_components/FundingCallForm";
import Skeleton from "react-loading-skeleton";

const FundingActionFilter = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const { data: fetchedFundingActions, isLoading, error } = useFundingActions();

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

    const query = params.size ? "?" + params.toString() : "";

    router.push(pathname + query);
  };

  return (
    <Select
      label="Filter by funding action..."
      onChange={handleSelectionOnChange}
      defaultSelectedKeys={[searchParams.get("fActionId") || "All"]}
    >
      {fetchedFundingActions.map((fAction) => (
        <SelectItem key={fAction.id || "All"} value={fAction.name || "All"}>
          {fAction.name}
        </SelectItem>
      ))}
    </Select>
  );
};

export default FundingActionFilter;
