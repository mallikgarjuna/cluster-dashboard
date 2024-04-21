"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@nextui-org/react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { z } from "zod";

interface Props {
  jwtUserId: string;
}

const ResetPasswordFormSchema = z
  .object({
    password: z
      .string()
      .min(5, "Password must be at least 5 characters.")
      .max(52, "Password must be less than 52 characters."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type ResetPasswordFormInputType = z.infer<typeof ResetPasswordFormSchema>;

const ResetPasswordForm = ({ jwtUserId }: Props) => {
  const [visiblePass, setVisiblePass] = useState(false);
  const toggleVisiblePass = () => setVisiblePass((prev) => !prev);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormInputType>({
    resolver: zodResolver(ResetPasswordFormSchema),
  });

  return (
    <form className="flex flex-col gap-2 border rounded-md p-2 m-2">
      <div className="text-2xl font-bold">Reset Your Password</div>
      <Input
        type={visiblePass ? "text" : "password"}
        label="Password"
        // placeholder="Enter your new password."
        {...register("password")}
        errorMessage={errors.password?.message}
        endContent={
          <button type="button" onClick={toggleVisiblePass}>
            {visiblePass ? <HiEye /> : <HiEyeOff />}
          </button>
        }
      />
      <Input
        type={visiblePass ? "text" : "password"}
        label="Confirm Password"
        // placeholder="Re-enter your new password."
        {...register("confirmPassword")}
        errorMessage={errors.confirmPassword?.message}
      />
      <div className="flex justify-center">
        <Button
          type="submit"
          color="primary"
          disabled={isSubmitting}
          isLoading={isSubmitting}
        >
          {isSubmitting ? "Resetting..." : "Reset"}
        </Button>
      </div>
    </form>
  );
};

export default ResetPasswordForm;
