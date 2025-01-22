"use client";
import { Spinner } from "@/app/components";
import { AlertDialog, Button, Flex } from "@radix-ui/themes";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface Props {
  grantId: string;
}

const DeleteGrantButton = ({ grantId }: Props) => {
  const router = useRouter();
  const [error, setError] = useState(false);
  const [isDeleting, setDeleting] = useState(false);

  const deleteGrant = async () => {
    try {
      // to simuate error
      // throw new Error();
      setDeleting(true);
      await axios.delete(`/api/grants/${grantId}`);
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
          <Button color="red" disabled={isDeleting}>
            Delete Grant
            {isDeleting && <Spinner />}
          </Button>
        </AlertDialog.Trigger>
        <AlertDialog.Content>
          <AlertDialog.Title>Confirm Deletetion</AlertDialog.Title>
          <AlertDialog.Description>
            Are you sure you want to delet this grant? This action cannot be
            undone.
          </AlertDialog.Description>
          <Flex mt="4" gap="3">
            <AlertDialog.Cancel>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              <Button color="red" onClick={deleteGrant}>
                Delete Grant
              </Button>
            </AlertDialog.Action>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>
      <AlertDialog.Root open={error}>
        <AlertDialog.Content>
          <AlertDialog.Title>Error</AlertDialog.Title>
          <AlertDialog.Description>
            This grant cannot be deleted.
          </AlertDialog.Description>
          <Button
            variant="soft"
            color="gray"
            mt="2"
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
