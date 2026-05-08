"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ReactNode } from "react";

type FilterOption = {
  label: string;
  value: string;
};

type FilterSelectFieldProps = {
  label: string;
  placeholder: string;
  defaultValue?: string;
  onValueChange: (value: string) => void;
  options?: FilterOption[];
  allLabel?: string;
  children?: ReactNode;
};

const FilterSelectField = ({
  label,
  placeholder,
  defaultValue,
  onValueChange,
  options,
  allLabel = "All",
  children,
}: FilterSelectFieldProps) => {
  return (
    <div className="min-w-[200px] flex-1 space-y-2">
      <Label>{label}</Label>
      <Select onValueChange={onValueChange} defaultValue={defaultValue}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">{allLabel}</SelectItem>
          {children ??
            options?.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default FilterSelectField;
