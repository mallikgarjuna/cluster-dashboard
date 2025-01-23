import { checkAuth } from "@/lib/server-utils";
import { Flex, Grid } from "@radix-ui/themes";
import { Metadata } from "next";
import Link from "next/link";
import { HiArrowRight } from "react-icons/hi";
import ClusterLogo from "../components/ClusterLogo";

export default async function HomePage() {
  // const session = await checkAuth();

  return (
    <main className="flex min-h-screen flex-col gap-6 p-6">
      <div className="flex h-20 items-end rounded-lg bg-blue-200 p-4 md:h-52">
        <ClusterLogo />
      </div>
      <Grid columns={{ initial: "1", md: "2" }} gap="5">
        <Flex direction="column" gap="5">
          <div
            className={`text-xl text-gray-800 md:text-3xl md:leading-normal`}
          >
            <strong>Welcome to Cluster Dashboard.</strong>
            <p>This is the dashboard for the cluster BST.</p>
          </div>
          {/* {!session && ( */}
          <Link
            href="/auth/login"
            className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
            prefetch={false}
          >
            <span>Log in</span> <HiArrowRight />
          </Link>
          {/* )} */}
        </Flex>
      </Grid>
    </main>
  );
}

export const metadata: Metadata = {
  title: "Cluster Dashboard - Homepage",
  description: "View a summary of grants",
};
