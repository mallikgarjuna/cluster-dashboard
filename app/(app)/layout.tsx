import React from "react";
import NavBar from "../components/NavBar";

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
