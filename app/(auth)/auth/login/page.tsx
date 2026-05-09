"use client";

import { Link } from "@/app/components";
import LoginForm from "@/app/components/auth/LoginForm";

interface Props {
  searchParams: {
    callbackUrl?: string;
  };
}
const LoginPage = ({ searchParams: _searchParams }: Props) => {
  // console.log("searchParams: ", searchParams);

  return (
    <div className="flex w-full max-w-xl flex-col items-center justify-center gap-5">
      <LoginForm />

      <Link href="/auth/forgotPassword" className="indigo-link text-sm">
        Forgot password?
      </Link>
      <div className="text-center text-sm leading-6 text-[var(--color-text-secondary)]">
        <p>Don&apos;t have an account?</p>
        <em>Please contact your cluster Managing Director.</em>
      </div>
    </div>
  );
};

//
export default LoginPage;
