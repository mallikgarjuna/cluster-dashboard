"use client";

import { Button, Checkbox, Input, Link } from "@nextui-org/react";
import { HiEye, HiEyeOff, HiKey, HiMail, HiUser } from "react-icons/hi";
import React, { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  SignupFormInputFieldsDataType,
  SignupFormSchema,
} from "@/app/validationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";

const SignupForm = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SignupFormInputFieldsDataType>({
    resolver: zodResolver(SignupFormSchema),
  });

  const [isVisiblePass, setIsVisiblePass] = useState(false);
  const toggleVisiblePass = () => setIsVisiblePass((prev) => !prev);

  const saveUser: SubmitHandler<SignupFormInputFieldsDataType> = async (
    data
  ) => {
    console.log(data);
  };

  return (
    <form
      onSubmit={handleSubmit(saveUser)}
      className="grid grid-cols-2 gap-3 p-2 place-self-stretch border rounded-md"
    >
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
        endContent={
          <Button isIconOnly variant="light" onPress={toggleVisiblePass}>
            {isVisiblePass ? <HiEyeOff /> : <HiEye />}
          </Button>
        }
        className="col-span-2"
      />
      <Input
        {...register("confirmPassword")}
        errorMessage={errors.confirmPassword?.message}
        isInvalid={!!errors.confirmPassword}
        type={isVisiblePass ? "text" : "password"}
        label="Confirm Password"
        placeholder="Renter to confirm password"
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
            I accept the <Link href="/terms"> terms and conditions</Link>.
          </Checkbox>
        )}
      />
      {!!errors.accepted && (
        <p className="col-span-2 text-red-500 text-xs">
          {errors.accepted.message}
        </p>
      )}
      <div className="col-span-2 flex justify-center">
        <Button type="submit" color="primary" className="w-48">
          Sign up
        </Button>
      </div>
    </form>
  );
};

export default SignupForm;
