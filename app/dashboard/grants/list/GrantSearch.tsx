"use client";

import { Input } from "@nextui-org/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";

const GrantSearch = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const handleSearch = (searchQuery: string) => {
    // console.log("searchQuery: ", searchQuery);

    const params = new URLSearchParams(searchParams);

    if (searchQuery) params.set("searchQuery", searchQuery);
    else params.delete("searchQuery");

    const query = params.size ? "?" + params.toString() : "";

    router.replace(`${pathname}${query}`);
  };

  return (
    <div>
      <Input
        placeholder="Search grants"
        onChange={(event) => handleSearch(event.target.value)}
        defaultValue={searchParams.get("searchQuery")?.toString()}
      />
    </div>
  );
};

export default GrantSearch;
