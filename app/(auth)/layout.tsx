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
      {children}
    </div>
  );
}
