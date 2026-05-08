import ResetPasswordForm from "@/app/components/auth/ResetPasswordForm";
import { verifyJwt } from "@/lib/jwt";
import React from "react";

interface Props {
  params: { jwt: string };
}
const ResetPasswordPage = ({ params }: Props) => {
  const payload = verifyJwt(params.jwt);
  if (!payload || !params.jwt)
    return (
      <div className="auth-panel text-center text-xl font-semibold text-red-500">
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
