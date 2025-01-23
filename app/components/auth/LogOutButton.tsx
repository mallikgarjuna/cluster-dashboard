"use client";

import { logOutUser } from "@/lib/actions/authActions";
import { Button, Spinner } from "@nextui-org/react";
import { useTransition } from "react";

export default function LogOutButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      disabled={isPending}
      onPress={async () => {
        startTransition(async () => {
          await logOutUser();
        });
      }}
    >
      Log out
      {isPending && <Spinner size="sm" />}
    </Button>
  );
}
