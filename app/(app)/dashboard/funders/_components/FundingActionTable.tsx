"use client";

import React from "react";
import { useFundingActions } from "./FundingCallForm";
import { Link } from "@/app/components";

const FundingActionTable = () => {
  const { data: fundingActions, isLoading, error } = useFundingActions();

  return (
    <div className="space-y-2">
      <h2 className="text-xl font-bold">Created Funding Actions - List</h2>
      <ol className="list-decimal space-y-2 pl-6">
        {fundingActions?.map((action) => (
          <li key={action.id}>
            <Link href={`/dashboard/funders/action/edit/${action.id}`}>
              {action.name}
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default FundingActionTable;
