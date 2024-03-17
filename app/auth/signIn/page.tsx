"use client";

import { SignInFormInputFieldsType } from "@/app/validationSchemas";
import { Button, Heading, TextField } from "@radix-ui/themes";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";

const SignInPage = () => {
  const router = useRouter();
  const { handleSubmit, register } = useForm<SignInFormInputFieldsType>();

  const onSubmit: SubmitHandler<SignInFormInputFieldsType> = async (data) => {
    try {
      console.log(data);
      await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: true,
        callbackUrl: "/",
      });
      router.push("/");
      router.refresh();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="max-w-3xl">
      <Heading>SignInPage</Heading>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 justify-center items-center border-gray-300"
      >
        <TextField.Input
          type="email"
          placeholder="Email"
          {...register("email")}
        />
        <TextField.Input
          type="password"
          placeholder="Password"
          {...register("password")}
        />
        <Button>Sign In</Button>
      </form>
    </div>
  );
};

export default SignInPage;
