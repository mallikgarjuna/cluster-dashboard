// import React from "react";
import { Metadata } from "next";
import FundingCallForm from "../../_components/FundingCallForm";
import FundingCallTable from "../../_components/FundingCallTable";

const FundingCallPage = () => {
  return (
    <div className="flex flex-col gap-y-12">
      <FundingCallForm />
      <FundingCallTable />
    </div>
  );
};

export const metadata: Metadata = {
  title: "Cluster Dashboard - Create a New Funding Call",
  description: "Create a new funding call",
};

export default FundingCallPage;
