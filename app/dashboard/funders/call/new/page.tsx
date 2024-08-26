// import React from "react";
import { Metadata } from "next";
import FundingCallForm from "../../_components/FundingCallForm";

const FundingCallPage = () => {
  return (
    <div>
      <FundingCallForm />
    </div>
  );
};

export const metadata: Metadata = {
  title: "Cluster Dashboard - Create a New Funding Call",
  description: "Create a new funding call",
};

export default FundingCallPage;
