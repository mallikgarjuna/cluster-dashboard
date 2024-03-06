import { FC } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { InputProps } from "./types";
import { InputErrorMessage } from "./InputErrorMessage";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export const DateInput: FC<InputProps> = ({
  label,
  name,
  errors,
  placeholder,
}) => {
  const { control } = useFormContext();
  return (
    <div>
      <div>
        {/* <label htmlFor={name} className="text-base font-medium">
          {label}
        </label> */}
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
    </div>
  );
};
