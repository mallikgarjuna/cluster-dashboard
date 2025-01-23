import React from "react";
import ClusterLogo from "../ui/ClusterLogo";

type AuthLayoutProps = {
  children: React.ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-y-8">
      <ClusterLogo />
      {children}
    </div>
  );
}
