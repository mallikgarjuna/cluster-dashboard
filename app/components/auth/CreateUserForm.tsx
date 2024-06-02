"use client";
import { CreateUserFormInputType } from "@/app/validationSchemas";
import { createUserByAdmin } from "@/lib/actions/authActions";
import { Button, Checkbox, Input } from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { HiEye, HiEyeOff, HiKey, HiMail, HiUser } from "react-icons/hi";

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
    try {
      const result = await createUserByAdmin(createUserFormData);
      if (!result.success) {
        toast.error(result.message);
      } else {
        toast.success(
          "The user created by Admin successfully!" + "\n" + result.message
        );
      }
      reset();
      router.push("/admin");
    } catch (error) {
      toast.error("Something went wrong...");
      console.error(error);
    }
  };

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

export default CreateUserForm;
