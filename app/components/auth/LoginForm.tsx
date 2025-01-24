"use client";

import { loginUser } from "@/lib/actions/authActions";
import { LoginFormInputType, LoginFormSchema } from "@/lib/validationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@nextui-org/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { HiEye, HiEyeOff } from "react-icons/hi";
import LogInFormButton from "./LogInFormButton";

interface Props {
  callbackUrl?: string;
}
const LoginForm = ({ callbackUrl }: Props) => {
  const [isVisiblePass, setIsVisiblePass] = useState(false);
  const {
    register,
    trigger,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginFormInputType>({
    resolver: zodResolver(LoginFormSchema),
  });

  const toggleVisiblePass = () => setIsVisiblePass((prev) => !prev);

  const handleAction = async (formData: FormData) => {
    const resultTrigger = await trigger();
    if (!resultTrigger) return;

    // console.log("Before loginUser SA");
    const result = await loginUser(formData);
    // console.log("After loginUser SA");
    if (result) {
      // If result is returned, it means that the user is not logged in (see loginUser() SA);
      toast.error(result.message);
      return;
    } else {
      // if result is not returned, it means that the user is logged in
      // - and redirected to LoginPage (/auth/login) where the loginUser() SA is called;
      // - then (in parallel) based on `authorized()` callback, redirects appropriately;
      // console.log("result from loginUsr SA: ", result); // undefined
      toast.success("Successfully logged in!");

      reset();
      // router.push("/dashboard"); // not needed b/c signIn() redirects via `authorized()`;
    }
  };

  return (
    <form
      // onSubmit={handleSubmit(handleLoginUser)}
      action={handleAction}
      className="flex min-w-96 flex-col items-center justify-center gap-2 rounded-md border p-2"
    >
      <div className="text-2xl font-bold">Log in Form</div>
      <Input
        {...register("email")}
        errorMessage={errors.email?.message}
        type="email"
        label="Email"
      />
      <Input
        {...register("password")}
        errorMessage={errors.password?.message}
        type={isVisiblePass ? "text" : "password"}
        label="Password"
        endContent={
          <button type="button" onClick={toggleVisiblePass}>
            {isVisiblePass ? <HiEye /> : <HiEyeOff />}
          </button>
        }
      />

      <LogInFormButton />
    </form>
  );
};

export default LoginForm;
