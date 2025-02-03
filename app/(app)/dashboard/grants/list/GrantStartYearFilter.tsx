"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type GrantStartYearFilterProps = {
  startYears: number[];
};

const GrantStartYearFilter = ({ startYears }: GrantStartYearFilterProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // const startYears = ["AllStarted", "2023", "2024"];
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
    <div className="flex min-w-[200px] flex-col gap-2">
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
};

export default GrantStartYearFilter;
