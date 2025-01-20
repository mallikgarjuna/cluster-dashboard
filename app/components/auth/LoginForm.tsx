"use client";

import { LoginFormInputType, LoginFormSchema } from "@/lib/validationSchemas";
import { loginUser } from "@/lib/actions/authActions";
import { signIn } from "@/lib/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@nextui-org/react";
import { AuthError } from "next-auth";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { HiEye, HiEyeOff } from "react-icons/hi";

interface Props {
  callbackUrl?: string;
}
const LoginForm = ({ callbackUrl }: Props) => {
  const [isVisiblePass, setIsVisiblePass] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    trigger,
  } = useForm<LoginFormInputType>({
    resolver: zodResolver(LoginFormSchema),
  });

  const handleLoginUser: SubmitHandler<LoginFormInputType> = async (
    loginFormData,
  ) => {
    try {
      await signIn("credentials", loginFormData);
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case "CredentialsSignin": {
            toast.error("Invalid credentials");
            break;
          }
          default: {
            toast.error("Error. Could not sign in.");
          }
        }
      }

      // toast.error("Could not sign in.");

      // nextjs redirects throws an error, so we need to rethrow the error;
      throw error;
    }

    reset();
    // router.push(callbackUrl || "/");
    // router.push("/dashboard");
    router.push("/"); // b/c /dashboard is taking too long to load
  };

  const toggleVisiblePass = () => setIsVisiblePass((prev) => !prev);

  return (
    <form
      // onSubmit={handleSubmit(handleLoginUser)}
      action={async (formData) => {
        const resultTrigger = await trigger();
        if (!resultTrigger) return;

        // console.log("Before loginUser SA");
        const result = await loginUser(formData);
        // console.log("After loginUser SA");
        if (result) {
          // If result is returned, it means that the user is not logged in (see loginUser() SA);
          toast.error(result.message);
          return;
        } else {
          // if result is not returned, it means that the user is logged in
          // - and redirected to LoginPage (/auth/login) where the loginUser() SA is called;
          // - then (in parallel) based on `authorized()` callback, redirects appropriately;
          // console.log("result from loginUsr SA: ", result); // undefined
          toast.success("Successfully logged in!");

          reset();
          // router.push("/dashboard"); // not needed b/c signIn() redirects via `authorized()`;
        }
      }}
      className="flex min-w-96 flex-col items-center justify-center gap-2 rounded-md border p-2"
    >
      <div className="text-2xl font-bold">Log in Form</div>
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

export default LoginForm;
