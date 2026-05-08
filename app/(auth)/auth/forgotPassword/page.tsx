"use client";

import ForgotPasswordForm from "@/app/components/auth/ForgotPasswordForm";
import { FaUserLock } from "react-icons/fa";

const ForgotPasswordPage = () => {
  return (
    <div className="auth-panel flex w-full max-w-2xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
      <div className="max-w-md space-y-3">
        <h1 className="auth-heading">Forgot your password?</h1>
        <p className="auth-subtle-copy">
          Send a reset link to your email and regain access to the dashboard
          with minimal friction.
        </p>
        <ForgotPasswordForm />
      </div>

      <div className="hidden h-28 w-28 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-primary-soft)] text-[var(--color-primary)] md:flex">
        <FaUserLock size={48} />
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
