import { Button } from "@radix-ui/themes";
import Link from "next/link";
import React from "react";

const GrantsPage = () => {
  return (
    <Button>
      <Link href="/grants/new">New Grant</Link>
    </Button>
  );
};

export default GrantsPage;
