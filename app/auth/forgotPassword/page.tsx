"use client";
import {
  ForgotPasswordFormInputType,
  ForgotPasswordFormSchema,
} from "@/app/validationSchemas";
import { forgotPassword } from "@/lib/actions/authActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@nextui-org/react";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaUserLock } from "react-icons/fa";
import { HiMail } from "react-icons/hi";
import { z } from "zod";

const ForgotPasswordPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ForgotPasswordFormInputType>({
    resolver: zodResolver(ForgotPasswordFormSchema),
  });

  const submitRequest: SubmitHandler<ForgotPasswordFormInputType> = async (
    ForgotPasswordFormData
  ) => {
    try {
      const result = await forgotPassword(ForgotPasswordFormData);
      toast.success("Reset password link was sent to your email.");
      reset();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong...");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 items-center place-items-center">
      <form
        onSubmit={handleSubmit(submitRequest)}
        className="flex flex-col gap-2 place-self-stretch"
      >
        <div className="text-2xl text-center font-bold">Enter Your Email</div>
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
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </form>
      <FaUserLock size={200} />
    </div>
  );
};

export default ForgotPasswordPage;
