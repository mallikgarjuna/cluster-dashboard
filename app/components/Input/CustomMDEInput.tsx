import { Controller, useFormContext } from "react-hook-form";
import SimpleMdeReact from "react-simplemde-editor";
// No dynamic import - b/ see les:4.7
// import dynamic from "next/dynamic";
// const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
//   ssr: false,
// });
import { Text } from "@radix-ui/themes";
import "easymde/dist/easymde.min.css";
import { InputErrorMessage } from "./InputErrorMessage";
import { InputProps } from "./types";

const CustomMDEInput = ({
  label,
  name,
  defaultValue,
  placeholder,
  errors,
}: InputProps) => {
  const { control } = useFormContext();

  return (
    <>
      <Text as="p" weight="bold">
        {label}
      </Text>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        render={({ field }) => (
          <SimpleMdeReact
            {...field}
            placeholder={placeholder}
            options={{
              maxHeight: "100px",
              autofocus: true,
            }}
          />
        )}
      />
      <InputErrorMessage errors={errors} name={name} />
    </>
  );
};

export default CustomMDEInput;
