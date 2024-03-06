"use client";

import { Button, Callout, TextField } from "@radix-ui/themes";
import SimpleMDE from "react-simplemde-editor";
// No dynamic import - b/ see les:4.7
// import dynamic from "next/dynamic";
// const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
//   ssr: false,
// });
import ErrorMessage from "@/app/components/ErrorMessage";
import { DateInput } from "@/app/components/Input/DateInput";
import Spinner from "@/app/components/Spinner";
import { GrantFormDataType, grantFormSchema } from "@/app/validationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Grant } from "@prisma/client";
import axios from "axios";
import "easymde/dist/easymde.min.css";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";

// type GrantFormDataType = z.infer<typeof grantFormSchema>;

interface Props {
  grant?: Grant;
}

// Receives a 'grant' prop, "optional" (see above interface)
const GrantForm = ({ grant }: Props) => {
  const router = useRouter();
  const methods = useForm<GrantFormDataType>({
    resolver: zodResolver(grantFormSchema),
  });
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = methods;
  const [error, setError] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);

  const onSubmit = async (data: GrantFormDataType) => {
    try {
      console.log(data);
      setSubmitting(true);
      if (grant) await axios.patch(`/api/grants/${grant.id}`, data);
      else await axios.post("/api/grants", data);
      router.push("/grants/list");
      router.refresh();
    } catch (error) {
      setSubmitting(false);
      setError("An unexpected error occured.");
    }
  };

  return (
    <div className="max-w-xl">
      {error && (
        <Callout.Root color="red" className="mb-5">
          <Callout.Text>{error}</Callout.Text>
        </Callout.Root>
      )}
      <FormProvider {...methods}>
        <form className=" space-y-2" onSubmit={handleSubmit(onSubmit)}>
          <TextField.Root>
            <TextField.Input
              defaultValue={grant?.title}
              placeholder="Title"
              {...register("title")}
            />
          </TextField.Root>
          {<ErrorMessage>{errors.title?.message}</ErrorMessage>}

          <Controller
            name="description"
            control={control}
            defaultValue={grant?.description}
            render={({ field }) => (
              <SimpleMDE placeholder="Description" {...field} />
            )}
          />
          {<ErrorMessage>{errors.description?.message}</ErrorMessage>}

          {/* <TextField.Root>
            <TextField.Input
              defaultValue={grant?.budgetTotal ?? ""}
              placeholder="Total budget"
              {...register("budgetTotal")}
            />
          </TextField.Root>
          {<ErrorMessage>{errors.budgetTotal?.message}</ErrorMessage>} */}

          <DateInput
            name="submissionDate"
            label="submission Date"
            errors={errors}
            placeholder="Enter submission Date"
          />
          {<ErrorMessage>{errors.submissionDate?.message}</ErrorMessage>}

          <Button disabled={isSubmitting}>
            {grant ? "Update Grant" : "Submit New Grant "}{" "}
            {isSubmitting && <Spinner />}
          </Button>
        </form>
      </FormProvider>
    </div>
  );
};

export default GrantForm;
