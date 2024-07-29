import Link from "next/link";
import React from "react";

const AdminPage = () => {
  return (
    <>
      <article className="flex flex-col gap-3">
        <h2 className="text-3xl">Admin Tasks</h2>
        <ol className="flex flex-col gap-3">
          <li>
            <Link
              href="/auth/createUser"
              color="blue"
              className="text-blue-500"
            >
              Create new user by Admin
            </Link>
          </li>
          <li>
            <Link href="/dashboard" color="blue" className="text-blue-500">
              Dashboard
            </Link>
          </li>
        </ol>
      </article>
      <article className="flex flex-col gap-3 mt-6">
        <h2 className="text-3xl">Funders</h2>
        <ol className="flex flex-col gap-3">
          <li>
            <Link
              href="/dashboard/funders/agency/new"
              color="blue"
              className="text-blue-500"
            >
              Create a new funding agency
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/funders/programme/new"
              color="blue"
              className="text-blue-500"
            >
              Create a new funding programme
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/funders/action/new"
              color="blue"
              className="text-blue-500"
            >
              Create a new funding action
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/funders/call/new"
              color="blue"
              className="text-blue-500"
            >
              Create a new funding call
            </Link>
          </li>
        </ol>
      </article>
    </>
  );
};

export default AdminPage;
