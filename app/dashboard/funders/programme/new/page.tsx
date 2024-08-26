import React from "react";
import FundingProgrammeForm from "../../_components/FundingProgrammeForm";
import { Metadata } from "next";
import FundingProgrammeTable from "../../_components/FundingProgrammeTable";

const CreateFundingProgrammePage = () => {
  return (
    <div className="flex flex-col gap-y-12">
      <FundingProgrammeForm />
      <FundingProgrammeTable />
    </div>
  );
};

export const metadata: Metadata = {
  title: "Cluster Dashboard - Create a New Funding Programme",
  description: "Create a new funding programme",
};

export default CreateFundingProgrammePage;
