import { Box, Flex } from "@radix-ui/themes";
import React from "react";
// import Skeleton from "react-loading-skeleton";
import { Skeleton } from "@/app/components";

const GrantFormSkeleton = () => {
  return (
    <Box className="section-panel max-w-4xl overflow-hidden">
      <div className="border-b border-[var(--color-border)] bg-[var(--color-surface-muted)] px-5 py-5 md:px-6">
        <Skeleton height="1rem" width="7rem" />
        <div className="mt-3">
          <Skeleton height="2.5rem" width="18rem" />
        </div>
        <div className="mt-3">
          <Skeleton height="1rem" width="28rem" />
        </div>
      </div>
      <Flex direction="column" gap="6" className="p-5 md:p-6">
        <Skeleton height="2rem" />
        <Skeleton height="10rem" />
        <Skeleton height="2rem" />
        <Skeleton height="2rem" />
        <Skeleton height="2rem" />
        <Skeleton height="2rem" />
        <Skeleton height="2rem" />
        <Skeleton height="10rem" />
      </Flex>
    </Box>
  );
};

export default GrantFormSkeleton;
