import React from "react";
import FundingProgrammeForm from "../../_components/FundingProgrammeForm";
import { Metadata } from "next";

const CreateFundingProgrammePage = () => {
  return (
    <div>
      <FundingProgrammeForm />
    </div>
  );
};

export const metadata: Metadata = {
  title: "Cluster Dashboard - Create a New Funding Programme",
  description: "Create a new funding programme",
};

export default CreateFundingProgrammePage;
