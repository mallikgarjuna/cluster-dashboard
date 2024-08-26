// not needed here; but it forced me to understand the concept of using
// metadata in the layout.tsx for this client component page
"use client";

import React from "react";
import FundingAgencyForm from "../../_components/FundingAgencyForm";

const CreateFundingAgencyPage = () => {
  return (
    <div>
      <FundingAgencyForm />
    </div>
  );
};

export default CreateFundingAgencyPage;
