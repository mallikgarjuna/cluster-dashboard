"use client";

import { Button, TextField } from "@radix-ui/themes";
import SimpleMDE from "react-simplemde-editor";
// import dynamic from "next/dynamic";
// const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
//   ssr: false,
// });
import "easymde/dist/easymde.min.css";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";

interface GrantForm {
  title: string;
  description: string;
}

const NewGrantPage = () => {
  const router = useRouter();
  const { register, control, handleSubmit } = useForm<GrantForm>();

  return (
    <form
      className="max-w-xl space-y-2"
      onSubmit={handleSubmit(async (data) => {
        await axios.post("/api/grants", data);
        router.push("/grants");
      })}
    >
      <TextField.Root>
        <TextField.Input placeholder="Title" {...register("title")} />
      </TextField.Root>
      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <SimpleMDE placeholder="Description" {...field} />
        )}
      />

      <Button>Submit New Grant</Button>
    </form>
  );
};

export default NewGrantPage;
