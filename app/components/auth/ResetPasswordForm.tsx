"use client";

import { resetPassword } from "@/lib/actions/authActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
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
    trigger,
    getValues,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormInputType>({
    resolver: zodResolver(ResetPasswordFormSchema),
  });

  const handleAction = async (_formData: FormData) => {
    const resultTrigger = await trigger();
    if (!resultTrigger) return;

    const resetPasswordFormData = getValues();

    const result = await resetPassword(
      jwtUserId,
      resetPasswordFormData.password,
    );
    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);
    reset();
    router.push("/auth/login");
  };

  return (
    <form
      action={handleAction}
      className="m-2 flex flex-col gap-2 rounded-md border p-2"
    >
      <div className="text-2xl font-bold">Reset Your Password</div>

      <div>
        <Label className="mb-2 block">Password</Label>
        <div className="relative">
          <Input
            type={visiblePass ? "text" : "password"}
            {...register("password")}
            className="pr-10"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2"
            aria-label={visiblePass ? "Hide password" : "Show password"}
            onClick={toggleVisiblePass}
          >
            {visiblePass ? <HiEye /> : <HiEyeOff />}
          </Button>
        </div>
        <FieldError className="mt-1" message={errors.password?.message} />
      </div>

      <div>
        <Label className="mb-2 block">Confirm Password</Label>
        <Input
          type={visiblePass ? "text" : "password"}
          {...register("confirmPassword")}
        />
        <FieldError
          className="mt-1"
          message={errors.confirmPassword?.message}
        />
      </div>

      <div className="flex justify-center">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {isSubmitting ? "Resetting..." : "Reset"}
        </Button>
      </div>
    </form>
  );
};

export default ResetPasswordForm;
