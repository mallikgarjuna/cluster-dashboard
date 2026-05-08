import { Metadata } from "next";
import Link from "next/link";

const AdminPage = () => {
  return (
    <div className="space-y-8">
      <article className="section-panel flex flex-col gap-4 p-8">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
            Administration
          </p>
          <h2 className="text-3xl font-semibold tracking-[-0.03em] text-zinc-950">
            Admin Tasks
          </h2>
        </div>
        <ol className="flex flex-col gap-3 text-sm text-zinc-600">
          <li>
            <Link
              href="/auth/createUser"
              className="transition-colors duration-200 hover:text-zinc-950"
            >
              Create new user by Web-Admin
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard"
              className="transition-colors duration-200 hover:text-zinc-950"
            >
              Dashboard
            </Link>
          </li>
        </ol>
      </article>
      <article className="section-panel flex flex-col gap-4 p-8">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
            Funding Data
          </p>
          <h2 className="text-3xl font-semibold tracking-[-0.03em] text-zinc-950">
            Funders
          </h2>
        </div>
        <ol className="flex flex-col gap-3 text-sm text-zinc-600">
          <li>
            <Link
              href="/dashboard/funders/agency/new"
              className="transition-colors duration-200 hover:text-zinc-950"
            >
              Create a new funding agency
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/funders/programme/new"
              className="transition-colors duration-200 hover:text-zinc-950"
            >
              Create a new funding programme
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/funders/action/new"
              className="transition-colors duration-200 hover:text-zinc-950"
            >
              Create a new funding action
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/funders/call/new"
              className="transition-colors duration-200 hover:text-zinc-950"
            >
              Create a new funding call
            </Link>
          </li>
        </ol>
      </article>
    </div>
  );
};

export const metadata: Metadata = {
  title: "Cluster Dashboard - Admin",
  description: "Admin tasks",
};

export default AdminPage;
