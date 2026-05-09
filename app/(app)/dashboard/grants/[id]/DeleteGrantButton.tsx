"use client";
import { Spinner } from "@/app/components";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { deleteGrant } from "@/lib/actions/grant/grantActions";
import { AlertDialog, Flex } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface Props {
  grantId: string;
}

const DeleteGrantButton = ({ grantId }: Props) => {
  const router = useRouter();
  const [error, setError] = useState(false);
  const [isDeleting, setDeleting] = useState(false);

  const handleDeleteGrant = async () => {
    try {
      // to simuate error
      // throw new Error();
      setDeleting(true);
      // await axios.delete(`/api/grants/${grantId}`);
      await deleteGrant(grantId); // Use SA instead of RH-API;
      router.push("/dashboard/grants/list");
      router.refresh();
    } catch (error) {
      setDeleting(false);
      setError(true);
    }
  };

  return (
    <>
      <AlertDialog.Root>
        <AlertDialog.Trigger>
          <button
            type="button"
            disabled={isDeleting}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "w-full justify-start",
            )}
          >
            Delete Grant
            {isDeleting && <Spinner />}
          </button>
        </AlertDialog.Trigger>
        <AlertDialog.Content>
          <AlertDialog.Title>Confirm deletion</AlertDialog.Title>
          <AlertDialog.Description className="text-zinc-600">
            Are you sure you want to delet this grant? This action cannot be
            undone.
          </AlertDialog.Description>
          <Flex mt="4" gap="3">
            <AlertDialog.Cancel>
              <button
                type="button"
                className={buttonVariants({ variant: "outline" })}
              >
                Cancel
              </button>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              <button
                type="button"
                className={buttonVariants({ variant: "default" })}
                onClick={handleDeleteGrant}
              >
                Delete Grant
              </button>
            </AlertDialog.Action>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>
      <AlertDialog.Root open={error}>
        <AlertDialog.Content>
          <AlertDialog.Title>Error</AlertDialog.Title>
          <AlertDialog.Description className="text-zinc-600">
            This grant cannot be deleted.
          </AlertDialog.Description>
          <Button
            variant="outline"
            className="mt-2"
            onClick={() => {
              setError(false);
            }}
          >
            OK
          </Button>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </>
  );
};

export default DeleteGrantButton;
