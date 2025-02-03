"use client";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { Select, SelectItem, SelectSection } from "@nextui-org/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";

type GrantStartYearFilterProps = {
  startYears: number[];
};

// const startYears = ["AllStarted", "2023", "2024"];
const GrantStartYearFilter = ({ startYears }: GrantStartYearFilterProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const startYearOptions = startYears.map((year) => ({
    label: year.toString(), // convert number to string for `value` prop
    value: year.toString(), // convert number to string for `value` prop
  }));

  const handleValueChange = (value: string) => {
    console.log("startYear Value: ", value);

    const params = new URLSearchParams(searchParams);
    if (value === "All") {
      params.delete("year"); //TODO: rename it to `startYear`;
    } else {
      params.set("year", value);
    }

    const queryString = params.size ? "?" + params.toString() : "";

    router.push(`${pathname}${queryString}`);
  };

  const defaultValueSelect = searchParams.get("year") || "All"; // `null` is not acceptable for defaultValue prop;

  return (
    <div className="flex min-w-[200px] max-w-xs flex-col gap-2">
      <Label>Filter by start year</Label>
      <Select
        onValueChange={handleValueChange}
        defaultValue={defaultValueSelect}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select start year" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All</SelectItem>
          {startYearOptions.map((year) => (
            <SelectItem key={year.value} value={year.value}>
              {year.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  // return (
  //   <Select
  //     label="Filter by start year..."
  //     className="max-w-xs"
  //     defaultSelectedKeys={[searchParams.get("year") || "All"]}
  //     onChange={(event) => {
  //       const year = event.target.value;
  //       // console.log("year: ", year);
  //       const params = new URLSearchParams(searchParams);

  //       if (year) params.set("year", year);
  //       else params.delete("year");
  //       // console.log("params: ", params.toString());

  //       const query = params.size ? "?" + params.toString() : "";
  //       router.push(pathname + query);
  //     }}
  //   >
  //     <SelectSection title={"All"} showDivider>
  //       <SelectItem key={"All"} value={"All"} textValue={"All"}>
  //         All
  //       </SelectItem>
  //     </SelectSection>

  //     <SelectSection title={"Years"} showDivider>
  //       {startYears.map((year) => (
  //         <SelectItem key={year} value={year} textValue={year.toString() ?? ""}>
  //           {year}
  //         </SelectItem>
  //       ))}
  //     </SelectSection>
  //   </Select>
  // );
};

export default GrantStartYearFilter;
