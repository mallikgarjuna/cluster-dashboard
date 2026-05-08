import { Metadata } from "next";
import dynamic from "next/dynamic";
import { Link } from "@/app/components";

const DynamicFundersTable = dynamic(
  () => import("@/app/(app)/dashboard/funders/_components/FundersTable"),
  { ssr: false, loading: () => <div>Loading...</div> },
);

const FundersPage = () => {
  return (
    <div className="flex flex-col gap-y-8">
      <FundersLinks />
      <DynamicFundersTable />
    </div>
  );
};

const FundersLinks = () => {
  return (
    <div>
      <article className="section-panel flex flex-col gap-4 p-8">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-secondary)]">
            Funding Records
          </p>
          <h2 className="font-display text-3xl font-bold tracking-[-0.04em] text-[var(--color-text-primary)]">
            Funders
          </h2>
        </div>
        <ol className="flex flex-col gap-3 text-sm text-[var(--color-text-secondary)]">
          <li>
            <Link href="/dashboard/funders/agency/new" className="indigo-link">
              Create a new funding agency
            </Link>
          </li>
          <li>
            <Link href="/dashboard/funders/programme/new" className="indigo-link">
              Create a new funding programme
            </Link>
          </li>
          <li>
            <Link href="/dashboard/funders/action/new" className="indigo-link">
              Create a new funding action
            </Link>
          </li>
          <li>
            <Link href="/dashboard/funders/call/new" className="indigo-link">
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
