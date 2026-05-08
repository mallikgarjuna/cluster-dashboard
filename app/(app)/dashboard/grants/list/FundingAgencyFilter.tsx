"use client";

import { Select, SelectItem } from "@nextui-org/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Skeleton from "react-loading-skeleton";
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

  // Fallback to null if undefined, to prevent type error below
  if (!fetchedFundingAgencies) return null;

  const handleSelectionChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const fAgencyId = event.target.value;
    // console.log("fAgencyId: ", fAgencyId);

    const params = new URLSearchParams(searchParams);

    if (fAgencyId) params.set("fAgencyId", fAgencyId);
    else params.delete("fAgencyId");

    // On fAgencyId change, reset the child filters of fAgency
    params.delete("fProgId");
    params.delete("fActionId");
    params.delete("fCallId");

    const query = params.size ? "?" + params.toString() : "";

    router.push(pathname + query);
  };

  return (
    <Select
      label="Filter by funding agency..."
      onChange={handleSelectionChange}
      defaultSelectedKeys={[searchParams.get("fAgencyId") || ""]} // Ensure no null value
    >
      {fetchedFundingAgencies?.map((fAgency) => (
        <SelectItem key={fAgency.id || "All"} value={fAgency.name || "All"}>
          {fAgency.name}
        </SelectItem>
      ))}
    </Select>
  );
};

export default FundingAgencyFilter;
