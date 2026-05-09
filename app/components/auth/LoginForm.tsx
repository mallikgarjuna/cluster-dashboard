"use client";

import { loginUser } from "@/lib/actions/authActions";
import { LoginFormInputType, LoginFormSchema } from "@/lib/validationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { HiEye, HiEyeOff } from "react-icons/hi";
import LogInFormButton from "./LogInFormButton";

interface Props {
  callbackUrl?: string;
}

const LoginForm = ({ callbackUrl: _callbackUrl }: Props) => {
  const [isVisiblePass, setIsVisiblePass] = useState(false);
  const {
    register,
    trigger,
    formState: { errors },
    reset,
  } = useForm<LoginFormInputType>({
    resolver: zodResolver(LoginFormSchema),
  });

  const toggleVisiblePass = () => setIsVisiblePass((prev) => !prev);

  const handleAction = async (formData: FormData) => {
    const resultTrigger = await trigger();
    if (!resultTrigger) return;

    const result = await loginUser(formData);
    if (result) {
      toast.error(result.message);
      return;
    }

    toast.success("Successfully logged in!");
    reset();
  };

  return (
    <form
      action={handleAction}
      className="auth-panel flex w-full flex-col gap-5 border-none bg-transparent p-0"
    >
      <div className="space-y-2 text-center">
        <div className="auth-heading">Log in</div>
        <p className="auth-subtle-copy">
          Access the cluster workspace with your institutional credentials.
        </p>
      </div>

      <div className="w-full">
        <Label className="mb-2 block">Email</Label>
        <Input {...register("email")} type="email" />
        <FieldError className="mt-1" message={errors.email?.message} />
      </div>

      <div className="w-full">
        <Label className="mb-2 block">Password</Label>
        <div className="relative">
          <Input
            {...register("password")}
            type={isVisiblePass ? "text" : "password"}
            className="pr-10"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]"
            aria-label={isVisiblePass ? "Hide password" : "Show password"}
            onClick={toggleVisiblePass}
          >
            {isVisiblePass ? <HiEye /> : <HiEyeOff />}
          </Button>
        </div>
        <FieldError className="mt-1" message={errors.password?.message} />
      </div>

      <div className="flex justify-center pt-1">
        <LogInFormButton />
      </div>
    </form>
  );
};

export default LoginForm;
