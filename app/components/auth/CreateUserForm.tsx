"use client";

import { createUserByAdmin } from "@/lib/actions/authActions";
import {
  CreateUserFormInputType,
  CreateUserFormSchema,
} from "@/lib/validationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FieldError } from "@/components/ui/field-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Department, UserRole } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  HiEye,
  HiEyeOff,
  HiKey,
  HiMail,
  HiOfficeBuilding,
  HiUser,
} from "react-icons/hi";

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

const CreateUserForm = () => {
  const { data: departments } = useDepartments();
  const router = useRouter();
  const {
    register,
    trigger,
    getValues,
    formState: { errors, isSubmitting },
    control,
    reset,
  } = useForm<CreateUserFormInputType>({
    resolver: zodResolver(CreateUserFormSchema),
  });

  const [isVisiblePass, setIsVisiblePass] = useState(false);
  const toggleVisiblePass = () => setIsVisiblePass((prev) => !prev);

  const handleAction = async (_formData: FormData) => {
    const resultTrigger = await trigger();
    if (!resultTrigger) return;

    const createUserData = getValues();
    const result = await createUserByAdmin(createUserData);
    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);
    reset();
    router.push("/admin");
  };

  return (
    <form
      action={handleAction}
      className="grid grid-cols-2 gap-3 place-self-stretch rounded-md border p-2"
    >
      <h2 className="col-span-2 flex justify-center text-lg font-bold">
        Create a new user - by Admin
      </h2>

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
          {isVisiblePass ? <HiEye /> : <HiEyeOff />}
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
          placeholder="Confirm your password"
          className="pl-9"
        />
      </FieldWrapper>

      <Controller
        control={control}
        name="role"
        render={({ field }) => (
          <FieldWrapper
            label="User Role"
            error={errors.role?.message}
            className="col-span-2"
            icon={<HiUser />}
          >
            <Select
              value={field.value}
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <SelectTrigger className="pl-9">
                <SelectValue placeholder="Select user role" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(UserRole).map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FieldWrapper>
        )}
      />

      <Controller
        control={control}
        name="departmentId"
        render={({ field }) => (
          <FieldWrapper
            label="Department"
            error={errors.departmentId?.message}
            className="col-span-2"
            icon={<HiOfficeBuilding />}
          >
            <Select
              value={field.value}
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <SelectTrigger className="pl-9">
                <SelectValue placeholder="Select user's department" />
              </SelectTrigger>
              <SelectContent>
                {departments?.map((department) => (
                  <SelectItem key={department.id} value={department.id}>
                    {department.nameShort}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FieldWrapper>
        )}
      />

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
                I accept the <Link href="/terms">terms and conditions</Link>
              </span>
            </label>
            <FieldError message={errors.accepted?.message} />
          </div>
        )}
      />

      <div className="col-span-2 flex flex-col items-center justify-center gap-2">
        <Button type="submit" disabled={isSubmitting} className="w-48">
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {isSubmitting ? "Creating User..." : "Create User"}
        </Button>
        <em>Note: An activation email will be sent to the Web Admin</em>
      </div>
    </form>
  );
};

const useDepartments = () =>
  useQuery<Department[]>({
    queryKey: ["departments"],
    queryFn: () => axios.get("/api/departments").then((res) => res.data),
    staleTime: 60 * 1000,
    retry: 3,
  });

export default CreateUserForm;
