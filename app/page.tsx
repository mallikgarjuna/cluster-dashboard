import { Flex, Grid } from "@radix-ui/themes";
import { Metadata } from "next";
import Link from "next/link";
import { HiArrowRight } from "react-icons/hi";

export default async function HomePage() {
  return (
    <Grid columns={{ initial: "1", md: "2" }} gap="5">
      <Flex direction="column" gap="5">
        <Link
          href="/auth/signin"
          className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
        >
          <span>Log in</span> <HiArrowRight />
        </Link>
      </Flex>
    </Grid>
  );
}

export const metadata: Metadata = {
  title: "Cluster Dashboard - Homepage",
  description: "View a summary of grants",
};
