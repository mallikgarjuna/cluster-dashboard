"use client";

import { Input } from "@nextui-org/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { useDebouncedCallback } from "use-debounce";
import React from "react";

const GrantSearch = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const handleSearch = useDebouncedCallback((searchQuery: string) => {
    // console.log("searchQuery: ", searchQuery);

    const params = new URLSearchParams(searchParams);

    if (searchQuery) params.set("searchQuery", searchQuery);
    else params.delete("searchQuery");

    const query = params.size ? "?" + params.toString() : "";

    router.replace(`${pathname}${query}`);
  }, 1000);

  return (
    <div>
      <Input
        placeholder="Search grants"
        onChange={(event) => handleSearch(event.target.value)}
        defaultValue={searchParams.get("searchQuery")?.toString()}
        startContent={<HiMagnifyingGlass />}
      />
    </div>
  );
};

export default GrantSearch;
