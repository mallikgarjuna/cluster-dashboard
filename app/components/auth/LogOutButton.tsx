"use client";

import { logOutUser } from "@/lib/actions/authActions";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";

export default function LogOutButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      disabled={isPending}
      onClick={async () => {
        startTransition(async () => {
          await logOutUser();
        });
      }}
    >
      {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
      Log out
    </Button>
  );
}
