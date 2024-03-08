import React from "react";
import { InputProps } from "./types";
import { Text, TextField } from "@radix-ui/themes";
import { useFormContext } from "react-hook-form";
import { InputErrorMessage } from "./InputErrorMessage";

const CustomInput = ({
  type,
  label,
  name,
  placeholder,
  errors,
  valueAsNumber,
  defaultValue,
}: InputProps) => {
  const { register } = useFormContext();
  return (
    <>
      <div>
        <Text as="p">{label}</Text>
        {/* <input type={type} {...register(name)} placeholder={placeholder} /> */}
        <TextField.Input
          type={type}
          {...register(name, { valueAsNumber })}
          placeholder={placeholder}
          defaultValue={defaultValue}
        />
      </div>
      <InputErrorMessage name={name} errors={errors} />
    </>
  );
};

export default CustomInput;
