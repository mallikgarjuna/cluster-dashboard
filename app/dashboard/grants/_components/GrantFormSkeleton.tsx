import { Box, Flex } from "@radix-ui/themes";
import React from "react";
// import Skeleton from "react-loading-skeleton";
import { Skeleton } from "@/app/components";

const GrantFormSkeleton = () => {
  return (
    <Box className="max-w-xl">
      <Flex direction="column" gap="6">
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
