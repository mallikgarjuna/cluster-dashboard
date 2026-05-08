"use client";

import { registerUser } from "@/lib/actions/authActions";
import { SignupFormInputType, SignupFormSchema } from "@/lib/validationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FieldError } from "@/components/ui/field-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { HiEye, HiEyeOff, HiKey, HiMail, HiUser } from "react-icons/hi";

type FieldWrapperProps = {
  label: string;
  error?: string;
  className?: string;
  icon?: ReactNode;
  children: ReactNode;
};

function FieldWrapper({
  label,
  error,
  className,
  icon,
  children,
}: FieldWrapperProps) {
  return (
    <div className={className}>
      <Label className="mb-2 block">{label}</Label>
      <div className="relative">
        {icon ? (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
            {icon}
          </span>
        ) : null}
        {children}
      </div>
      <FieldError className="mt-1" message={error} />
    </div>
  );
}

const SignupForm = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormInputType>({
    resolver: zodResolver(SignupFormSchema),
  });

  const [isVisiblePass, setIsVisiblePass] = useState(false);
  const toggleVisiblePass = () => setIsVisiblePass((prev) => !prev);

  const saveUser: SubmitHandler<SignupFormInputType> = async (
    singupFormData,
  ) => {
    try {
      const result = await registerUser(singupFormData);
      if (!result.success) {
        toast.error(result.message);
      } else {
        toast.success(
          "The user registered successfully!" + "\n" + result.message,
        );
        reset();
        router.push("/auth/login");
      }
    } catch (error) {
      toast.error("Something went wrong...");
      console.error(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(saveUser)}
      className="grid grid-cols-2 gap-3 place-self-stretch rounded-md border p-2"
    >
      <FieldWrapper
        label="First Name"
        error={errors.firstName?.message}
        icon={<HiUser />}
      >
        <Input
          {...register("firstName")}
          type="text"
          placeholder="Enter your first name"
          className="pl-9"
        />
      </FieldWrapper>

      <FieldWrapper
        label="Last Name"
        error={errors.lastName?.message}
        icon={<HiUser />}
      >
        <Input
          {...register("lastName")}
          type="text"
          placeholder="Enter your last name"
          className="pl-9"
        />
      </FieldWrapper>

      <FieldWrapper
        label="Email"
        error={errors.email?.message}
        className="col-span-2"
        icon={<HiMail />}
      >
        <Input
          {...register("email")}
          type="email"
          placeholder="Enter your email"
          className="pl-9"
        />
      </FieldWrapper>

      <FieldWrapper
        label="Password"
        error={errors.password?.message}
        className="col-span-2"
        icon={<HiKey />}
      >
        <Input
          {...register("password")}
          type={isVisiblePass ? "text" : "password"}
          placeholder="Enter your password"
          className="pl-9 pr-10"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 -translate-y-1/2"
          aria-label={isVisiblePass ? "Hide password" : "Show password"}
          onClick={toggleVisiblePass}
        >
          {isVisiblePass ? <HiEyeOff /> : <HiEye />}
        </Button>
      </FieldWrapper>

      <FieldWrapper
        label="Confirm Password"
        error={errors.confirmPassword?.message}
        className="col-span-2"
        icon={<HiKey />}
      >
        <Input
          {...register("confirmPassword")}
          type={isVisiblePass ? "text" : "password"}
          placeholder="Re-enter to confirm password"
          className="pl-9"
        />
      </FieldWrapper>

      <Controller
        control={control}
        name="accepted"
        render={({ field }) => (
          <div className="col-span-2 space-y-2">
            <label className="flex items-start gap-2 text-sm">
              <Checkbox
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(Boolean(checked))}
                onBlur={field.onBlur}
              />
              <span>
                I accept the <Link href="/terms">terms and conditions</Link>.
              </span>
            </label>
            <FieldError message={errors.accepted?.message} />
          </div>
        )}
      />

      <div className="col-span-2 flex justify-center">
        <Button type="submit" disabled={isSubmitting} className="w-48">
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {isSubmitting ? "Signing up..." : "Sign up"}
        </Button>
      </div>
    </form>
  );
};

export default SignupForm;
