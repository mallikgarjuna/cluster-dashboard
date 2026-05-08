"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React from "react";

const GoBackButton = () => {
  const router = useRouter();

  return (
    <Button type="button" variant="destructive" onClick={() => router.back()}>
      Go Back
    </Button>
  );
};

export default GoBackButton;
