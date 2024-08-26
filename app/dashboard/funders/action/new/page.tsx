import React from "react";
import FundingActionForm from "../../_components/FundingActionForm";
import { Metadata } from "next";

const CreateFundingActionPage = () => {
  return (
    <div>
      <FundingActionForm />
    </div>
  );
};

export const metadata: Metadata = {
  title: "Cluster Dashboard - Create a New Funding Action",
  description: "Create a new funding action",
};

export default CreateFundingActionPage;
