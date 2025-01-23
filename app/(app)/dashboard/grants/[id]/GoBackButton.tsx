"use client";

import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React from "react";

const GoBackButton = () => {
  const router = useRouter();

  return (
    <Button type="button" color="danger" onClick={() => router.back()}>
      Go Back
    </Button>
  );
};

export default GoBackButton;
