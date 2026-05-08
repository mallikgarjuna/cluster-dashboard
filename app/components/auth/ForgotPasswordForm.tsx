"use client";

import { forgotPassword } from "@/lib/actions/authActions";
import {
  ForgotPasswordFormInputType,
  ForgotPasswordFormSchema,
} from "@/lib/validationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { HiMail } from "react-icons/hi";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const {
    register,
    trigger,
    getValues,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ForgotPasswordFormInputType>({
    resolver: zodResolver(ForgotPasswordFormSchema),
  });

  const handleAction = async (_formData: FormData) => {
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
    <form action={handleAction} className="flex flex-col gap-5">
      <div>
        <Label className="mb-2 block">Email</Label>
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">
            <HiMail />
          </span>
          <Input
            type="email"
            placeholder="Enter your email"
            {...register("email")}
            className="pl-9"
          />
        </div>
        <FieldError className="mt-1" message={errors.email?.message} />
      </div>
      <Button type="submit" disabled={isSubmitting} className="self-start">
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {isSubmitting ? "Sending..." : "Send me a reset link"}
      </Button>
    </form>
  );
}
