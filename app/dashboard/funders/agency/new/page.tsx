// not needed here; but it forced me to understand the concept of using
// metadata in the layout.tsx for this client component page
"use client";

import React from "react";
import FundingAgencyForm from "../../_components/FundingAgencyForm";
import FundingAgencyTable from "../../_components/FundingAgencyTable";

const CreateFundingAgencyPage = () => {
  return (
    <div className="flex flex-col gap-y-12">
      <FundingAgencyForm />
      <FundingAgencyTable />
    </div>
  );
};

export default CreateFundingAgencyPage;
