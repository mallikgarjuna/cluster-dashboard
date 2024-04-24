"use client";

import { SigninFormInputType, SigninFormSchema } from "@/app/validationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@nextui-org/react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { HiEye, HiEyeOff } from "react-icons/hi";

interface Props {
  callbackUrl?: string;
}
const SigninForm = ({ callbackUrl }: Props) => {
  const [isVisiblePass, setIsVisiblePass] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SigninFormInputType>({
    resolver: zodResolver(SigninFormSchema),
  });

  const signinUser: SubmitHandler<SigninFormInputType> = async (
    signinFormData
  ) => {
    const result = await signIn("credentials", {
      email: signinFormData.email,
      password: signinFormData.password,
      redirect: false,
    });

    // Here, result.ok is true if the HTTP req is successful; so check result.error;
    if (result?.error) {
      toast.error(`Something went wrong... ${result.error}`);
      return;
    }

    toast.success("Logged in successfully!");
    reset();
    // router.push(callbackUrl || "/");
    router.push("/dashboard");
  };

  const toggleVisiblePass = () => setIsVisiblePass((prev) => !prev);

  return (
    <form
      onSubmit={handleSubmit(signinUser)}
      className="flex flex-col gap-2 justify-center items-center p-2 min-w-96 border rounded-md"
    >
      <div className="text-2xl font-bold">Sign in Form</div>
      <Input
        {...register("email")}
        errorMessage={errors.email?.message}
        type="email"
        label="Email"
      />
      <Input
        {...register("password")}
        errorMessage={errors.password?.message}
        type={isVisiblePass ? "text" : "password"}
        label="Password"
        endContent={
          <button type="button" onClick={toggleVisiblePass}>
            {isVisiblePass ? <HiEye /> : <HiEyeOff />}
          </button>
        }
      />
      <Button type="submit" disabled={isSubmitting} isLoading={isSubmitting}>
        {isSubmitting ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
};

export default SigninForm;
