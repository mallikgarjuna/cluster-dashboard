"use client";

import { resetPassword } from "@/lib/actions/authActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
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

  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormInputType>({
    resolver: zodResolver(ResetPasswordFormSchema),
  });

  const resetPass: SubmitHandler<ResetPasswordFormInputType> = async (
    resetPasswordFormData
  ) => {
    try {
      const result = await resetPassword(
        jwtUserId,
        resetPasswordFormData.password
      );
      if (result === "success")
        toast.success("Your password has been reset successfully.");

      //   redirect the user to signin page
      router.push("/auth/signin");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong in resetting password...");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(resetPass)}
      className="flex flex-col gap-2 border rounded-md p-2 m-2"
    >
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
