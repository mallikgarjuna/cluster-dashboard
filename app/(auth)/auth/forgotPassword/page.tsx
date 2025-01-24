"use client";

import ForgotPasswordForm from "@/app/components/auth/ForgotPasswordForm";
import { FaUserLock } from "react-icons/fa";

const ForgotPasswordPage = () => {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-center text-2xl font-bold">
        Send password reset link to your email
      </h1>

      <div className="flex gap-2">
        <ForgotPasswordForm />

        <FaUserLock size={100} />
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
