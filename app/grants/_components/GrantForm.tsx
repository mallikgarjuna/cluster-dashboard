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
import CustomInput from "@/app/components/Input/CustomInput";

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

          <CustomInput
            type="text"
            name="acronym"
            label="Acronym"
            placeholder="Acronym"
            errors={errors}
            defaultValue={grant?.acronym || ""}
          />

          <CustomInput
            type="number"
            name="budgetTotal"
            label="Total budget"
            placeholder="Total budget"
            errors={errors}
            valueAsNumber
            defaultValue={grant?.budgetTotal || 0}
          />

          <CustomInput
            type="date"
            name="submissionDate"
            label="submission Date"
            placeholder="Enter submission Date"
            errors={errors}
            defaultValue={grant?.submissionDate?.toISOString()}
          />

          <CustomInput
            type="date"
            name="deadline"
            label="Deadline"
            placeholder="Enter deadline"
            errors={errors}
          />

          <CustomInput
            type="date"
            name="decisionDate"
            label="Decision Date"
            placeholder="Enter decision date"
            errors={errors}
          />

          <CustomInput
            type="text"
            name="notes"
            label="Notes"
            placeholder="Enter additional information"
            errors={errors}
          />

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
