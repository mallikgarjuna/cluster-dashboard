"use client";

import { Button, Callout, TextField } from "@radix-ui/themes";
import ErrorMessage from "@/app/components/ErrorMessage";
import CustomInput from "@/app/components/Input/CustomInput";
import CustomMDEInput from "@/app/components/Input/CustomMDEInput";
import Spinner from "@/app/components/Spinner";
import { GrantFormDataType, grantFormSchema } from "@/app/validationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Grant } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

// type GrantFormDataType = z.infer<typeof grantFormSchema>;

interface Props {
  grant?: Grant;
}

// Receives a 'grant' prop, "optional" (see above interface)
const GrantForm_OLD = ({ grant }: Props) => {
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
      if (grant) await axios.patch(`/api/grants/${grant.newId}`, data);
      else await axios.post("/api/grants", data);
      router.push("/dashboard/grants/list");
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
          <div className="text-3xl font-bold items-center justify-center">
            {!!grant ? "Edit grant" : "Create new grant"}
          </div>
          <CustomInput
            type="text"
            name="title"
            label="Title"
            defaultValue={grant?.title}
            placeholder="Title"
            errors={errors}
          />

          <CustomMDEInput
            label="Description"
            name="description"
            defaultValue={grant?.description}
            placeholder="Description"
            errors={errors}
          />

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
            defaultValue={grant?.deadline?.toISOString()}
          />

          <CustomInput
            type="date"
            name="decisionDate"
            label="Decision Date"
            placeholder="Enter decision date"
            errors={errors}
            defaultValue={grant?.decisionDate?.toISOString()}
          />

          <CustomMDEInput
            name="notes"
            label="Notes"
            placeholder="Enter additional information"
            errors={errors}
            defaultValue={grant?.notes || ""}
          />

          <div className="flex justify-between">
            <Button disabled={isSubmitting}>
              {grant ? "Update Grant" : "Submit New Grant "}{" "}
              {isSubmitting && <Spinner />}
            </Button>

            <Button
              onClick={() => router.push("/dashboard/grants/list")}
              type="button"
              color="red"
            >
              Cancel
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default GrantForm_OLD;
