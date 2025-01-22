import React from "react";
import NavBar from "../NavBar";

type AppLayoutProps = {
  children: React.ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <>
      <NavBar />
      {children}
    </>
  );
}
