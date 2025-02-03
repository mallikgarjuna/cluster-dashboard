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

type GrantSubmitYearFilterProps = {
  submitYears: number[];
};

const GrantSubmissionYearFilter = ({
  submitYears,
}: GrantSubmitYearFilterProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname(); // returns "/dashboard" on /dashboard?foo=bar

  // const submitYears = ["2023", "2024"];
  const submitYearOptions = submitYears.map((year) => ({
    label: year.toString(),
    value: year.toString(),
  }));

  const handleValueChange = (value: string) => {
    console.log("submitYear: ", value); // submitYear:  2023

    const params = new URLSearchParams(searchParams);
    // console.log("params: ", params); // params:  URLSearchParams { year → "2023" }

    if (value === "All") {
      params.delete("submitYear");
    } else {
      params.set("submitYear", value);
    }

    const queryString = params.size ? "?" + params.toString() : "";
    // console.log("query: ", query); // query:  ?submitYear=2023

    router.push(pathname + queryString);
    // console.log("pathname: ", pathname); // pathname:  /dashboard/grants/list
  };

  const defaultValueSelect = searchParams.get("submitYear") || "All"; // `null` is not acceptable for defaultValue prop;

  return (
    <div className="flex min-w-[200px] flex-col gap-2">
      <Label>Filter by submission year</Label>
      <Select
        onValueChange={handleValueChange}
        defaultValue={defaultValueSelect}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select submit year" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All</SelectItem>
          {submitYearOptions.map((year) => (
            <SelectItem key={year.value} value={year.value}>
              {year.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default GrantSubmissionYearFilter;
