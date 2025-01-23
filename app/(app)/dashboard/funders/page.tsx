import { Metadata } from "next";
import Link from "next/link";
import FundersTable from "./_components/FundersTable";
import { Suspense } from "react";
import dynamic from "next/dynamic";

const DynamicFundersTable = dynamic(
  () => import("@/app/(app)/dashboard/funders/_components/FundersTable"),
  { ssr: false, loading: () => <div>Loading...</div> },
);

const FundersPage = () => {
  return (
    <div className="flex flex-col gap-y-10">
      {/* FundersPage */}
      <FundersLinks />
      <DynamicFundersTable />
    </div>
  );
};

const FundersLinks = () => {
  return (
    <div>
      <article className="mt-6 flex flex-col gap-3">
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
    </div>
  );
};

export const metadata: Metadata = {
  title: "Cluster Dashboard - Funders",
  description: "View all funders",
};

export default FundersPage;
