import { Button } from "@radix-ui/themes";
import Link from "next/link";
import React from "react";

const GrantActions = () => {
  return (
    <div className="mb-5">
      <Button>
        <Link href="/grants/new">New Grant</Link>
      </Button>
    </div>
  );
};

export default GrantActions;
