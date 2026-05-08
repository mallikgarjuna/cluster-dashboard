import { Flex, Grid } from "@radix-ui/themes";
import { Metadata } from "next";
import Link from "next/link";
import { HiArrowRight } from "react-icons/hi";
import ClusterLogo from "../components/ClusterLogo";

export default function HomePage() {
  // const session = await checkAuth();

  return (
    <main className="page-shell flex min-h-screen flex-col gap-10 md:gap-12">
      <div className="flex h-20 items-end rounded-lg bg-blue-200 px-4 py-5 md:h-52 md:px-10 md:py-8">
        <ClusterLogo />
      </div>
      <Grid columns={{ initial: "1", md: "2" }} gap="8" className="items-start">
        <Flex direction="column" gap="6" className="max-w-2xl">
          <div className="space-y-3 text-zinc-800">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
              Research Administration
            </p>
            <div className="space-y-3">
              <h1 className="text-4xl font-bold tracking-[-0.04em] text-zinc-950 md:text-5xl md:leading-[1.05]">
                Welcome to Cluster Dashboard.
              </h1>
              <p className="max-w-xl text-lg leading-8 text-zinc-600">
                This is the dashboard for the cluster BST. Track grants,
                manage funders, and keep operational research workflows in one
                calm, centralized workspace.
              </p>
            </div>
          </div>
          {/* {!session && ( */}
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-4 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white shadow-sm transition-colors duration-200 hover:bg-blue-400 md:text-base"
            prefetch={false}
          >
            <span>Log in</span> <HiArrowRight />
          </Link>
          {/* )} */}
        </Flex>
        <div className="section-panel flex min-h-[260px] flex-col justify-between p-8">
          <div className="space-y-3">
            <p className="text-sm font-medium text-zinc-500">
              Design Direction
            </p>
            <p className="text-2xl font-semibold tracking-[-0.03em] text-zinc-950">
              Quiet whitespace, disciplined hierarchy, one blue accent.
            </p>
          </div>
          <p className="max-w-md text-sm leading-7 text-zinc-600">
            The interface should feel light and dependable, with white surfaces,
            soft borders, and straightforward navigation that keeps attention on
            the work rather than the chrome.
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
