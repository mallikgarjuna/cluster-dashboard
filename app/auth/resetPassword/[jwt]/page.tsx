import ResetPasswordForm from "@/app/components/auth/ResetPasswordForm";
import { verifyJwt } from "@/lib/jwt";
import React from "react";

interface Props {
  params: { jwt: string };
}
const ResetPasswordPage = ({ params }: Props) => {
  const payload = verifyJwt(params.jwt);
  if (!payload)
    return (
      <div className="h-screen flex items-center justify-center text-2xl text-red-500">
        The URL is not valid.
      </div>
    );

  return (
    <div className="flex justify-center">
      <ResetPasswordForm jwtUserId={params.jwt} />
    </div>
  );
};

export default ResetPasswordPage;
