import { FC } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { InputProps } from "./types";
import { InputErrorMessage } from "./InputErrorMessage";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Text, TextField } from "@radix-ui/themes";

export const DateInput: FC<InputProps> = ({
  type,
  label,
  name,
  errors,
  placeholder,
}) => {
  const { control, register } = useFormContext();
  return (
    <div>
      <div>
        {/* <label htmlFor={name} className="text-base font-medium">
          {label}
        </label> */}
        <Text as="p">{label}</Text>

        {/* <input
          type="date"
          {...register(name)}
          placeholder={placeholder}
          max="2025-01-01"
        /> */}

        <Controller
          control={control}
          name={name}
          render={({ field: { onChange, value } }) => (
            <ReactDatePicker
              showIcon
              showYearDropdown
              todayButton="Today"
              placeholderText={placeholder}
              onChange={onChange}
              selected={value}
              maxDate={new Date()}
              className={`outline-none w-full  text-gray-500 border-2 rounded-md px-4 duration-200 focus:border-blue-600 align-middle`}
            />
          )}
        />
      </div>
      <InputErrorMessage name={name} errors={errors} />
      {/* {<ErrorMessage>{errors.submissionDate?.message}</ErrorMessage>} */}
    </div>
  );
};
