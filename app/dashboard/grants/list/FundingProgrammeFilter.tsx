"use client";

import { Select, SelectItem } from "@nextui-org/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Skeleton from "react-loading-skeleton";
import { useFundingProgrammes } from "../../funders/_components/FundingActionForm";

const FundingProgrammeFilter = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const {
    data: fetchedFundingProgrammes,
    isLoading,
    error,
  } = useFundingProgrammes();

  if (isLoading) return <Skeleton />;
  if (error) return null;
  if (!fetchedFundingProgrammes) return null;

  const handleSelectionOnChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const selectedFProgId = event.target.value;

    const params = new URLSearchParams(searchParams);

    if (selectedFProgId) params.set("fProgId", selectedFProgId);
    else params.delete("fProgId");

    const query = params.size ? "?" + params.toString() : "";

    router.push(pathname + query);
  };

  return (
    <Select
      label="Filter by Funding programme..."
      onChange={handleSelectionOnChange}
    >
      {fetchedFundingProgrammes?.map((fProg) => (
        <SelectItem key={fProg.id || "All"} value={fProg.name || "All"}>
          {fProg.name}
        </SelectItem>
      ))}
    </Select>
  );
};

export default FundingProgrammeFilter;
