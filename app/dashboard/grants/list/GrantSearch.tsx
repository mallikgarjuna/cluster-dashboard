"use client";

import { Input } from "@nextui-org/react";
import { useSearchParams } from "next/navigation";
import React from "react";

const GrantSearch = () => {
  const searchParams = useSearchParams();

  const handleSearch = (searchQuery: string) => {
    console.log("searchQuery: ", searchQuery);
  };

  return (
    <div>
      <Input
        placeholder="Search grants"
        onChange={(event) => handleSearch(event.target.value)}
      />
    </div>
  );
};

export default GrantSearch;
