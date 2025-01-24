"use client";

import { forgotPassword } from "@/lib/actions/authActions";
import {
  ForgotPasswordFormInputType,
  ForgotPasswordFormSchema,
} from "@/lib/validationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { HiMail } from "react-icons/hi";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const {
    register,
    trigger,
    getValues,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ForgotPasswordFormInputType>({
    resolver: zodResolver(ForgotPasswordFormSchema),
  });

  // const submitRequest: SubmitHandler<ForgotPasswordFormInputType> = async (
  //   ForgotPasswordFormData,
  // ) => {
  //   try {
  //     const result = await forgotPassword(ForgotPasswordFormData);
  //     toast.success("Reset password link was sent to your email.");
  //     reset();
  //   } catch (error) {
  //     // console.log(error);
  //     toast.error("Something went wrong..." + "\n" + getErrorMessage(error));
  //   }
  // };

  const handleAction = async (formData: FormData) => {
    const resultTrigger = await trigger();
    if (!resultTrigger) {
      return;
    }

    const forgotPasswordFormData = getValues();

    const result = await forgotPassword(forgotPasswordFormData);
    if (!result.success) {
      toast.error(result.message);
    } else {
      toast.success(result.message);
      reset();
      router.push("/");
    }
  };

  return (
    <form
      // onSubmit={handleSubmit(submitRequest)}
      action={handleAction}
      className="flex flex-col gap-2 place-self-stretch"
    >
      <Input
        type="email"
        label="Email"
        placeholder="Enter your email"
        {...register("email")}
        startContent={<HiMail />}
        errorMessage={errors.email?.message}
      />
      <Button
        type="submit"
        color="primary"
        isLoading={isSubmitting}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Sending..." : "Send me a reset link"}
      </Button>
    </form>
  );
}
