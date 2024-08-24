"use client";

import { Select, SelectItem } from "@nextui-org/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";

const GrantSubmissionYearFilter = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname(); // returns "/dashboard" on /dashboard?foo=bar

  const submitYears = ["2023", "2024"];

  const handleSelectionChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    // console.log("event: ", event); // Object { target: Object { 0: option, 1: option, value: "2023", … }

    const submitYear = event.target.value;
    // console.log("submitYear: ", submitYear); // submitYear:  2023

    const params = new URLSearchParams(searchParams);
    // console.log("params: ", params); // params:  URLSearchParams { year → "2023" }

    if (submitYear) params.set("submitYear", submitYear);
    else params.delete("submitYear");

    const query = params.size ? "?" + params.toString() : "";
    // console.log("query: ", query); // query:  ?submitYear=2023

    router.push(pathname + query);
    // console.log("pathname: ", pathname); // pathname:  /dashboard/grants/list
  };

  return (
    <Select
      label="Filter by submission year..."
      onChange={handleSelectionChange}
      defaultSelectedKeys={
        searchParams.get("submitYear") ? [searchParams.get("submitYear")!] : []
      }
    >
      {submitYears.map((year) => (
        <SelectItem key={year} textValue={year}>
          {year}
        </SelectItem>
      ))}
    </Select>
  );
};

export default GrantSubmissionYearFilter;
