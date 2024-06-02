import Link from "next/link";
import React from "react";

const AdminPage = () => {
  return (
    <article>
      <h2>AdminPage</h2>
      <ul className="flex flex-col gap-3">
        <li>
          <Link href="/auth/createUser" color="blue">
            Create new user by Admin
          </Link>
        </li>
        <li>
          <Link href="/dashboard" color="blue">
            Dashboard
          </Link>
        </li>
      </ul>
    </article>
  );
};

export default AdminPage;
