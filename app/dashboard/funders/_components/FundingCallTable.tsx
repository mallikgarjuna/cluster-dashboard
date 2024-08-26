"use client";

import React from "react";
import { useFundingCalls } from "./FundingCallForm";

const FundingCallTable = () => {
  const { data: fundingCalls, isLoading, error } = useFundingCalls();

  return (
    <div className="space-y-2">
      <h2 className="text-xl font-bold">Created Funding Calls - List</h2>
      <ol className="list-decimal space-y-2 pl-6">
        {fundingCalls?.map((call) => (
          <li key={call.id}>
            {call.name} - {call.url}
          </li>
        ))}
      </ol>
    </div>
  );
};

export default FundingCallTable;
