"use client";

import { Select, SelectItem } from "@nextui-org/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Skeleton from "react-loading-skeleton";
import { useFundingCalls } from "../../funders/_components/FundingCallForm";

const FundingCallFilter = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const { data: fetchedFundingCalls, isLoading, error } = useFundingCalls();

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
      defaultSelectedKeys={[searchParams.get("fCallId") || "All"]}
    >
      {fetchedFundingCalls.map((fCall) => (
        <SelectItem key={fCall.id || "All"} value={fCall.name || "All"}>
          {fCall.name}
        </SelectItem>
      ))}
    </Select>
  );
};

export default FundingCallFilter;
