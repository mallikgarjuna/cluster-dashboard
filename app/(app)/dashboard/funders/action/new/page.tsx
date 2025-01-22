import React from "react";
import FundingActionForm from "../../_components/FundingActionForm";
import { Metadata } from "next";
import FundingActionTable from "../../_components/FundingActionTable";

const CreateFundingActionPage = () => {
  return (
    <div className="flex flex-col gap-y-12">
      <FundingActionForm />
      <FundingActionTable />
    </div>
  );
};

export const metadata: Metadata = {
  title: "Cluster Dashboard - Create a New Funding Action",
  description: "Create a new funding action",
};

export default CreateFundingActionPage;
