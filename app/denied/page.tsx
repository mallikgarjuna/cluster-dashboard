import Link from "next/link";
import React from "react";

const DeniedPage = () => {
  return (
    <section className="flex flex-col gap-12 items-center">
      <h1 className="text-5xl">Access Denied</h1>
      <p>
        You are logged in, but you do not have the required access level to view
        this page.
      </p>
      <Link href="/" className="text-3xl underline">
        Return to Home Page
      </Link>
    </section>
  );
};

export default DeniedPage;
