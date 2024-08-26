"use client";
import React from "react";
import FundingAgencyForm from "../../_components/FundingAgencyForm";
import { Metadata } from "next";

const CreateFundingAgencyPage = () => {
  return (
    <div>
      <FundingAgencyForm />
    </div>
  );
};

export const metadata: Metadata = {
  title: "Cluster Dashboard - Create a New Funding Agency",
  description: "Create a new funding agency",
};

export default CreateFundingAgencyPage;
