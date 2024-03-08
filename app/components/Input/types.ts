// Source: https://github.com/kirankumal/zod-react-hook-form/blob/master/src/components/Input/types.ts

import { GrantFormDataType } from "@/app/validationSchemas";
import { Grant } from "@prisma/client";
import { FieldErrors } from "react-hook-form";

// type GrantFieldname = keyof Grant; // this also includes other fields
type GrantFieldname = keyof GrantFormDataType;

export interface InputErrorProps {
  name: GrantFieldname;
  errors: FieldErrors<GrantFormDataType>;
}

export interface InputProps extends InputErrorProps {
  label: string;
  type?: "text" | "email" | "time" | "number" | "date";
  placeholder?: string;
  valueAsNumber?: boolean;
  defaultValue?: string | number; //GrantFormDataType[keyof GrantFormDataType];
}

export interface SelectProps extends InputProps {
  options: {
    value: string;
    label: string;
  }[];
}

export interface ReactSelectProps extends SelectProps {
  isMulti: boolean;
}
