"use client";

import { Button, Callout, Text, TextField } from "@radix-ui/themes";
import SimpleMDE from "react-simplemde-editor";
// No dynamic import - b/ see les:4.7
// import dynamic from "next/dynamic";
// const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
//   ssr: false,
// });
import "easymde/dist/easymde.min.css";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { GrantSchema } from "@/app/validationSchemas";
import { z } from "zod";
import ErrorMessage from "@/app/components/ErrorMessage";
import Spinner from "@/app/components/Spinner";
import delay from "delay";
import { Grant } from "@prisma/client";

type GrantFormData = z.infer<typeof GrantSchema>;

interface Props {
  grant?: Grant;
}

const GrantForm = ({ grant }: Props) => {
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<GrantFormData>({
    resolver: zodResolver(GrantSchema),
  });
  const [error, setError] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);

  const onSubmit = handleSubmit(async (data) => {
    try {
      setSubmitting(true);
      if (grant) await axios.patch(`/api/grants/${grant.id}`, data);
      else await axios.post("/api/grants", data);
      router.push("/grants");
      router.refresh();
    } catch (error) {
      setSubmitting(false);
      setError("An unexpected error occured.");
    }
  });

  return (
    <div className="max-w-xl">
      {error && (
        <Callout.Root color="red" className="mb-5">
          <Callout.Text>{error}</Callout.Text>
        </Callout.Root>
      )}

      <form className=" space-y-2" onSubmit={onSubmit}>
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

        <Button disabled={isSubmitting}>
          {grant ? "Update Grant" : "Submit New Grant "}{" "}
          {isSubmitting && <Spinner />}
        </Button>
      </form>
    </div>
  );
};

export default GrantForm;
