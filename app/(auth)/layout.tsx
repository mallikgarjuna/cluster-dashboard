import React from "react";
import ClusterLogo from "../components/ClusterLogo";

type AuthLayoutProps = {
  children: React.ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="page-shell flex min-h-screen flex-col items-center justify-center py-16">
      <div className="mb-10">
        <ClusterLogo />
      </div>
      <div className="w-full rounded-[20px] border border-[var(--color-border)] bg-white/70 p-6 backdrop-blur-sm md:p-8">
        {children}
      </div>
    </div>
  );
}
