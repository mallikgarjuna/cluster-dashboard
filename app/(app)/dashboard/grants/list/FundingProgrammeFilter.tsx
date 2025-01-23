"use client";

import { Select, SelectItem } from "@nextui-org/react";
import { FundingProgramme } from "@prisma/client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { useFundingProgrammes } from "../../funders/_components/FundingActionForm";
import { useFundingAgencies } from "../../funders/_components/FundingProgrammeForm";

const FundingProgrammeFilter = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const { data: fetchedFundingAgencies } = useFundingAgencies();
  const {
    data: fetchedFundingProgrammes,
    isLoading,
    error,
  } = useFundingProgrammes();

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

  const handleSelectionOnChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const selectedFProgId = event.target.value;

    const params = new URLSearchParams(searchParams);

    if (selectedFProgId) params.set("fProgId", selectedFProgId);
    else params.delete("fProgId");

    // On fProgId change, reset the child filters of fProgramme
    params.delete("fActionId");
    params.delete("fCallId");

    const query = params.size ? "?" + params.toString() : "";

    router.push(pathname + query);
  };

  return (
    <Select
      label="Filter by Funding programme..."
      onChange={handleSelectionOnChange}
      defaultSelectedKeys={[searchParams.get("fProgId") || ""]} // Ensure no null value
    >
      {fundingProgrammes?.map((fProg) => (
        <SelectItem key={fProg.id || "All"} value={fProg.name || "All"}>
          {fProg.name}
        </SelectItem>
      ))}
    </Select>
  );
};

export default FundingProgrammeFilter;
