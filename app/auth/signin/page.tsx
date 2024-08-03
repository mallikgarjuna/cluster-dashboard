"use client";

import { Link } from "@/app/components";
import SigninForm from "@/app/components/auth/SigninForm";
import { Heading } from "@radix-ui/themes";

interface Props {
  searchParams: {
    callbackUrl?: string;
  };
}
const SigninPage = ({ searchParams }: Props) => {
  // console.log("searchParams: ", searchParams);

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <SigninForm callbackUrl={searchParams.callbackUrl} />

      <Link href="/auth/forgotPassword">Forgot password?</Link>
      <div className="flex gap-2">
        <p>Don&apos;t have an account? </p>
        <Link href="/auth/signup">Sign up</Link>
      </div>
    </div>
  );
};

//
export default SigninPage;
