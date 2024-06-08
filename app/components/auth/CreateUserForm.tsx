"use client";
import { CreateUserFormInputType } from "@/app/validationSchemas";
import { createUserByAdmin } from "@/lib/actions/authActions";
import { Button, Checkbox, Input, Select, SelectItem } from "@nextui-org/react";
import { Department, UserRole } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
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

const CreateUserForm = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    reset,
  } = useForm<CreateUserFormInputType>();

  const [isVisiblePass, setIsVisiblePass] = useState(false);
  const toggleVisiblePass = () => setIsVisiblePass((prev) => !prev);

  const createUserOnSubmit = async (
    createUserFormData: CreateUserFormInputType
  ) => {
    // Check the type of departmentId returned by the form
    // console.log(createUserFormData);

    try {
      const result = await createUserByAdmin(createUserFormData);
      if (!result.success) {
        toast.error(result.message);
      } else {
        toast.success(
          "The user created by Admin successfully!" + "\n" + result.message
        );
        reset();
        router.push("/admin");
      }
    } catch (error) {
      toast.error("Something went wrong...");
      console.error(error);
    }
  };

  const { data: departments, error, isLoading } = useDepartments();

  return (
    <form
      onSubmit={handleSubmit(createUserOnSubmit)}
      className="grid grid-cols-2 gap-3 p-2 place-self-stretch border rounded-md "
    >
      <h2 className="col-span-2 flex justify-center font-bold text-lg">
        Create a new user - by Admin
      </h2>

      <Input
        {...register("firstName")}
        errorMessage={errors.firstName?.message}
        isInvalid={!!errors.firstName}
        type="text"
        label="First Name"
        placeholder="Enter your first name"
        startContent={<HiUser />}
      />
      <Input
        {...register("lastName")}
        errorMessage={errors.lastName?.message}
        isInvalid={!!errors.lastName}
        type="text"
        label="Last Name"
        placeholder="Enter your last name"
        startContent={<HiUser />}
      />
      <Input
        {...register("email")}
        errorMessage={errors.email?.message}
        isInvalid={!!errors.email}
        type="email"
        label="Email"
        placeholder="Enter your email"
        startContent={<HiMail />}
        className="col-span-2"
      />
      <Input
        {...register("password")}
        errorMessage={errors.password?.message}
        isInvalid={!!errors.password}
        type={isVisiblePass ? "text" : "password"}
        label="Password"
        placeholder="Enter your password"
        startContent={<HiKey />}
        className="col-span-2"
        endContent={
          <Button isIconOnly variant="light" onPress={toggleVisiblePass}>
            {isVisiblePass ? <HiEye /> : <HiEyeOff />}
          </Button>
        }
      />
      <Input
        {...register("confirmPassword")}
        errorMessage={errors.confirmPassword?.message}
        isInvalid={!!errors.confirmPassword}
        type={isVisiblePass ? "text" : "password"}
        label="Confirm Password"
        placeholder="Confirm your password"
        startContent={<HiKey />}
        className="col-span-2"
      />
      <Controller
        control={control}
        name="role"
        render={({ field }) => (
          <Select
            {...register("role")}
            errorMessage={errors.role?.message}
            isInvalid={!!errors.role}
            label="User Role"
            placeholder="Select user role"
            startContent={<HiUser />}
            className="col-span-2"
          >
            {Object.values(UserRole).map((role) => (
              <SelectItem key={role} value={role}>
                {role}
              </SelectItem>
            ))}
          </Select>
        )}
      />

      <Controller
        control={control}
        name="departmentId"
        render={({ field }) => (
          <Select
            {...field}
            {...register("departmentId", { valueAsNumber: true })}
            onChange={(event) => field.onChange(parseInt(event.target.value))}
            errorMessage={errors.departmentId?.message}
            isInvalid={!!errors.departmentId}
            label="Department"
            placeholder="Select user's department"
            startContent={<HiOfficeBuilding />}
            className="col-span-2"
          >
            {departments?.map((department) => (
              <SelectItem
                key={department.newId}
                value={department.newId}
                textValue={department.nameShort ?? ""}
              >
                {department.nameShort}
              </SelectItem>
            )) || (
              <SelectItem key={0} value={0}>
                None
              </SelectItem>
            )}
          </Select>
        )}
      />
      {!!errors.departmentId && (
        <p className="text-sm text-red-500">{errors.departmentId.message}</p>
      )}

      <Controller
        control={control}
        name="accepted"
        render={({ field }) => (
          <Checkbox
            onChange={field.onChange}
            onBlur={field.onBlur}
            type="checkbox"
            className="col-span-2"
          >
            I accept the <Link href={"/terms"}> terms and conditions</Link>
          </Checkbox>
        )}
      />
      {!!errors.accepted && (
        <p className="col-span-2 text-red-500 text-xs">
          {errors.accepted.message}
        </p>
      )}

      <div className="col-span-2 flex justify-center">
        <Button
          type="submit"
          disabled={isSubmitting}
          isLoading={isSubmitting}
          color="primary"
          className="w-48"
        >
          {isSubmitting ? "Creating User..." : "Create User"}
        </Button>
      </div>
    </form>
  );
};

const useDepartments = () =>
  useQuery<Department[]>({
    queryKey: ["departments"],
    queryFn: () => axios.get("/api/departments").then((res) => res.data),
    staleTime: 60 * 1000, //60s
    retry: 3,
  });

export default CreateUserForm;
