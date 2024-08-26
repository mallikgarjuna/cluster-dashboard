"use client";

import React from "react";
import { useFundingProgrammes } from "./FundingActionForm";

const FundingProgrammeTable = () => {
  const { data: fundingProgrammes, isLoading, error } = useFundingProgrammes();

  //   if (isLoading) return <div>Loading...</div>;
  //   if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="space-y-2">
      <h2 className="text-xl font-bold">Created Funding Programmes - List</h2>
      <ol className="list-decimal space-y-2 pl-6">
        {fundingProgrammes?.map((programme) => (
          <li key={programme.id}>{programme.name}</li>
        ))}
      </ol>
    </div>
  );
};

export default FundingProgrammeTable;
