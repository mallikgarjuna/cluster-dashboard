import { Flex, Grid } from "@radix-ui/themes";
import { Metadata } from "next";
import Link from "next/link";
import { HiArrowRight } from "react-icons/hi";
import ClusterLogo from "../components/ClusterLogo";

export default function HomePage() {
  // const session = await checkAuth();

  return (
    <main className="page-shell flex min-h-screen flex-col gap-10 md:gap-12">
      <div className="section-panel flex min-h-[220px] flex-col justify-between overflow-hidden rounded-[20px] bg-white px-6 py-6 md:px-10 md:py-8">
        <div className="flex items-start justify-between gap-6">
          <ClusterLogo />
          <span className="hidden rounded-full bg-[var(--color-primary-soft)] px-3 py-1 text-xs font-medium text-[var(--color-primary)] md:inline-flex">
            Research Workspace
          </span>
        </div>
        <div className="flex justify-end">
          <div className="h-20 w-20 rounded-full bg-[var(--color-secondary)]/10" />
        </div>
      </div>
      <Grid columns={{ initial: "1", md: "2" }} gap="8" className="items-start">
        <Flex direction="column" gap="6" className="max-w-2xl">
          <div className="space-y-3 text-[var(--color-text-primary)]">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-primary)]">
              Research Administration
            </p>
            <div className="space-y-3">
              <h1 className="font-display text-5xl font-bold tracking-[-0.05em] text-[var(--color-text-primary)] md:text-6xl md:leading-[1.02]">
                Welcome to Cluster Dashboard.
              </h1>
              <p className="max-w-xl text-[15px] leading-8 text-[var(--color-text-secondary)] md:text-base">
                This is the dashboard for the cluster BST. Track grants,
                manage funders, and keep operational research workflows in one
                calm, centralized workspace.
              </p>
            </div>
          </div>
          {/* {!session && ( */}
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-4 self-start rounded-md bg-[var(--color-primary)] px-6 py-3 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-px hover:bg-[var(--color-primary-hover)] hover:shadow-[0_4px_12px_rgba(99,102,241,0.35)] md:text-base"
            prefetch={false}
          >
            <span>Log in</span> <HiArrowRight />
          </Link>
          <div className="flex items-center gap-3 text-sm text-[var(--color-text-secondary)]">
            <span className="inline-block h-2 w-2 rounded-full bg-[var(--color-secondary)]" />
            Designed for dependable, high-density operational work.
          </div>
        </Flex>
        <div className="section-panel flex min-h-[260px] flex-col justify-between p-8 hover:-translate-y-0 hover:shadow-none">
          <div className="space-y-3">
            <p className="text-sm font-medium uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
              Design Direction
            </p>
            <p className="font-display text-[28px] font-bold tracking-[-0.04em] text-[var(--color-text-primary)]">
              Editorial hierarchy, warm surfaces, indigo interaction.
            </p>
          </div>
          <p className="max-w-md text-sm leading-7 text-[var(--color-text-secondary)]">
            The interface should feel precise and current, with framed white
            panels, confident display typography, and a stronger interactive
            color system that avoids monochrome dullness.
          </p>
        </div>
      </Grid>
    </main>
  );
}

export const metadata: Metadata = {
  title: "Cluster Dashboard - Homepage",
  description: "View a summary of grants",
};
