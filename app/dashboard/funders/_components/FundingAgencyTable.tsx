import React from "react";
import { useFundingAgencies } from "./FundingProgrammeForm";
import { Link } from "@/app/components";

const FundingAgencyTable = () => {
  const { data: fundingAgencies, isLoading, error } = useFundingAgencies();

  return (
    <div className="space-y-2">
      <h2 className="text-xl font-bold">Created Funding Agencies - List</h2>
      <ol className="list-decimal space-y-2 pl-6">
        {fundingAgencies?.map((agency) => (
          <li key={agency.id}>
            <Link href={`/dashboard/funders/agency/edit/${agency.id}`}>
              {agency.name}
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default FundingAgencyTable;
