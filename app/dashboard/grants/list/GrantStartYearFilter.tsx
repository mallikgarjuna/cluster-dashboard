"use client";
import { Select, SelectItem, SelectSection } from "@nextui-org/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";

const years = [2023, 2024];
const GrantStartYearFilter = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Select
      label="Filter by project start date..."
      className="max-w-xs"
      defaultSelectedKeys={[searchParams.get("year") || "All"]}
      onChange={(event) => {
        const year = event.target.value;
        // console.log("year: ", year);
        const params = new URLSearchParams(searchParams);
        // console.log("params: ", params);

        if (year) params.set("year", year);
        const query = params.size ? "?" + params.toString() : "";
        router.push(pathname + query);
      }}
    >
      <SelectSection title={"All"} showDivider>
        <SelectItem key={"All"} value={"All"} textValue={"All"}>
          All
        </SelectItem>
      </SelectSection>

      <SelectSection title={"Years"} showDivider>
        {years.map((year) => (
          <SelectItem key={year} value={year} textValue={year.toString() ?? ""}>
            {year}
          </SelectItem>
        ))}
      </SelectSection>
    </Select>
  );
};

export default GrantStartYearFilter;
