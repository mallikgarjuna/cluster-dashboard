"use client";

import { Input } from "@/components/ui/input";
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
  }, 300);

  return (
    <div className="relative">
      <HiMagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
      <Input
        placeholder="Search grants"
        onChange={(event) => handleSearch(event.target.value)}
        defaultValue={searchParams.get("searchQuery")?.toString() || ""}
        className="pl-9"
      />
    </div>
  );
};

export default GrantSearch;
