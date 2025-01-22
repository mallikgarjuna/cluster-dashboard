import React from "react";
import { Skeleton } from "@/app/components";

const PIGrantTableSkeleton = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Skeleton height="2rem" />
        <Skeleton height="2rem" />
        <Skeleton height="2rem" />
        <Skeleton height="2rem" />
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton height="2rem" />
        <Skeleton height="2rem" />
        <Skeleton height="2rem" />
        <Skeleton height="2rem" />
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton height="2rem" />
        <Skeleton height="2rem" />
        <Skeleton height="2rem" />
        <Skeleton height="2rem" />
      </div>
    </div>
  );
};

export default PIGrantTableSkeleton;
