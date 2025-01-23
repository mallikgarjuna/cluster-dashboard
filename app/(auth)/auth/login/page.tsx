"use client";

import { Link } from "@/app/components";
import LoginForm from "@/app/components/auth/LoginForm";
import { Heading } from "@radix-ui/themes";

interface Props {
  searchParams: {
    callbackUrl?: string;
  };
}
const LoginPage = ({ searchParams }: Props) => {
  // console.log("searchParams: ", searchParams);

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <LoginForm />

      <Link href="/auth/forgotPassword">Forgot password?</Link>
      <div className="flex gap-2">
        <p>Don&apos;t have an account? </p>
        <em>Please contact your cluster Managing Director</em>
        {/* <Link href="/auth/signup">Sign up</Link> */}
      </div>
    </div>
  );
};

//
export default LoginPage;
